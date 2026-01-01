/**
 * File Name: projects-list.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 30/12/2025
 * Description: Projects list component for admin
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

import { useProjects } from "@/hooks/useProjects";
import Link from "next/link";
import Image from "next/image";
import {
    Edit,
    Trash2,
    Eye,
    Star,
    Github,
    Briefcase,
    GraduationCap,
    User,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/card";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProjectsList() {
    const { locale } = useTranslation();
    const { projects, loading, error } = useProjects({
        language: locale as "en" | "fr",
    });
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setDeleting(id);
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert("Failed to delete project");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        } finally {
            setDeleting(null);
        }
    };

    const getCategoryIcon = (
        category?: ("professional" | "personal" | "academic")[],
    ) => {
        if (!category || category.length === 0)
            return <User className="h-4 w-4" />;
        if (category.includes("professional"))
            return <Briefcase className="h-4 w-4" />;
        if (category.includes("academic"))
            return <GraduationCap className="h-4 w-4" />;
        return <User className="h-4 w-4" />;
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
                Error loading projects: {error}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <Card>
                <div className="p-12 text-center">
                    <p className="text-default-400">
                        No projects yet. Create your first project!
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {projects.map((project) => (
                <Card key={project.id}>
                    <div className="flex gap-4 p-4">
                        {project.imageUrl && (
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">
                                            {project.title}
                                        </h3>
                                        {project.is_featured && (
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                        )}
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-default-400 hover:text-primary"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Github className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-default-400 mt-1 line-clamp-2 text-sm">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/${locale}/projects`}
                                        target="_blank"
                                        className="text-default-600 hover:bg-default-100 hover:text-default-900 rounded-lg p-2 transition-colors"
                                        title="View"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={`/${locale}/admin/projects/edit/${project.id}`}
                                        className="text-default-600 hover:bg-default-100 hover:text-default-900 rounded-lg p-2 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        disabled={deleting === project.id}
                                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-default-400 flex flex-wrap items-center gap-4 text-xs">
                                {project.category &&
                                    project.category.length > 0 && (
                                        <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5">
                                            {getCategoryIcon(project.category)}
                                            {project.category[0]}
                                        </span>
                                    )}
                                {project.role && <span>{project.role}</span>}
                                {project.duration && (
                                    <span>{project.duration}</span>
                                )}
                                {project.date && (
                                    <span>
                                        {new Date(
                                            project.date,
                                        ).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {project.technologies &&
                                project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies
                                            .slice(0, 5)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="bg-default-100 text-default-600 rounded-full px-2 py-0.5 text-xs"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        {project.technologies.length > 5 && (
                                            <span className="text-default-400 text-xs">
                                                +
                                                {project.technologies.length -
                                                    5}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
