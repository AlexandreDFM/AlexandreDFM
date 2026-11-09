/**
 * File Name: page.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Individual blog post page
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

import { Metadata } from "next";
import BlogPostClient from "./blog-post-client";
import { getBlogPostBySlug } from "@/util/directus";
import { blogPostJsonLd, jsonLdScript } from "@/util/metadata";
import { defaultLocale, isLocale, type Locale } from "@/util/i18n";

type Params = Promise<{ locale: string; slug: string }>;

function toLocale(value: string): Locale {
    return isLocale(value) ? value : defaultLocale;
}

/** Plain-text excerpt for meta descriptions (the excerpt may contain HTML). */
function plainText(html: string | null | undefined, max = 160): string {
    const text = (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function titleFromSlug(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = await getBlogPostBySlug(slug, toLocale(locale));
    if (!post) {
        return { title: titleFromSlug(slug), robots: { index: false } };
    }
    const description = plainText(post.excerpt) || "Read this blog post on AlexandreDFM";
    return {
        title: post.title,
        description,
        openGraph: {
            type: "article",
            title: post.title,
            description,
            publishedTime: post.date_created || undefined,
            modifiedTime: post.date_updated || undefined,
            ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
        },
    };
}

export default async function BlogPostPage({ params }: { params: Params }) {
    const { slug, locale } = await params;
    const lang = toLocale(locale);
    const post = await getBlogPostBySlug(slug, lang);

    return (
        <>
            {post && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: jsonLdScript(
                            blogPostJsonLd({
                                title: post.title,
                                description: plainText(post.excerpt),
                                slug: post.slug,
                                locale: lang,
                                publishedAt: post.date_created || undefined,
                                updatedAt: post.date_updated || undefined,
                                image: post.coverImageUrl,
                            }),
                        ),
                    }}
                />
            )}
            <BlogPostClient slug={slug} />
        </>
    );
}
