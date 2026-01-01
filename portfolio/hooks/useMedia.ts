/**
 * File Name: useMedia.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Custom hook for fetching media posts from API
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
import { IMediaPost } from "@/types/IMediaPost";

interface UseMediaOptions {
    language?: "en" | "fr";
    limit?: number;
}

export function useMedia(options: UseMediaOptions = {}) {
    const { language = "en", limit } = options;
    const [posts, setPosts] = useState<IMediaPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    lang: language,
                    ...(limit && { limit: limit.toString() }),
                });

                const response = await fetch(`/api/media?${params.toString()}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch media posts");
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
    }, [language, limit]);

    return { posts, loading, error };
}

export function useMediaPost(id: string, language: "en" | "fr" = "en") {
    const [post, setPost] = useState<IMediaPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                setLoading(true);
                const params = new URLSearchParams({ lang: language });
                const response = await fetch(
                    `/api/media/${id}?${params.toString()}`,
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch media post");
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

        if (id) {
            fetchPost();
        }
    }, [id, language]);

    return { post, loading, error };
}
