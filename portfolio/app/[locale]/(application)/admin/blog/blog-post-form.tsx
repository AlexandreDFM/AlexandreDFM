/**
 * File Name: blog-post-form.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 29/12/2025
 * Description: This is the blog-post-form.tsx
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
import { Save, X, Eye } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlog";

interface BlogPostFormProps {
    slug?: string;
}

interface FormData {
    title_en: string;
    title_fr: string;
    slug: string;
    excerpt_en: string;
    excerpt_fr: string;
    content_en: string;
    content_fr: string;
    category: string;
    tags: string;
    reading_time: number;
    is_featured: boolean;
    cover_image?: File;
}

export default function BlogPostForm({ slug }: BlogPostFormProps) {
    const router = useRouter();
    const { post: existingPost, loading: loadingPost } = slug
        ? useBlogPost(slug, "en")
        : { post: null, loading: false };

    const [formData, setFormData] = useState<FormData>({
        title_en: "",
        title_fr: "",
        slug: "",
        excerpt_en: "",
        excerpt_fr: "",
        content_en: "",
        content_fr: "",
        category: "",
        tags: "",
        reading_time: 5,
        is_featured: false,
    });

    const [activeTab, setActiveTab] = useState<"en" | "fr">("en");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (existingPost) {
            setFormData({
                title_en: existingPost.title || "",
                title_fr: existingPost.title || "", // If translations exist, adjust this
                slug: existingPost.slug,
                excerpt_en: existingPost.excerpt || "",
                excerpt_fr: existingPost.excerpt || "",
                content_en: existingPost.content || "",
                content_fr: existingPost.content || "",
                category: existingPost.category || "",
                tags: existingPost.tags?.join(", ") || "",
                reading_time: existingPost.readingTime || 5,
                is_featured: existingPost.is_featured || false,
            });
        }
    }, [existingPost]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : type === "number"
                      ? parseInt(value) || 0
                      : value,
        }));

        // Auto-generate slug from English title if creating new post
        if (name === "title_en" && !slug) {
            const newSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug: newSlug }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, cover_image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
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
            data.append("slug", formData.slug);
            data.append("excerpt_en", formData.excerpt_en);
            data.append(
                "excerpt_fr",
                formData.excerpt_fr || formData.excerpt_en,
            );
            data.append("content_en", formData.content_en);
            data.append(
                "content_fr",
                formData.content_fr || formData.content_en,
            );
            data.append("category", formData.category);
            data.append("tags", JSON.stringify(tagsArray));
            data.append("reading_time", formData.reading_time.toString());
            data.append("is_featured", formData.is_featured.toString());
            data.append("status", isDraft ? "draft" : "published");

            if (formData.cover_image) {
                data.append("cover_image", formData.cover_image);
            }

            const url = slug ? `/api/blog/${slug}` : "/api/blog";
            const method = slug ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                body: data,
            });

            if (response.ok) {
                router.push("/admin/blog");
                router.refresh();
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to save post");
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
        <form className="space-y-6">
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
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label
                            htmlFor={`excerpt_${activeTab}`}
                            className="mb-2 block text-sm font-medium"
                        >
                            Excerpt *
                        </label>
                        <textarea
                            id={`excerpt_${activeTab}`}
                            name={`excerpt_${activeTab}`}
                            value={formData[`excerpt_${activeTab}`]}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Brief summary of the post"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label
                            htmlFor={`content_${activeTab}`}
                            className="mb-2 block text-sm font-medium"
                        >
                            Content (HTML) *
                        </label>
                        <textarea
                            id={`content_${activeTab}`}
                            name={`content_${activeTab}`}
                            value={formData[`content_${activeTab}`]}
                            onChange={handleInputChange}
                            required
                            rows={15}
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="<p>Write your content here in HTML format...</p>"
                        />
                        <p className="mt-1 text-xs text-default-400">
                            Supports HTML formatting. Use tags like &lt;p&gt;,
                            &lt;h2&gt;, &lt;strong&gt;, &lt;a&gt;, etc.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Metadata */}
            <Card>
                <div className="space-y-6 p-6">
                    <h3 className="text-lg font-semibold">Post Settings</h3>

                    {/* Slug */}
                    <div>
                        <label
                            htmlFor="slug"
                            className="mb-2 block text-sm font-medium"
                        >
                            URL Slug *
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            required
                            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="my-blog-post-slug"
                        />
                        <p className="mt-1 text-xs text-default-400">
                            Lowercase letters, numbers, and hyphens only
                        </p>
                    </div>

                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium"
                        >
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Tutorial, Guide, News, etc."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label
                            htmlFor="tags"
                            className="mb-2 block text-sm font-medium"
                        >
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="React, TypeScript, Tutorial (comma-separated)"
                        />
                    </div>

                    {/* Reading Time */}
                    <div>
                        <label
                            htmlFor="reading_time"
                            className="mb-2 block text-sm font-medium"
                        >
                            Reading Time (minutes)
                        </label>
                        <input
                            type="number"
                            id="reading_time"
                            name="reading_time"
                            value={formData.reading_time}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label
                            htmlFor="cover_image"
                            className="mb-2 block text-sm font-medium"
                        >
                            Cover Image
                        </label>
                        <input
                            type="file"
                            id="cover_image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full rounded-lg border border-default-200 bg-default-100 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {preview && (
                            <div className="mt-4">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-48 w-full rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_featured"
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleInputChange}
                            className="h-5 w-5 rounded border-default-200 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <label htmlFor="is_featured" className="text-sm font-medium">
                            Mark as Featured Post
                        </label>
                    </div>
                </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-between gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 rounded-lg border border-default-200 px-6 py-3 font-medium transition-colors hover:bg-default-100"
                >
                    <X className="h-5 w-5" />
                    Cancel
                </button>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-default-200 px-6 py-3 font-medium transition-colors hover:bg-default-100 disabled:opacity-50"
                    >
                        <Eye className="h-5 w-5" />
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        onClick={(e) => handleSubmit(e, false)}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? "Saving..." : slug ? "Update Post" : "Publish Post"}
                    </button>
                </div>
            </div>
        </form>
    );
}
