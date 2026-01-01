/**
 * File Name: project-form.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 30/12/2025
 * Description: Form for creating/editing projects
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
import { Save, X, Upload, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

interface ProjectFormProps {
    id?: string;
}

interface FormData {
    title_en: string;
    title_fr: string;
    description_en: string;
    description_fr: string;
    role: string;
    duration: string;
    date: string;
    github: string;
    skills: string;
    technologies: string;
    achievements: string;
    category: ("professional" | "personal" | "academic")[];
    is_featured: boolean;
    image?: File;
}

export default function ProjectForm({ id }: ProjectFormProps) {
    const router = useRouter();
    const { locale } = useTranslation();

    const [formData, setFormData] = useState<FormData>({
        title_en: "",
        title_fr: "",
        description_en: "",
        description_fr: "",
        role: "",
        duration: "",
        date: "",
        github: "",
        skills: "",
        technologies: "",
        achievements: "",
        category: [],
        is_featured: false,
    });

    const [activeTab, setActiveTab] = useState<"en" | "fr">("en");
    const [loading, setLoading] = useState(false);
    const [loadingProject, setLoadingProject] = useState(!!id);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProject();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProject = async () => {
        try {
            setLoadingProject(true);
            const response = await fetch(`/api/projects/${id}?lang=${locale}`);
            if (response.ok) {
                const data = await response.json();
                const project = data.data;

                setFormData({
                    title_en: project.title || "",
                    title_fr: project.title || "",
                    description_en: project.description || "",
                    description_fr: project.description || "",
                    role: project.role || "",
                    duration: project.duration || "",
                    date: project.date ? project.date.split("T")[0] : "",
                    github: project.github || "",
                    skills: project.skills?.join(", ") || "",
                    technologies: project.technologies?.join(", ") || "",
                    achievements: project.achievements?.join("\n") || "",
                    category: project.category || [],
                    is_featured: project.is_featured || false,
                });

                if (project.imageUrl) {
                    setPreview(project.imageUrl);
                }
            }
        } catch (err) {
            console.error("Error fetching project:", err);
            setError("Failed to load project");
        } finally {
            setLoadingProject(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleCategoryChange = (
        cat: "professional" | "personal" | "academic",
    ) => {
        setFormData((prev) => ({
            ...prev,
            category: prev.category.includes(cat)
                ? prev.category.filter((c) => c !== cat)
                : [...prev.category, cat],
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
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
            const data = new FormData();
            data.append("title_en", formData.title_en);
            data.append("title_fr", formData.title_fr || formData.title_en);
            data.append("description_en", formData.description_en);
            data.append(
                "description_fr",
                formData.description_fr || formData.description_en,
            );
            data.append("role", formData.role);
            data.append("duration", formData.duration);
            data.append("date", formData.date);
            data.append("github", formData.github);

            const skillsArray = formData.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            data.append("skills", JSON.stringify(skillsArray));

            const techArray = formData.technologies
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            data.append("technologies", JSON.stringify(techArray));

            const achievementsArray = formData.achievements
                .split("\n")
                .map((a) => a.trim())
                .filter(Boolean);
            data.append("achievements", JSON.stringify(achievementsArray));

            data.append("category", JSON.stringify(formData.category));
            data.append("is_featured", formData.is_featured.toString());

            if (formData.image) {
                data.append("image", formData.image);
            }

            const url = id ? `/api/projects/${id}` : "/api/projects";
            const method = id ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                body: data,
            });

            if (response.ok) {
                router.push(`/${locale}/admin/projects`);
                router.refresh();
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to save project");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingProject) {
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
                <div className="border-default-200 border-b">
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
                            className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                            placeholder="Enter project title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor={`description_${activeTab}`}
                            className="mb-2 block text-sm font-medium"
                        >
                            Description *
                        </label>
                        <textarea
                            id={`description_${activeTab}`}
                            name={`description_${activeTab}`}
                            value={formData[`description_${activeTab}`]}
                            onChange={handleInputChange}
                            required
                            rows={6}
                            className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                            placeholder="Describe the project"
                        />
                    </div>
                </div>
            </Card>

            {/* Project Details */}
            <Card>
                <div className="space-y-6 p-6">
                    <h3 className="text-lg font-semibold">Project Details</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-medium"
                            >
                                Your Role
                            </label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                                placeholder="e.g., Full Stack Developer"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label
                                htmlFor="duration"
                                className="mb-2 block text-sm font-medium"
                            >
                                Duration
                            </label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                                placeholder="e.g., 6 months"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label
                                htmlFor="date"
                                className="mb-2 block text-sm font-medium"
                            >
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                            />
                        </div>

                        {/* GitHub */}
                        <div>
                            <label
                                htmlFor="github"
                                className="mb-2 block text-sm font-medium"
                            >
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleInputChange}
                                className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Category *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    "professional",
                                    "personal",
                                    "academic",
                                ] as const
                            ).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                        formData.category.includes(cat)
                                            ? "border-primary bg-primary text-white"
                                            : "border-default-200 bg-default-100 text-default-600 hover:bg-default-200"
                                    }`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Technologies */}
                    <div>
                        <label
                            htmlFor="technologies"
                            className="mb-2 block text-sm font-medium"
                        >
                            Technologies
                        </label>
                        <input
                            type="text"
                            id="technologies"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleInputChange}
                            className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                            placeholder="React, Node.js, PostgreSQL (comma-separated)"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label
                            htmlFor="skills"
                            className="mb-2 block text-sm font-medium"
                        >
                            Skills
                        </label>
                        <input
                            type="text"
                            id="skills"
                            name="skills"
                            value={formData.skills}
                            onChange={handleInputChange}
                            className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                            placeholder="UI/UX Design, API Development (comma-separated)"
                        />
                    </div>

                    {/* Achievements */}
                    <div>
                        <label
                            htmlFor="achievements"
                            className="mb-2 block text-sm font-medium"
                        >
                            Achievements
                        </label>
                        <textarea
                            id="achievements"
                            name="achievements"
                            value={formData.achievements}
                            onChange={handleInputChange}
                            rows={4}
                            className="border-default-200 bg-default-100 focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                            placeholder="One achievement per line"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Project Image
                        </label>
                        <div className="space-y-4">
                            {preview && (
                                <div className="bg-default-100 relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <label className="border-default-200 bg-default-100 hover:border-primary hover:bg-default-200 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 transition-colors">
                                <div className="space-y-2 text-center">
                                    <Upload className="text-default-400 mx-auto h-8 w-8" />
                                    <div className="text-default-600 text-sm">
                                        <span className="text-primary font-medium">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </div>
                                    <p className="text-default-400 text-xs">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_featured"
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleInputChange}
                            className="border-default-200 text-primary focus:ring-primary/20 h-4 w-4 rounded focus:ring-2"
                        />
                        <label
                            htmlFor="is_featured"
                            className="flex items-center gap-2 text-sm font-medium"
                        >
                            <Star className="h-4 w-4" />
                            Featured Project
                        </label>
                    </div>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="border-default-200 hover:bg-default-100 flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors"
                >
                    <X className="h-5 w-5" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
                >
                    <Save className="h-5 w-5" />
                    {loading ? "Saving..." : id ? "Update" : "Create"} Project
                </button>
            </div>
        </form>
    );
}
