/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 26/12/2025
 * Description: Proxy route for project images from Directus
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

import { NextRequest } from "next/server";

const directusUrl =
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://my-api.alexandredfm.fr/";
const directusToken =
    process.env.DIRECTUS_WEBSITE_TOKEN || "YOUR_DIRECTUS_STATIC_TOKEN";

// Enable caching for project images (revalidate every hour)
export const revalidate = 3600;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        if (!id) {
            return new Response("Missing image ID", { status: 400 });
        }

        // Construct the file URL
        const fileUrl = `${directusUrl.replace(/\/$/, "")}/assets/${id}`;

        console.log(`[API/projects/image] Fetching image: ${fileUrl}`);

        // Fetch the actual image file with authentication
        const assetRes = await fetch(fileUrl, {
            headers: {
                Authorization: `Bearer ${directusToken}`,
            },
        });

        if (!assetRes.ok) {
            console.error(
                `[API/projects/image] Failed to fetch image: ${assetRes.status} ${assetRes.statusText}`,
            );
            return new Response("Image not found", { status: 404 });
        }

        if (!assetRes.body) {
            console.error("[API/projects/image] Image response has no body");
            return new Response("Image not found", { status: 404 });
        }

        const contentType =
            assetRes.headers.get("Content-Type") || "image/jpeg";

        return new Response(assetRes.body, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control":
                    "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        console.error("[API/projects/image] Internal server error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
