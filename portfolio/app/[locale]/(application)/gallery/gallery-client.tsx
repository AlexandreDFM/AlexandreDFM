/**
 * File Name: gallery-client.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Client component for Instagram-style media gallery
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

import { useState } from "react";
import Image from "next/image";
import { useMedia } from "@/hooks/useMedia";
import { useTranslation } from "@/hooks/useTranslation";
import { Heart, Play, X } from "lucide-react";
import { IMediaPost } from "@/types/IMediaPost";
import MediaModal from "@/components/media/MediaModal";

export default function GalleryClient() {
    const { t, locale } = useTranslation();
    const { posts, loading, error } = useMedia({
        language: locale as "en" | "fr",
    });
    const [selectedPost, setSelectedPost] = useState<IMediaPost | null>(null);

    if (loading) {
        return (
            <main
                className="mx-auto max-w-7xl space-y-8 md:space-y-12"
                role="main"
            >
                <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Gallery
                    </h1>
                    <p className="text-default-400">
                        {t("gallery.description") ||
                            "Explore my visual journey"}
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
                        Gallery
                    </h1>
                </header>
                <div className="text-center">
                    <p className="text-red-500">
                        Error loading media: {error.message}
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
                        Gallery
                    </h1>
                    <p className="text-default-400">
                        {t("gallery.description") ||
                            "Explore my visual journey"}
                    </p>
                </header>
                <div className="text-center">
                    <p className="text-default-400">
                        {t("gallery.noPosts") ||
                            "No media yet. Check back soon!"}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl space-y-8 md:space-y-12" role="main">
            <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Gallery
                </h1>
                <p className="text-default-400">
                    {t("gallery.description") || "Explore my visual journey"}
                </p>
            </header>

            {/* Instagram-style Grid */}
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {posts.map((post) => (
                    <button
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="group relative aspect-square overflow-hidden bg-zinc-900 transition-opacity hover:opacity-90"
                        aria-label={`View ${post.title}`}
                    >
                        {/* Media Display */}
                        {post.mediaType === "image" ? (
                            <Image
                                src={post.mediaUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <>
                                <Image
                                    src={
                                        post.thumbnailUrl || "/placeholder.jpg"
                                    }
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="rounded-full bg-white/90 p-3">
                                        <Play className="h-6 w-6 text-black" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="flex items-center gap-4 text-white">
                                <span className="flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    {post.likes}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Media Modal */}
            {selectedPost && (
                <MediaModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </main>
    );
}
