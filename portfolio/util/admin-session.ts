/**
 * File Name: admin-session.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 9/11/2026
 * Description: Admin session cookies and Directus access-token refresh
 *              (shared by the server actions and the middleware)
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
 *
 */

import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_TOKEN_COOKIE = "directus_admin_token";
export const ADMIN_REFRESH_COOKIE = "directus_admin_refresh";

/** Lifetime of the session cookies; Directus REFRESH_TOKEN_TTL should be the same (7d). */
const SESSION_SECONDS = 7 * 24 * 60 * 60;
/** Refresh a little before the access token actually expires. */
const REFRESH_MARGIN_SECONDS = 60;

export function sessionCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: SESSION_SECONDS,
    };
}

/** Expiry (seconds since epoch) read from a JWT payload, without verifying it. */
function jwtExpiry(token: string): number | null {
    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        const exp = JSON.parse(json).exp;
        return typeof exp === "number" ? exp : null;
    } catch {
        return null;
    }
}

export function needsRefresh(request: NextRequest): boolean {
    const refresh = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value;
    if (!refresh) return false;
    const access = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (!access) return true;
    const exp = jwtExpiry(access);
    return exp === null || exp - REFRESH_MARGIN_SECONDS < Date.now() / 1000;
}

export interface RefreshedSession {
    accessToken: string;
    refreshToken: string | null;
}

/**
 * Exchange the refresh token for a new access token.
 * Returns null if Directus refuses (the session must then be cleared).
 */
export async function refreshSession(
    request: NextRequest,
    directusUrl: string,
): Promise<RefreshedSession | null> {
    const refresh = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value;
    if (!refresh) return null;
    try {
        const res = await fetch(`${directusUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refresh, mode: "json" }),
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`refresh failed: ${res.status}`);
        const { data } = await res.json();
        if (!data?.access_token) throw new Error("refresh: no access token");
        return { accessToken: data.access_token, refreshToken: data.refresh_token || null };
    } catch (error) {
        console.error("[admin] Session refresh failed:", error);
        return null;
    }
}

/** Write (or clear) the session cookies on a response. */
export function applySession(
    response: NextResponse,
    session: RefreshedSession | null,
): void {
    if (!session) {
        response.cookies.delete(ADMIN_TOKEN_COOKIE);
        response.cookies.delete(ADMIN_REFRESH_COOKIE);
        return;
    }
    response.cookies.set(ADMIN_TOKEN_COOKIE, session.accessToken, sessionCookieOptions());
    if (session.refreshToken) {
        response.cookies.set(ADMIN_REFRESH_COOKIE, session.refreshToken, sessionCookieOptions());
    }
}
