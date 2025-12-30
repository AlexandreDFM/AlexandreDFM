/**
 * File Name: media-post-form.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 30/12/2025
 * Description: Form for creating/editing media posts
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

import { Card } from "@/components/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Upload, Image as ImageIcon, Video } from "lucide-react";
import { useMediaPost } from "@/hooks/useMedia";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

interface MediaPostFormProps {
    id?: string;
}

interface FormData {
    title_en: string;
    title_fr: string;
    caption_en: string;
    caption_fr: string;
    media_type: "image" | "video";
    tags: string;
    media_file?: File;
}

export default function MediaPostForm({ id }: MediaPostFormProps) {
    const router = useRouter();
    const { locale } = useTranslation();
    const { post: existingPost, loading: loadingPost } = id
        ? useMediaPost(id, locale as "en" | "fr")
        : { post: null, loading: false };

    const [formData, setFormData] = useState<FormData>({
        title_en: "",
        title_fr: "",
        caption_en: "",
        caption_fr: "",
        media_type: "image",
        tags: "",
    });

    const [activeTab, setActiveTab] = useState<"en" | "fr">("en");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (existingPost) {
            setFormData({
                title_en: existingPost.title || "",
                title_fr: existingPost.title || "",
                caption_en: existingPost.caption || "",
                caption_fr: existingPost.caption || "",
                media_type: existingPost.mediaType || "image",
                tags: existingPost.tags?.join(", ") || "",
            });
            if (existingPost.mediaUrl) {
                setPreview(existingPost.mediaUrl);
            }
        }
    }, [existingPost]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, media_file: file }));

            // Determine media type from file
            const fileType = file.type.startsWith("video/") ? "video" : "image";
            setFormData((prev) => ({ ...prev, media_type: fileType }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const tagsArray = formData.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            const data = new FormData();
            data.append("title_en", formData.title_en);
            data.append("title_fr", formData.title_fr || formData.title_en);
            data.append("caption_en", formData.caption_en);
            data.append("caption_fr", formData.caption_fr || formData.caption_en);
            data.append("media_type", formData.media_type);
            data.append("tags", JSON.stringify(tagsArray));

            if (formData.media_file) {
                data.append("media_file", formData.media_file);
            } else if (!id) {
                setError("Please upload a media file");
                setLoading(false);
                return;
            }

            const url = id ? `/api/media/${id}` : "/api/media";
            const method = id ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                body: data,
            });

            if (response.ok) {
                router.push(`/${locale}/admin/media`);
                router.refresh();
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to save media post");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingPost) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg bg-red-500/10 px-4 py-3 text-red-500">
                    {error}
                </div>
            )}

            {/* Language Tabs */}
            <Card>
                <div className="border-b border-default-200">
                    <div className="flex gap-1 p-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("en")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === "en"
                                    ? "bg-primary text-white"
                                    : "text-default-600 hover:bg-default-100"
                            }`}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("fr")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === "fr"
                                    ? "bg-primary text-white"
                                    : "text-default-600 hover:bg-default-100"
                            }`}
                        >
                            Français
                        </button>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    {/* Title */}
                    <div>
                        <label
                            htmlFor={`title_${activeTab}`}
                            className="mb-2 block text-sm font-medium"
                        >
                            Title *
                        </label>
                        <input
                            type="text"
                            id={`title_${activeTab}`}
                            name={`title_${activeTab}`}
                            value={formData[`title_${activeTab}`]}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter media title"
                        />
                    </div>

                    {/* Caption */}
                    <div>
                        <label
                            htmlFor={`caption_${activeTab}`}
                            className="mb-2 block text-sm font-medium"
                        >
                            Caption *
                        </label>
                        <textarea
                            id={`caption_${activeTab}`}
                            name={`caption_${activeTab}`}
                            value={formData[`caption_${activeTab}`]}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Describe this media post"
                        />
                    </div>
                </div>
            </Card>

            {/* Media Settings */}
            <Card>
                <div className="space-y-6 p-6">
                    {/* Media File Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Media File {!id && "*"}
                        </label>
                        <div className="space-y-4">
                            {preview && (
                                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg bg-default-100">
                                    {formData.media_type === "image" ? (
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <video
                                            src={preview}
                                            controls
                                            className="h-full w-full object-contain"
                                        />
                                    )}
                                </div>
                            )}
                            <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-default-200 bg-default-100 px-4 py-8 transition-colors hover:border-primary hover:bg-default-200">
                                <div className="space-y-2 text-center">
                                    <Upload className="mx-auto h-8 w-8 text-default-400" />
                                    <div className="text-sm text-default-600">
                                        <span className="font-medium text-primary">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </div>
                                    <p className="text-xs text-default-400">
                                        Images (PNG, JPG, GIF) or Videos (MP4, WebM)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Media Type (read-only, auto-detected) */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Media Type
                        </label>
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${
                                    formData.media_type === "image"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-default-200 bg-default-100"
                                }`}
                            >
                                <ImageIcon className="h-5 w-5" />
                                <span className="text-sm font-medium">Image</span>
                            </div>
                            <div
                                className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${
                                    formData.media_type === "video"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-default-200 bg-default-100"
                                }`}
                            >
                                <Video className="h-5 w-5" />
                                <span className="text-sm font-medium">Video</span>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-default-400">
                            Auto-detected from uploaded file
                        </p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="mb-2 block text-sm font-medium">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="photography, nature, art (comma-separated)"
                        />
                    </div>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 rounded-lg border border-default-200 px-4 py-2 font-medium transition-colors hover:bg-default-100"
                >
                    <X className="h-5 w-5" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    <Save className="h-5 w-5" />
                    {loading ? "Saving..." : id ? "Update" : "Create"} Media Post
                </button>
            </div>
        </form>
    );
}
