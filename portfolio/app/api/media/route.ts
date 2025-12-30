/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: API route for fetching media posts
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

import { getMediaPosts } from "@/util/directus";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDirectusClient } from "@/util/directus";
import { createItem, uploadFiles } from "@directus/sdk";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const language = (searchParams.get("lang") || "en") as "en" | "fr";
        const limit = searchParams.get("limit")
            ? parseInt(searchParams.get("limit")!)
            : undefined;

        const posts = await getMediaPosts(language, limit);

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error in media API route:", error);
        return NextResponse.json(
            { error: "Failed to fetch media posts" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get user's auth token from cookies
        const cookieStore = await cookies();
        const authToken = cookieStore.get("directus_admin_token")?.value;

        if (!authToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const formData = await request.formData();
        const directus = await getDirectusClient(authToken);

        // Handle media file upload
        const mediaFile = formData.get("media_file") as File | null;

        if (!mediaFile) {
            return NextResponse.json(
                { error: "Media file is required" },
                { status: 400 },
            );
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", mediaFile);

        const uploadResult = await directus.request(
            uploadFiles(uploadFormData as any),
        );
        const mediaId = uploadResult.id;

        // Parse tags
        const tags = JSON.parse(formData.get("tags") as string);

        // Create media post
        const newPost = await directus.request(
            createItem("media_posts", {
                title_en: formData.get("title_en") as string,
                title_fr: formData.get("title_fr") as string,
                caption_en: formData.get("caption_en") as string,
                caption_fr: formData.get("caption_fr") as string,
                media_type: formData.get("media_type") as "image" | "video",
                media_file: mediaId,
                tags: tags,
                likes: 0,
            }),
        );

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Error creating media post:", error);
        return NextResponse.json(
            { error: "Failed to create media post" },
            { status: 500 },
        );
    }
}
