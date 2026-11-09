/**
 * File Name: auth.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 29/12/2025
 * Description: This is the auth.ts
 * Copyright (c) 2025 Alexandre Kévin DE FREITAS MARTINS
 * Version: 1.0.0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use server";

import { cookies } from "next/headers";
import {
    authentication,
    createDirectus,
    readMe,
    readPolicyGlobals,
    rest,
} from "@directus/sdk";
import { getDirectusUrl } from "@/util/config";
import {
    ADMIN_REFRESH_COOKIE,
    ADMIN_TOKEN_COOKIE,
    sessionCookieOptions,
} from "@/util/admin-session";

function client() {
    return createDirectus(getDirectusUrl())
        .with(rest())
        .with(authentication("json"));
}

export async function login(
    email: string,
    password: string,
): Promise<{ success: boolean; error?: string }> {
    const genericError = "Invalid email or password";
    try {
        const directus = client();
        const result = await directus.login({ email, password });

        if (!result?.access_token) {
            return { success: false, error: genericError };
        }

        // Only users allowed to use the Directus app can manage the portfolio
        // (the read-only "website" user and public users cannot).
        await directus.setToken(result.access_token);
        const globals = await directus.request(readPolicyGlobals());
        if (!globals?.app_access) {
            return { success: false, error: "This account cannot manage the portfolio" };
        }

        const cookieStore = await cookies();
        cookieStore.set(ADMIN_TOKEN_COOKIE, result.access_token, sessionCookieOptions());
        if (result.refresh_token) {
            cookieStore.set(ADMIN_REFRESH_COOKIE, result.refresh_token, sessionCookieOptions());
        }

        return { success: true };
    } catch (error) {
        console.error("[admin] Login failed:", error);
        return { success: false, error: genericError };
    }
}

export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_TOKEN_COOKIE);
    cookieStore.delete(ADMIN_REFRESH_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
    if (!token) return false;

    try {
        // The middleware refreshes an expired access token before we get here
        const directus = client();
        await directus.setToken(token);
        await directus.request(readMe({ fields: ["id"] }));
        return true;
    } catch {
        return false;
    }
}

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value || null;
}
