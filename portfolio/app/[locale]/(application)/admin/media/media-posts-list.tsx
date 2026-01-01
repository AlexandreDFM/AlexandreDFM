/**
 * File Name: media-posts-list.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 30/12/2025
 * Description: Media posts list component for admin
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

import { useMedia } from "@/hooks/useMedia";
import Link from "next/link";
import Image from "next/image";
import {
    Edit,
    Trash2,
    Eye,
    Heart,
    Video,
    Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/card";
import { useTranslation } from "@/hooks/useTranslation";

export default function MediaPostsList() {
    const { locale } = useTranslation();
    const { posts, loading, error } = useMedia({
        language: locale as "en" | "fr",
    });
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this media post?"))
            return;

        setDeleting(id);
        try {
            const response = await fetch(`/api/media/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert("Failed to delete media post");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-red-500">
                Error loading media posts: {error.message}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <Card>
                <div className="p-12 text-center">
                    <p className="text-default-400">
                        No media posts yet. Create your first media post!
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <Card key={post.id}>
                    <div className="space-y-3 p-4">
                        <div className="bg-default-100 relative aspect-square w-full overflow-hidden rounded-lg">
                            {post.mediaType === "image" ? (
                                <Image
                                    src={post.mediaUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <video
                                    src={post.mediaUrl}
                                    className="h-full w-full object-cover"
                                    controls
                                />
                            )}
                            <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5">
                                {post.mediaType === "image" ? (
                                    <ImageIcon className="h-4 w-4 text-white" />
                                ) : (
                                    <Video className="h-4 w-4 text-white" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="line-clamp-1 font-semibold">
                                {post.title}
                            </h3>
                            <p className="text-default-400 line-clamp-2 text-sm">
                                {post.caption}
                            </p>

                            <div className="text-default-400 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    <span>{post.likes || 0}</span>
                                </div>
                                {post.date_created && (
                                    <span>
                                        {new Date(
                                            post.date_created,
                                        ).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {post.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Link
                                    href={`/${locale}/gallery`}
                                    target="_blank"
                                    className="bg-default-100 text-default-600 hover:bg-default-200 flex-1 rounded-lg p-2 text-center text-sm transition-colors"
                                    title="View in gallery"
                                >
                                    <Eye className="mx-auto h-4 w-4" />
                                </Link>
                                <Link
                                    href={`/${locale}/admin/media/edit/${post.id}`}
                                    className="bg-default-100 text-default-600 hover:bg-default-200 flex-1 rounded-lg p-2 text-center text-sm transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="mx-auto h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={deleting === post.id}
                                    className="flex-1 rounded-lg bg-red-500/10 p-2 text-red-600 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                                    title="Delete"
                                >
                                    <Trash2 className="mx-auto h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
