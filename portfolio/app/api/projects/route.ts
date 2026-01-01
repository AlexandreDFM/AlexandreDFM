/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: API route for fetching projects from Directus
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

import { getProjects } from "@/util/directus";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createItem, uploadFiles } from "@directus/sdk";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const language = (searchParams.get("lang") as "en" | "fr") || "en";
        const featured = searchParams.get("featured") === "true";

        const projects = await getProjects(language, featured);

        return NextResponse.json({
            success: true,
            data: projects,
            count: projects.length,
        });
    } catch (error) {
        console.error("Error in projects API:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch projects",
                data: [],
                count: 0,
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("directus_admin_token");

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const formData = await request.formData();

        const title_en = formData.get("title_en") as string;
        const title_fr = formData.get("title_fr") as string;
        const description_en = formData.get("description_en") as string;
        const description_fr = formData.get("description_fr") as string;
        const role = formData.get("role") as string;
        const duration = formData.get("duration") as string;
        const date = formData.get("date") as string;
        const github = formData.get("github") as string;
        const skills = JSON.parse(formData.get("skills") as string);
        const technologies = JSON.parse(formData.get("technologies") as string);
        const achievements = JSON.parse(formData.get("achievements") as string);
        const category = JSON.parse(formData.get("category") as string);
        const is_featured = formData.get("is_featured") === "true";
        const imageFile = formData.get("image") as File;

        let imageId: string | undefined;

        if (imageFile) {
            const imageFormData = new FormData();
            imageFormData.append("file", imageFile);

            const uploadResponse = await fetch(
                `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/files`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    },
                    body: imageFormData,
                },
            );

            if (uploadResponse.ok) {
                const uploadData = await uploadResponse.json();
                imageId = uploadData.data.id;
            }
        }

        const projectData = {
            translations: [
                {
                    languages_code: "en-US",
                    title: title_en,
                    description: description_en,
                },
                {
                    languages_code: "fr-FR",
                    title: title_fr || title_en,
                    description: description_fr || description_en,
                },
            ],
            role,
            duration,
            date,
            github,
            skills,
            technologies,
            achievements,
            category,
            is_featured,
            ...(imageId && { image: imageId }),
        };

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/projects`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.value}`,
                },
                body: JSON.stringify(projectData),
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {
                    error:
                        errorData.errors?.[0]?.message ||
                        "Failed to create project",
                },
                { status: response.status },
            );
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data: data.data });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 },
        );
    }
}
