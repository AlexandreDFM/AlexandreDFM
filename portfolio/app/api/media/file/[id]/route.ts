/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: API route for fetching media files from Directus
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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const directusUrl =
            process.env.NEXT_PUBLIC_DIRECTUS_URL ||
            "https://my-api.alexandredfm.fr/";
        const directusToken =
            process.env.DIRECTUS_WEBSITE_TOKEN || "YOUR_DIRECTUS_STATIC_TOKEN";

        const fileUrl = `${directusUrl.replace(/\/$/, "")}/assets/${id}`;

        const assetRes = await fetch(fileUrl, {
            headers: {
                Authorization: `Bearer ${directusToken}`,
            },
        });

        if (!assetRes.ok) {
            console.error(
                `Failed to fetch media file: ${assetRes.status} ${assetRes.statusText}`,
            );
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 },
            );
        }

        if (!assetRes.body) {
            return NextResponse.json(
                { error: "No media data" },
                { status: 404 },
            );
        }

        const contentType =
            assetRes.headers.get("Content-Type") || "application/octet-stream";

        return new NextResponse(assetRes.body, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error fetching media file:", error);
        return NextResponse.json(
            { error: "Failed to fetch media" },
            { status: 500 },
        );
    }
}
