/**
 * File Name: config.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 9/11/2026
 * Description: Server-side runtime configuration (read when the server starts,
 *              not inlined at build time, so one image works in every environment)
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
 *
 */

import "server-only";

const DEFAULT_SITE_URL = "https://alexandredfm.fr";
const DEFAULT_DIRECTUS_URL = "https://my-api.alexandredfm.fr";

function withoutTrailingSlash(url: string): string {
    return url.replace(/\/+$/, "");
}

/** Public URL of this site, e.g. https://alexandredfm.fr (no trailing slash). */
export function getSiteUrl(): string {
    return withoutTrailingSlash(
        process.env.SITE_URL ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            DEFAULT_SITE_URL,
    );
}

/** Base URL of the Directus API, e.g. https://my-api.alexandredfm.fr (no trailing slash). */
export function getDirectusUrl(): string {
    return withoutTrailingSlash(
        process.env.DIRECTUS_URL ||
            // Legacy name, kept while the deployments are migrated
            process.env.NEXT_PUBLIC_DIRECTUS_URL ||
            DEFAULT_DIRECTUS_URL,
    );
}

/** Static token of the read-only "website" Directus user. */
export function getDirectusToken(): string | undefined {
    return process.env.DIRECTUS_WEBSITE_TOKEN || undefined;
}

/** true on staging/preview deployments: pages are served with noindex. */
export function isNoIndex(): boolean {
    return process.env.SITE_NOINDEX === "true";
}
