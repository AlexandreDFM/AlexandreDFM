/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: API route for fetching a single blog post by slug
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

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug, getDirectusClient } from "@/util/directus";
import { updateItem, deleteItem, uploadFiles, readItems } from "@directus/sdk";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const searchParams = request.nextUrl.searchParams;
        const language = (searchParams.get("lang") || "en") as "en" | "fr";

        const post = await getBlogPostBySlug(slug, language);

        if (!post) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error in blog post API route:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog post" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;

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

        // Find post by slug
        const posts = await directus.request(
            readItems("blog_posts", {
                filter: { slug: { _eq: slug } },
                limit: 1,
            }),
        );

        if (!posts || posts.length === 0) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 },
            );
        }

        const postId = posts[0].id;

        // Handle cover image upload if provided
        let coverImageId: string | undefined;
        const coverImage = formData.get("cover_image") as File | null;

        if (coverImage && coverImage.size > 0) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", coverImage);

            const uploadResult = await directus.request(
                uploadFiles(uploadFormData as any),
            );
            coverImageId = uploadResult.id;
        }

        // Parse tags
        const tags = JSON.parse(formData.get("tags") as string);

        // Update blog post
        const updateData: any = {
            title_en: formData.get("title_en"),
            title_fr: formData.get("title_fr"),
            slug: formData.get("slug"),
            excerpt_en: formData.get("excerpt_en"),
            excerpt_fr: formData.get("excerpt_fr"),
            content_en: formData.get("content_en"),
            content_fr: formData.get("content_fr"),
            category: formData.get("category") || null,
            tags: tags,
            reading_time: parseInt(formData.get("reading_time") as string),
            is_featured: formData.get("is_featured") === "true",
            status: formData.get("status") || "published",
        };

        if (coverImageId) {
            updateData.cover_image = coverImageId;
        }

        const updatedPost = await directus.request(
            updateItem("blog_posts", postId, updateData),
        );

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Error updating blog post:", error);
        return NextResponse.json(
            { error: "Failed to update blog post" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;

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

        // Find post by slug
        const posts = await directus.request(
            readItems("blog_posts", {
                filter: { slug: { _eq: slug } },
                limit: 1,
            }),
        );

        if (!posts || posts.length === 0) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 },
            );
        }

        const postId = posts[0].id;

        // Delete the post
        await directus.request(deleteItem("blog_posts", postId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json(
            { error: "Failed to delete blog post" },
            { status: 500 },
        );
    }
}
