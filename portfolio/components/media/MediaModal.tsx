/**
 * File Name: MediaModal.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Modal component for displaying media posts
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

import Image from "next/image";
import { useEffect } from "react";
import { IMediaPost } from "@/types/IMediaPost";
import { X, Heart, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaModalProps {
    post: IMediaPost;
    onClose: () => void;
}

export default function MediaModal({ post, onClose }: MediaModalProps) {
    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                onClick={onClose}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 rounded-full bg-zinc-900/80 p-2 text-white transition-colors hover:bg-zinc-800"
                    aria-label="Close modal"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="relative mx-auto flex max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-zinc-900"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Media Container */}
                    <div className="flex-1 flex items-center justify-center bg-black">
                        {post.mediaType === "image" ? (
                            <div className="relative h-full w-full max-h-[90vh]">
                                <Image
                                    src={post.mediaUrl}
                                    alt={post.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        ) : (
                            <video
                                src={post.mediaUrl}
                                controls
                                autoPlay
                                className="max-h-[90vh] w-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>

                    {/* Info Sidebar */}
                    <div className="flex w-full max-w-sm flex-col overflow-y-auto bg-zinc-900 p-6 md:w-96">
                        <div className="space-y-4">
                            {/* Title */}
                            <h2 className="text-2xl font-bold">{post.title}</h2>

                            {/* Likes */}
                            <div className="flex items-center gap-2 text-default-400">
                                <Heart className="h-5 w-5" />
                                <span className="font-medium">
                                    {post.likes} likes
                                </span>
                            </div>

                            {/* Caption */}
                            {post.caption && (
                                <p className="text-default-300">
                                    {post.caption}
                                </p>
                            )}

                            {/* Tags */}
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

                            {/* Date */}
                            {post.date_created && (
                                <div className="flex items-center gap-2 text-sm text-default-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(
                                            post.date_created,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
