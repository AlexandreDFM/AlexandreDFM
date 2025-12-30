/**
 * File Name: useBlog.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Custom hook for fetching blog posts from API
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

import { useState, useEffect } from "react";
import { IBlogPost } from "@/types/IBlogPost";

interface UseBlogOptions {
    language?: "en" | "fr";
    featured?: boolean;
    limit?: number;
}

export function useBlog(options: UseBlogOptions = {}) {
    const { language = "en", featured = false, limit } = options;
    const [posts, setPosts] = useState<IBlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    lang: language,
                    ...(featured && { featured: "true" }),
                    ...(limit && { limit: limit.toString() }),
                });

                const response = await fetch(`/api/blog?${params.toString()}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch blog posts");
                }

                const data = await response.json();
                setPosts(data);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Unknown error"),
                );
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, [language, featured, limit]);

    return { posts, loading, error };
}

export function useBlogPost(slug: string, language: "en" | "fr" = "en") {
    const [post, setPost] = useState<IBlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                setLoading(true);
                const params = new URLSearchParams({ lang: language });
                const response = await fetch(
                    `/api/blog/${slug}?${params.toString()}`,
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch blog post");
                }

                const data = await response.json();
                setPost(data);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Unknown error"),
                );
                setPost(null);
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchPost();
        }
    }, [slug, language]);

    return { post, loading, error };
}
