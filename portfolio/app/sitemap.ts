/**
 * File Name: sitemap.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2026
 * Description: Generates dynamic sitemap for search engines
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
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

import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://alexandredfm.fr";
    const locales = ["en", "fr"];

    // Static pages with locales
    const staticPages = [
        "",
        "/about",
        "/projects",
        "/blog",
        "/contact",
        "/gallery",
    ];

    const staticRoutes = staticPages.flatMap((page) =>
        locales.map((locale) => ({
            url: `${baseUrl}/${locale}${page}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: page === "" ? 1.0 : 0.8,
            alternates: {
                languages: {
                    en: `${baseUrl}/en${page}`,
                    fr: `${baseUrl}/fr${page}`,
                },
            },
        })),
    );

    // Try to fetch dynamic blog posts (this can be enhanced with actual blog post fetching)
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        // You can implement actual blog post fetching here
        // const blogPosts = await fetchBlogPosts();
        // blogRoutes = blogPosts.flatMap((post) =>
        //     locales.map((locale) => ({
        //         url: `${baseUrl}/${locale}/blog/${post.slug}`,
        //         lastModified: post.updatedAt || new Date(),
        //         changeFrequency: "weekly" as const,
        //         priority: 0.7,
        //     }))
        // );
    } catch (error) {
        console.error("Error fetching blog posts for sitemap:", error);
    }

    // Try to fetch dynamic projects (this can be enhanced with actual project fetching)
    let projectRoutes: MetadataRoute.Sitemap = [];
    try {
        // You can implement actual project fetching here
        // const projects = await fetchProjects();
        // projectRoutes = projects.flatMap((project) =>
        //     locales.map((locale) => ({
        //         url: `${baseUrl}/${locale}/projects/${project.id}`,
        //         lastModified: project.updatedAt || new Date(),
        //         changeFrequency: "monthly" as const,
        //         priority: 0.6,
        //     }))
        // );
    } catch (error) {
        console.error("Error fetching projects for sitemap:", error);
    }

    return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
