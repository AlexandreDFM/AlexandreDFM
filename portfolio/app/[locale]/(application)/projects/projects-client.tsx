/**
 * File Name: projects-client.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 11/8/2025
 * Description: This is the projects-client.tsx
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

import { Article } from "./article";
import { Card } from "@/components/card";
import { IProject } from "@/types/IProject";
import { useProjects } from "@/hooks/useProjects";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import ProjectFilters from "@/components/projects/ProjectFilters";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

export default function ProjectsClient() {
    const { t, locale } = useTranslation();

    // Fetch all projects from Directus
    const {
        projects: allProjects,
        loading,
        error,
    } = useProjects({
        language: locale as "en" | "fr",
        featured: false,
    });

    // Separate featured and regular projects
    const { featuredProjects, regularProjects } = useMemo(() => {
        const featured = allProjects.filter((p) => p.is_featured);
        const regular = allProjects.filter((p) => !p.is_featured);
        return { featuredProjects: featured, regularProjects: regular };
    }, [allProjects]);

    // Initialize filtered projects state
    const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);

    // Update filtered projects when regularProjects change initially
    useEffect(() => {
        if (filteredProjects.length === 0 && regularProjects.length > 0) {
            setFilteredProjects(regularProjects);
        }
    }, [regularProjects, filteredProjects.length]);

    // Use filtered projects
    const displayProjects = filteredProjects;

    if (loading) {
        return (
            <main
                className="mx-auto max-w-7xl space-y-8 md:space-y-12"
                role="main"
            >
                <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t("projects.title")}
                    </h1>
                    <h2 className="text-default-400 text-xl font-bold tracking-tight sm:text-2xl">
                        {t("projects.headline")}
                    </h2>
                    <p className="text-default-400">
                        {t("projects.description")}
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
                    <div className="flex flex-row gap-x-2">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {t("projects.title")}
                        </h1>
                        <ArrowBigRight className="mt-1 h-6 w-6 text-purple-500/50" />
                        <h2 className="text-default-400 text-xl font-bold tracking-tight sm:text-2xl">
                            {t("projects.headline")}
                        </h2>
                    </div>
                    <p className="text-default-400">
                        {t("projects.description")}
                    </p>
                </header>
                <div className="flex h-96 items-center justify-center">
                    <p
                        className="text-red-400"
                        role="status"
                        aria-live="polite"
                    >
                        Error loading projects: {error}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl space-y-4 md:space-y-6" role="main">
            {/* Header */}
            <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                <div className="flex flex-row items-end gap-x-2">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t("projects.title")}
                    </h1>
                    <div className="my-auto">
                        <ArrowBigRight className="h-6 w-6 items-center text-purple-500/50" />
                    </div>
                    <h2 className="text-default-400 text-xl font-bold tracking-tight sm:text-2xl">
                        {t("projects.headline")}
                    </h2>
                </div>
                <p className="text-default-400">{t("projects.description")}</p>
            </header>
            <div className="mx-auto max-w-7xl space-y-8 md:space-y-12">
                {/* Pinned/Featured Projects Section */}
                {featuredProjects.length > 0 && (
                    <section aria-labelledby="featured-projects">
                        <div className="mb-6 flex items-center gap-2">
                            <h2
                                id="featured-projects"
                                className="text-2xl font-bold"
                            >
                                {t("projects.featured")}
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {featuredProjects.map((project: IProject) => (
                                <Card key={project.id}>
                                    <Article
                                        project={project}
                                        featured={true}
                                    />
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Filters Section */}
                {allProjects.length > 0 && (
                    <section aria-labelledby="project-filters">
                        <h2 id="project-filters" className="sr-only">
                            Project Filters
                        </h2>
                        <ProjectFilters
                            projects={regularProjects}
                            onFilteredProjectsChange={setFilteredProjects}
                        />
                    </section>
                )}

                {/* All Projects Section */}
                {displayProjects.length > 0 ? (
                    <section aria-labelledby="all-projects">
                        <div className="mb-6 flex items-center justify-between">
                            <h2
                                id="all-projects"
                                className="text-2xl font-bold"
                            >
                                {t("projects.all_projects")}
                            </h2>
                            <span className="text-default-400 text-sm">
                                {displayProjects.length}{" "}
                                {displayProjects.length === 1
                                    ? t("projects.project")
                                    : t("projects.projects")}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {displayProjects.map((project: IProject) => (
                                <Card key={project.id}>
                                    <Article
                                        project={project}
                                        featured={false}
                                    />
                                </Card>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-white/10 bg-black/10 backdrop-blur-sm">
                        <p
                            className="text-default-400"
                            role="status"
                            aria-live="polite"
                        >
                            {t("projects.no_projects")}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
