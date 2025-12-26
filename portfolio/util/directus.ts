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

// Define the schema for your collections
interface IProjectCollection {
    id: string;
    status?: "published" | "draft" | "archived";
    sort?: number;
    user_created?: string;
    user_updated?: string;
    date_created?: string;
    date_updated?: string;

    title: string;
    description: string;
    date?: string;
    image?: string; // File ID for project image/thumbnail

    github?: string;
    role?: string;
    duration?: string;
    skills?: string[];
    technologies?: string[];
    achievements?: string[];
    category?: ("professional" | "personal" | "academic")[];
    is_featured?: boolean;

    // Translations fields
    title_en?: string;
    title_fr?: string;
    description_en?: string;
    description_fr?: string;
    role_en?: string;
    role_fr?: string;
    duration_en?: string;
    duration_fr?: string;
    skills_en?: string[];
    skills_fr?: string[];
    technologies_en?: string[];
    technologies_fr?: string[];
    achievements_en?: string[];
    achievements_fr?: string[];
}

interface Schema {
    projects: IProjectCollection[];
}

// Create Directus client
const directusUrl =
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://my-api.alexandredfm.fr/";
const directusToken =
    process.env.DIRECTUS_WEBSITE_TOKEN || "YOUR_DIRECTUS_STATIC_TOKEN";

export const directus = createDirectus<Schema>(directusUrl)
    .with(rest())
    .with(staticToken(directusToken));

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

        console.log("Fetched projects:", projects.length, "projects found.");

        // Transform projects to match the expected format with language-specific fields
        return projects.map((project: IProjectCollection) => (
            console.log("Processing project:", project.category, project.title),
            {
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
        }));
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

export async function getAvatarUrl(): Promise<string | null> {
    try {
        const user = await directus.request(readMe({ fields: ["avatar"] }));

        console.log("Fetched user data from Directus:", user);

        if (user.avatar) {
            console.log("User avatar file ID:", user.avatar);
            return `${directusUrl.replace(/\/$/, "")}/assets/${user.avatar}`;
        } else {
            console.warn("User has no avatar set.");
        }

        return null;
    } catch (error) {
        console.error("Error fetching user avatar from Directus:", error);
        return null;
    }
}

// Service to fetch the avatar image as a stream and content type
export async function fetchAvatarImage(): Promise<{
    stream: ReadableStream<Uint8Array>;
    contentType: string;
} | null> {
    try {
        // Fetch the current user's data to get the avatar file ID
        const user = await directus.request(readMe({ fields: ["avatar"] }));

        if (!user.avatar) {
            console.warn("[Directus] User has no avatar set");
            return null;
        }

        console.log("[Directus] Fetching avatar with file ID:", user.avatar);

        // Construct the file URL using the stored directusUrl
        const fileUrl = `${directusUrl.replace(/\/$/, "")}/assets/${
            user.avatar
        }`;

        // Fetch the actual image file with authentication
        const assetRes = await fetch(fileUrl, {
            headers: {
                Authorization: `Bearer ${directusToken}`,
            },
        });

        if (!assetRes.ok) {
            console.error(
                `[Directus] Failed to fetch avatar: ${assetRes.status} ${assetRes.statusText}`,
            );
            return null;
        }

        if (!assetRes.body) {
            console.error("[Directus] Avatar response has no body");
            return null;
        }

        const contentType =
            assetRes.headers.get("Content-Type") || "image/jpeg";
        console.log(
            "[Directus] Avatar fetched successfully, content-type:",
            contentType,
        );

        return {
            stream: assetRes.body,
            contentType,
        };
    } catch (error) {
        console.error("[Directus] Error fetching avatar image:", error);
        return null;
    }
}

export async function testDirectusConnection() {
    try {
        const projects = await directus.request(
            readItems("projects", {
                limit: 1,
                filter: { status: { _eq: "published" } },
            }),
        );
        console.log("Directus connection successful");
        return true;
    } catch (error) {
        console.error("Directus connection failed:", error);
        return false;
    }
}
