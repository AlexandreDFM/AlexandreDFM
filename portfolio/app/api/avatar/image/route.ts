/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 26/12/2025
 * Description: This is the route.ts
 * Copyright (c) 2025 Hownee Inc.
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

import { fetchAvatarImage } from "@/util/directus";

// Enable caching for avatar images (revalidate every hour)
export const revalidate = 3600;

export async function GET() {
    try {
        const result = await fetchAvatarImage();

        if (!result) {
            console.warn(
                "[API/avatar/image] Avatar not found or failed to fetch",
            );
            return new Response("Avatar not found", { status: 404 });
        }

        return new Response(result.stream, {
            status: 200,
            headers: {
                "Content-Type": result.contentType,
                "Cache-Control":
                    "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        console.error("[API/avatar/image] Internal server error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
