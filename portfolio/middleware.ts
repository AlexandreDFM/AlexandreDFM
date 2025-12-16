/**
 * File Name: middleware.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 10/8/2025
 * Description: This is the middleware.ts
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

import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes } from "./router/routes";

let locales = ["fr", "en"];

// Get the preferred locale from browser
function getLocale(request: NextRequest) {
    const acceptLanguage = request.headers.get("accept-language");
    return acceptLanguage?.split(",")[0].split("-")[0] || "fr";
}

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("token")?.value;
    if (!protectedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    if (!accessToken) {
        return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }

    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname;

    // Skip if the request is for an API route, static files, or other special paths
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/") ||
        pathname.startsWith("/static/") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Check if the pathname starts with a locale
    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    if (pathnameHasLocale) return NextResponse.next();

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;

    // e.g. incoming request is /products
    // The new URL is now /fr/products
    return NextResponse.redirect(request.nextUrl);
}
