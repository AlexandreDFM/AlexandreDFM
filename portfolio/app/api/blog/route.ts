/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: API route for fetching blog posts
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
import { createItem, uploadFiles } from "@directus/sdk";
import { getBlogPosts, getDirectusClient } from "@/util/directus";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const language = (searchParams.get("lang") || "en") as "en" | "fr";
        const featured = searchParams.get("featured") === "true";
        const limit = searchParams.get("limit")
            ? parseInt(searchParams.get("limit")!)
            : undefined;

        const posts = await getBlogPosts(language, featured, limit);

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error in blog API route:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog posts" },
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

        // Handle cover image upload
        let coverImageId: string | undefined;
        const coverImage = formData.get("cover_image") as File | null;

        if (coverImage) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", coverImage);

            const uploadResult = await directus.request(
                uploadFiles(uploadFormData as any),
            );
            coverImageId = uploadResult.id;
        }

        // Parse tags
        const tags = JSON.parse(formData.get("tags") as string);

        // Create blog post
        const newPost = await directus.request(
            createItem("blog_posts", {
                title_en: formData.get("title_en") as string,
                title_fr: formData.get("title_fr") as string,
                slug: formData.get("slug") as string,
                excerpt_en: formData.get("excerpt_en") as string,
                excerpt_fr: formData.get("excerpt_fr") as string,
                content_en: formData.get("content_en") as string,
                content_fr: formData.get("content_fr") as string,
                category: (formData.get("category") as string) || undefined,
                tags: tags,
                reading_time: parseInt(formData.get("reading_time") as string),
                is_featured: formData.get("is_featured") === "true",
                cover_image: coverImageId || undefined,
                status: ((formData.get("status") as string) || "published") as
                    | "published"
                    | "draft"
                    | "archived",
            }),
        );

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json(
            { error: "Failed to create blog post" },
            { status: 500 },
        );
    }
}
