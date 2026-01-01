/**
 * File Name: blog-client.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Client component for blog listing page
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
import { useBlog } from "@/hooks/useBlog";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock, Calendar, Tag } from "lucide-react";
import { Card } from "@/components/card";

export default function BlogClient() {
    const { t, locale } = useTranslation();
    const { posts, loading, error } = useBlog({
        language: locale as "en" | "fr",
    });

    const featuredPosts = posts.filter((p) => p.is_featured);
    const regularPosts = posts.filter((p) => !p.is_featured);

    if (loading) {
        return (
            <main
                className="mx-auto max-w-7xl space-y-8 md:space-y-12"
                role="main"
            >
                <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Blog
                    </h1>
                    <p className="text-default-400">
                        {t("blog.description") ||
                            "Sharing my coding experiences and insights"}
                    </p>
                </header>
                <div className="flex h-96 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main
                className="mx-auto max-w-7xl space-y-8 md:space-y-12"
                role="main"
            >
                <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Blog
                    </h1>
                </header>
                <div className="text-center">
                    <p className="text-red-500">
                        Error loading blog posts: {error.message}
                    </p>
                </div>
            </main>
        );
    }

    if (posts.length === 0) {
        return (
            <main
                className="mx-auto max-w-7xl space-y-8 md:space-y-12"
                role="main"
            >
                <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Blog
                    </h1>
                    <p className="text-default-400">
                        {t("blog.description") ||
                            "Sharing my coding experiences and insights"}
                    </p>
                </header>
                <div className="text-center">
                    <p className="text-default-400">
                        {t("blog.noPosts") ||
                            "No blog posts yet. Check back soon!"}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl space-y-8 md:space-y-12" role="main">
            <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Blog
                </h1>
                <p className="text-default-400">
                    {t("blog.description") ||
                        "Sharing my coding experiences and insights"}
                </p>
            </header>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("blog.featured") || "Featured Posts"}
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {featuredPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/${locale}/blog/${post.slug}`}
                                className="group block h-full transition-all hover:scale-[1.02]"
                            >
                                <Card>
                                    {post.coverImageUrl && (
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image
                                                src={post.coverImageUrl}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-3 p-6">
                                        <h3 className="group-hover:text-primary text-xl font-bold transition-colors">
                                            {post.title}
                                        </h3>
                                        <p
                                            className="text-default-400 line-clamp-2"
                                            dangerouslySetInnerHTML={{
                                                __html: post.excerpt,
                                            }}
                                        />
                                        <div className="text-default-400 flex flex-wrap items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {post.readingTime} min read
                                            </span>
                                            {post.date_created && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(
                                                        post.date_created,
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                                                    >
                                                        <Tag className="h-3 w-3" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Regular Posts */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                    {t("blog.allPosts") || "All Posts"}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {regularPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/${locale}/blog/${post.slug}`}
                            className="group block h-full transition-all hover:scale-[1.02]"
                        >
                            <Card>
                                {post.coverImageUrl && (
                                    <div className="relative h-40 w-full overflow-hidden">
                                        <Image
                                            src={post.coverImageUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="space-y-2 p-4">
                                    <h3 className="group-hover:text-primary line-clamp-2 text-lg font-bold transition-colors">
                                        {post.title}
                                    </h3>
                                    <p
                                        className="text-default-400 line-clamp-3 text-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: post.excerpt,
                                        }}
                                    />
                                    <div className="text-default-400 flex items-center gap-3 text-xs">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {post.readingTime} min
                                        </span>
                                        {post.date_created && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(
                                                    post.date_created,
                                                ).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
