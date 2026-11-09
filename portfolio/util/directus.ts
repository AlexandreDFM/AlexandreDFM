/**
 * File Name: directus.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Directus client configuration
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

import {
    rest,
    readMe,
    readItems,
    staticToken,
    createDirectus,
} from "@directus/sdk";

import "server-only";

import { getDirectusToken, getDirectusUrl } from "@/util/config";
import { sanitizeHtml } from "@/util/sanitize";
import { IProjectCollection } from "@/types/directus/IProjectCollection";
import { IBlogPostCollection } from "@/types/directus/IBlogPostCollection";
import { IMediaPostCollection } from "@/types/directus/IMediaPostCollection";

interface Schema {
    projects: IProjectCollection[];
    blog_posts: IBlogPostCollection[];
    media_posts: IMediaPostCollection[];
}

// Create Directus client (server side only: the token must never reach the browser)
const directusUrl = getDirectusUrl();
const directusToken = getDirectusToken() || "";

export const directus = createDirectus<Schema>(directusUrl)
    .with(rest())
    .with(staticToken(directusToken));

// Helper function to get Directus client with user token (for API routes that need write access)
export async function getDirectusClient(authToken?: string) {
    if (authToken) {
        // Create authenticated client with user's token
        return createDirectus<Schema>(directusUrl)
            .with(rest())
            .with(staticToken(authToken));
    }
    // Fallback to static token for read-only operations
    return directus;
}

// Helper function to get projects with language filtering
export async function getProjects(
    language: "en" | "fr" = "en",
    onlyFeatured = false,
) {
    try {
        const projects = await directus.request(
            readItems("projects", {
                filter: {
                    status: { _eq: "published" },
                    // ...(onlyFeatured && { is_featured: { _eq: true } })
                },
                sort: ["sort", "date"],
            }),
        );

        // Transform projects to match the expected format with language-specific fields
        return projects.map(
            (project: IProjectCollection) => ({
                    id: project.id,
                    title:
                        language === "fr" && project.title_fr
                            ? project.title_fr
                            : project.title,
                    description:
                        language === "fr" && project.description_fr
                            ? project.description_fr
                            : project.description,
                    date: project.date,
                    github: project.github,
                    imageUrl: project.image
                        ? `/api/projects/image/${project.image}`
                        : null,
                    role:
                        language === "fr" && project.role_fr
                            ? project.role_fr
                            : project.role,
                    duration:
                        language === "fr" && project.duration_fr
                            ? project.duration_fr
                            : project.duration,
                    skills:
                        language === "fr" && project.skills_fr
                            ? project.skills_fr
                            : project.skills,
                    technologies:
                        language === "fr" && project.technologies_fr
                            ? project.technologies_fr
                            : project.technologies,
                    achievements:
                        language === "fr" && project.achievements_fr
                            ? project.achievements_fr
                            : project.achievements,
                    category: project.category,
                    is_featured: project.is_featured,
            }),
        );
    } catch (error) {
        console.error("Error fetching projects from Directus:", error);

        if (error instanceof Error) {
            if (error.message.includes("401")) {
                console.error(
                    "Authentication failed: Check your DIRECTUS_WEBSITE_TOKEN",
                );
            } else if (error.message.includes("403")) {
                console.error(
                    "Access forbidden: Check role permissions for projects collection",
                );
            }
        }

        return [];
    }
}

/** File id of the avatar of the "website" Directus user, or null. */
export async function getAvatarFileId(): Promise<string | null> {
    try {
        const user = await directus.request(readMe({ fields: ["avatar"] }));
        return (user?.avatar as string | null | undefined) || null;
    } catch (error) {
        console.error("[Directus] Error fetching the avatar id:", error);
        return null;
    }
}

// Helper function to get blog posts with language filtering
export async function getBlogPosts(
    language: "en" | "fr" = "en",
    onlyFeatured = false,
    limit?: number,
) {
    try {
        const posts = await directus.request(
            readItems("blog_posts", {
                filter: {
                    status: { _eq: "published" },
                    ...(onlyFeatured && { is_featured: { _eq: true } }),
                },
                sort: ["-date_created"],
                ...(limit && { limit }),
            }),
        );

        return posts.map((post: IBlogPostCollection) => ({
            id: post.id,
            title:
                language === "fr" && post.title_fr ? post.title_fr : post.title,
            slug: post.slug,
            excerpt: sanitizeHtml(
                language === "fr" && post.excerpt_fr
                    ? post.excerpt_fr
                    : post.excerpt,
            ),
            content: sanitizeHtml(
                language === "fr" && post.content_fr
                    ? post.content_fr
                    : post.content,
            ),
            coverImageUrl: post.cover_image
                ? `/api/blog/image/${post.cover_image}`
                : null,
            readingTime: post.reading_time || 5,
            tags: language === "fr" && post.tags_fr ? post.tags_fr : post.tags,
            category:
                language === "fr" && post.category_fr
                    ? post.category_fr
                    : post.category,
            is_featured: post.is_featured,
            date_created: post.date_created,
            date_updated: post.date_updated,
        }));
    } catch (error) {
        console.error("Error fetching blog posts from Directus:", error);
        return [];
    }
}

