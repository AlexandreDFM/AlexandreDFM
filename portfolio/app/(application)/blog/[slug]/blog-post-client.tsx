/**
 * File Name: blog-post-client.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Client component for individual blog post page
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

"use client";

import Link from "next/link";
import Image from "next/image";
import { useBlogPost } from "@/hooks/useBlog";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock, Calendar, Tag, ArrowLeft } from "lucide-react";

interface BlogPostClientProps {
    slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
    const { t, locale } = useTranslation();
    const { post, loading, error } = useBlogPost(slug, locale as "en" | "fr");

    if (loading) {
        return (
            <main
                className="mx-auto max-w-4xl space-y-8 md:space-y-12"
                role="main"
            >
                <div className="flex h-96 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
                </div>
            </main>
        );
    }

    if (error || !post) {
        return (
            <main
                className="mx-auto max-w-4xl space-y-8 md:space-y-12"
                role="main"
            >
                <div className="text-center space-y-4">
                    <p className="text-red-500">
                        {error?.message || "Blog post not found"}
                    </p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl space-y-8" role="main">
            {/* Back button */}
            <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-default-400 hover:text-primary transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                {t("blog.backToBlog") || "Back to Blog"}
            </Link>

            {/* Article Header */}
            <article className="space-y-6">
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-default-400">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min read
                        </span>
                        {post.date_created && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.date_created).toLocaleDateString(
                                    locale === "fr" ? "fr-FR" : "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    },
                                )}
                            </span>
                        )}
                        {post.category && (
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {post.category}
                            </span>
                        )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 rounded-full border border-default-200 px-3 py-1 text-xs font-medium"
                                >
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Cover Image */}
                {post.coverImageUrl && (
                    <div className="relative h-100 w-full overflow-hidden rounded-lg">
                        <Image
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Article Content */}
                <div
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Article Footer */}
                <footer className="mt-12 pt-6 border-t border-default-200">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t("blog.backToBlog") || "Back to Blog"}
                        </Link>
                        {post.date_updated &&
                            post.date_updated !== post.date_created && (
                                <p className="text-sm text-default-400">
                                    {t("blog.lastUpdated") || "Last updated"}:{" "}
                                    {new Date(
                                        post.date_updated,
                                    ).toLocaleDateString(
                                        locale === "fr" ? "fr-FR" : "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        },
                                    )}
                                </p>
                            )}
                    </div>
                </footer>
            </article>
        </main>
    );
}
