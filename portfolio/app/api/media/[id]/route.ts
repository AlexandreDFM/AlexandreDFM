/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: API route for fetching a single media post by ID
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

import { getMediaPostById } from "@/util/directus";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDirectusClient } from "@/util/directus";
import { updateItem, deleteItem, uploadFiles } from "@directus/sdk";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const language = (searchParams.get("lang") || "en") as "en" | "fr";

        const post = await getMediaPostById(id, language);

        if (!post) {
            return NextResponse.json(
                { error: "Media post not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error in media post API route:", error);
        return NextResponse.json(
            { error: "Failed to fetch media post" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

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

        // Handle media file upload if provided
        let mediaId: string | undefined;
        const mediaFile = formData.get("media_file") as File | null;

        if (mediaFile && mediaFile.size > 0) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", mediaFile);

            const uploadResult = await directus.request(
                uploadFiles(uploadFormData as any),
            );
            mediaId = uploadResult.id;
        }

        // Parse tags
        const tags = JSON.parse(formData.get("tags") as string);

        // Update media post
        const updateData: any = {
            title_en: formData.get("title_en"),
            title_fr: formData.get("title_fr"),
            caption_en: formData.get("caption_en"),
            caption_fr: formData.get("caption_fr"),
            media_type: formData.get("media_type"),
            tags: tags,
        };

        if (mediaId) {
            updateData.media = mediaId;
        }

        const updatedPost = await directus.request(
            updateItem("media_posts", id, updateData),
        );

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Error updating media post:", error);
        return NextResponse.json(
            { error: "Failed to update media post" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        // Get user's auth token from cookies
        const cookieStore = await cookies();
        const authToken = cookieStore.get("directus_admin_token")?.value;

        if (!authToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const directus = await getDirectusClient(authToken);

        // Delete the media post
        await directus.request(deleteItem("media_posts", id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting media post:", error);
        return NextResponse.json(
            { error: "Failed to delete media post" },
            { status: 500 },
        );
    }
}