// Helper function to get a single blog post by slug
export async function getBlogPostBySlug(
    slug: string,
    language: "en" | "fr" = "en",
) {
    try {
        const posts = await directus.request(
            readItems("blog_posts", {
                filter: {
                    status: { _eq: "published" },
                    slug: { _eq: slug },
                },
                limit: 1,
            }),
        );

        if (posts.length === 0) return null;

        const post = posts[0];
        return {
            id: post.id,
            title:
                language === "fr" && post.title_fr ? post.title_fr : post.title,
            slug: post.slug,
            excerpt: sanitizeHtml(
                language === "fr" && post.excerpt_fr
                    ? post.excerpt_fr
                    : post.excerpt,
            ),
            content: sanitizeHtml(
                language === "fr" && post.content_fr
                    ? post.content_fr
                    : post.content,
            ),
            coverImageUrl: post.cover_image
                ? `/api/blog/image/${post.cover_image}`
                : null,
            readingTime: post.reading_time || 5,
            tags: language === "fr" && post.tags_fr ? post.tags_fr : post.tags,
            category:
                language === "fr" && post.category_fr
                    ? post.category_fr
                    : post.category,
            is_featured: post.is_featured,
            date_created: post.date_created,
            date_updated: post.date_updated,
        };
    } catch (error) {
        console.error("Error fetching blog post from Directus:", error);
        return null;
    }
}

// Helper function to get media posts with language filtering
export async function getMediaPosts(
    language: "en" | "fr" = "en",
    limit?: number,
) {
    try {
        const posts = await directus.request(
            readItems("media_posts", {
                filter: {
                    status: { _eq: "published" },
                },
                sort: ["-date_created"],
                ...(limit && { limit }),
            }),
        );

        return posts.map((post: IMediaPostCollection) => ({
            id: post.id,
            title:
                language === "fr" && post.title_fr ? post.title_fr : post.title,
            caption:
                language === "fr" && post.caption_fr
                    ? post.caption_fr
                    : post.caption,
            mediaUrl: `/api/media/file/${post.media}`,
            mediaType: post.media_type,
            thumbnailUrl: post.thumbnail
                ? `/api/media/file/${post.thumbnail}`
                : null,
            tags: language === "fr" && post.tags_fr ? post.tags_fr : post.tags,
            likes: post.likes || 0,
            date_created: post.date_created,
        }));
    } catch (error) {
        console.error("Error fetching media posts from Directus:", error);
        return [];
    }
}

// Helper function to get a single media post by ID
export async function getMediaPostById(
    id: string,
    language: "en" | "fr" = "en",
) {
    try {
        const post = await directus.request(
            readItems("media_posts", {
                filter: {
                    status: { _eq: "published" },
                    id: { _eq: id },
                },
                limit: 1,
            }),
        );

        if (!post || post.length === 0) return null;

        const mediaPost = post[0];
        return {
            id: mediaPost.id,
            title:
                language === "fr" && mediaPost.title_fr
                    ? mediaPost.title_fr
                    : mediaPost.title,
            caption:
                language === "fr" && mediaPost.caption_fr
                    ? mediaPost.caption_fr
                    : mediaPost.caption,
            mediaUrl: `/api/media/file/${mediaPost.media}`,
            mediaType: mediaPost.media_type,
            thumbnailUrl: mediaPost.thumbnail
                ? `/api/media/file/${mediaPost.thumbnail}`
                : null,
            tags:
                language === "fr" && mediaPost.tags_fr
                    ? mediaPost.tags_fr
                    : mediaPost.tags,
            likes: mediaPost.likes || 0,
            date_created: mediaPost.date_created,
        };
    } catch (error) {
        console.error("Error fetching media post from Directus:", error);
        return null;
    }
}
