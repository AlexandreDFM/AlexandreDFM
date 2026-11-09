/**
 * File Name: directus-asset.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 9/11/2026
 * Description: Safe proxy for Directus assets (images, videos) served through /api/*
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
 *
 */

import "server-only";

import { getDirectusToken, getDirectusUrl } from "@/util/config";

/** Directus file ids are UUIDs. Anything else is rejected before any request is made. */
const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isDirectusId(id: unknown): id is string {
    return typeof id === "string" && UUID_RE.test(id);
}

type AssetKind = "image" | "media";

const ALLOWED_TYPES: Record<AssetKind, RegExp> = {
    // SVG is excluded on purpose: it can carry scripts and would run on this domain
    image: /^image\/(png|jpe?g|webp|avif|gif)$/i,
    media: /^(image\/(png|jpe?g|webp|avif|gif)|video\/(mp4|webm|ogg|quicktime))$/i,
};

export interface ProxyAssetOptions {
    kind: AssetKind;
    /** Resize/convert images on the Directus side (ignored for videos). */
    transform?: { width?: number; format?: "webp" | "avif" | "jpg"; quality?: number };
    /** Cache-Control of a successful response. */
    cacheControl?: string;
    /** Label used in the server logs. */
    label: string;
}

/**
 * Fetch a Directus asset with the website token and stream it back.
 * - the id must be a UUID (prevents ../ path traversal to other Directus routes)
 * - only image/video content types are forwarded, with nosniff
 * - the real upstream status is logged, the client gets a generic answer
 */
export async function proxyDirectusAsset(
    id: unknown,
    { kind, transform, cacheControl, label }: ProxyAssetOptions,
): Promise<Response> {
    if (!isDirectusId(id)) {
        return new Response("Invalid asset id", { status: 400 });
    }

    const token = getDirectusToken();
    const url = new URL(`${getDirectusUrl()}/assets/${id}`);
    if (transform) {
        if (transform.width) url.searchParams.set("width", String(transform.width));
        if (transform.format) url.searchParams.set("format", transform.format);
        if (transform.quality) url.searchParams.set("quality", String(transform.quality));
        url.searchParams.set("withoutEnlargement", "true");
    }

    try {
        let upstream = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        // Videos cannot be transformed: retry without the transform parameters
        if (!upstream.ok && transform && upstream.status === 400) {
            upstream = await fetch(`${getDirectusUrl()}/assets/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
        }

        if (!upstream.ok || !upstream.body) {
            const detail = await upstream.text().catch(() => "");
            console.error(
                `[${label}] Directus answered ${upstream.status} for asset ${id}: ${detail.slice(0, 300)}`,
            );
            return new Response("Asset not found", {
                status: 404,
                headers: { "Cache-Control": "no-store" },
            });
        }

        const contentType = (upstream.headers.get("Content-Type") || "")
            .split(";")[0]
            .trim();
        if (!ALLOWED_TYPES[kind].test(contentType)) {
            console.error(
                `[${label}] Refused content type "${contentType}" for asset ${id}`,
            );
            return new Response("Unsupported media type", { status: 415 });
        }

        const headers = new Headers({
            "Content-Type": contentType,
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "default-src 'none'; sandbox",
            "Cache-Control":
                cacheControl ||
                "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        });
        const length = upstream.headers.get("Content-Length");
        if (length) headers.set("Content-Length", length);

        return new Response(upstream.body, { status: 200, headers });
    } catch (error) {
        console.error(`[${label}] Error while fetching asset ${id}:`, error);
        return new Response("Internal server error", {
            status: 502,
            headers: { "Cache-Control": "no-store" },
        });
    }
}
