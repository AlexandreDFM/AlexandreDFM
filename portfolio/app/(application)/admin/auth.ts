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
import { createDirectus, rest, authentication, readMe } from "@directus/sdk";

const ADMIN_TOKEN_COOKIE = "directus_admin_token";
const ADMIN_REFRESH_COOKIE = "directus_admin_refresh";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const directusUrl =
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://my-api.alexandredfm.fr/";

export async function login(
    email: string,
    password: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        const client = createDirectus(directusUrl)
            .with(rest())
            .with(authentication("json"));

        // Attempt to login with Directus
        const result = await client.login({ email, password });

        if (!result || !result.access_token) {
            return { success: false, error: "Invalid credentials" };
        }

        // Verify user has admin access by checking their role
        await client.setToken(result.access_token);
        const user = await client.request(readMe());

        if (!user) {
            return { success: false, error: "Failed to verify user" };
        }

        // Store tokens in cookies
        const cookieStore = await cookies();
        const expiresAt = new Date(Date.now() + SESSION_DURATION);

        cookieStore.set(ADMIN_TOKEN_COOKIE, result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            sameSite: "lax",
            path: "/",
        });

        if (result.refresh_token) {
            cookieStore.set(ADMIN_REFRESH_COOKIE, result.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: expiresAt,
                sameSite: "lax",
                path: "/",
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error.message || "Authentication failed",
        };
    }
}

export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_TOKEN_COOKIE);
    cookieStore.delete(ADMIN_REFRESH_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE);

    if (!token?.value) {
        return false;
    }

    try {
        // Verify token is still valid by checking with Directus
        const client = createDirectus(directusUrl)
            .with(rest())
            .with(authentication("json"));

        await client.setToken(token.value);
        await client.request(readMe());

        return true;
    } catch (error) {
        // Token is invalid or expired
        await logout();
        return false;
    }
}

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE);
    return token?.value || null;
}
