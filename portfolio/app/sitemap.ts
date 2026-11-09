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
import { getSiteUrl } from "@/util/config";
import { getBlogPosts } from "@/util/directus";
import { locales } from "@/util/i18n";

// Built at request time (cached one hour): the blog posts come from Directus
export const dynamic = "force-dynamic";
export const revalidate = 3600;

const STATIC_PAGES = ["", "/about", "/projects", "/blog", "/contact", "/gallery"];

function alternates(baseUrl: string, path: string) {
    return {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path}`])),
    };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteUrl();

    const staticRoutes: MetadataRoute.Sitemap = STATIC_PAGES.flatMap((page) =>
        locales.map((locale) => ({
            url: `${baseUrl}/${locale}${page}`,
            changeFrequency: "monthly" as const,
            priority: page === "" ? 1.0 : 0.8,
            alternates: alternates(baseUrl, page),
        })),
    );

    // Same slug in both languages (the content is translated per field)
    const posts = await getBlogPosts("en");
    const blogRoutes: MetadataRoute.Sitemap = posts.flatMap((post) =>
        locales.map((locale) => ({
            url: `${baseUrl}/${locale}/blog/${post.slug}`,
            lastModified: post.date_updated || post.date_created || undefined,
            changeFrequency: "weekly" as const,
            priority: 0.7,
            alternates: alternates(baseUrl, `/blog/${post.slug}`),
        })),
    );

    return [...staticRoutes, ...blogRoutes];
}
