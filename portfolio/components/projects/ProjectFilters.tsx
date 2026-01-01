/**
 * File Name: ProjectFilters.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Project filtering component
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

import { useTranslation } from "@/hooks/useTranslation";
import { IProject } from "@/types/IProject";
import { useEffect, useMemo, useState } from "react";

interface ProjectFiltersProps {
    projects: IProject[];
    onFilteredProjectsChange: (filtered: IProject[]) => void;
}

export default function ProjectFilters({
    projects,
    onFilteredProjectsChange,
}: ProjectFiltersProps) {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<
        "all" | "professional" | "personal" | "academic"
    >("all");
    const [selectedTech, setSelectedTech] = useState<string>("all");
    const [selectedSkill, setSelectedSkill] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Extract unique values for filters
    const { categories, technologies, skills } = useMemo(() => {
        const categoriesSet = new Set<string>();
        const technologiesSet = new Set<string>();
        const skillsSet = new Set<string>();

        projects.forEach((project) => {
            project.category?.forEach((cat) => categoriesSet.add(cat));
            project.technologies?.forEach((tech) => technologiesSet.add(tech));
            project.skills?.forEach((skill) => skillsSet.add(skill));
        });

        return {
            categories: Array.from(categoriesSet).sort(),
            technologies: Array.from(technologiesSet).sort(),
            skills: Array.from(skillsSet).sort(),
        };
    }, [projects]);

    // Filter projects based on selected filters - use useEffect instead of useMemo
    useEffect(() => {
        let filtered = projects;

        // Category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (p) => p.category?.includes(selectedCategory),
            );
        }

        // Technology filter
        if (selectedTech !== "all") {
            filtered = filtered.filter(
                (p) => p.technologies?.includes(selectedTech),
            );
        }

        // Skill filter
        if (selectedSkill !== "all") {
            filtered = filtered.filter(
                (p) => p.skills?.includes(selectedSkill),
            );
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title?.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query) ||
                    p.role?.toLowerCase().includes(query) ||
                    p.technologies?.some(
                        (t) => t?.toLowerCase().includes(query),
                    ) ||
                    p.skills?.some((s) => s?.toLowerCase().includes(query)),
            );
        }

        onFilteredProjectsChange(filtered);
    }, [
        projects,
        selectedCategory,
        selectedTech,
        selectedSkill,
        searchQuery,
        onFilteredProjectsChange,
    ]);

    const resetFilters = () => {
        setSelectedCategory("all");
        setSelectedTech("all");
        setSelectedSkill("all");
        setSearchQuery("");
    };

    const hasActiveFilters =
        selectedCategory !== "all" ||
        selectedTech !== "all" ||
        selectedSkill !== "all" ||
        searchQuery.trim() !== "";

    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-black/10 p-6 backdrop-blur-sm">
            {/* Search Bar */}
            <div>
                <label
                    htmlFor="search"
                    className="mb-2 block text-sm font-medium"
                >
                    {t("projects.filters.search")}
                </label>
                <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("projects.filters.search_placeholder")}
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm backdrop-blur-sm transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
            </div>

            {/* Filter Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
                {/* Category Filter */}
                <div>
                    <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-medium"
                    >
                        {t("projects.filters.category")}
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setSelectedCategory(
                                e.target.value as
                                    | "all"
                                    | "professional"
                                    | "personal"
                                    | "academic",
                            )
                        }
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm backdrop-blur-sm transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                    >
                        <option value="all">{t("projects.filters.all")}</option>
                        {categories.map((category, index) => (
                            <option
                                key={`category-${category}-${index}`}
                                value={category}
                            >
                                {t(`projects.category.${category}`)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Technology Filter */}
                <div>
                    <label
                        htmlFor="technology"
                        className="mb-2 block text-sm font-medium"
                    >
                        {t("projects.filters.technology")}
                    </label>
                    <select
                        id="technology"
                        value={selectedTech}
                        onChange={(e) => setSelectedTech(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm backdrop-blur-sm transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                    >
                        <option value="all">{t("projects.filters.all")}</option>
                        {technologies.map((tech, index) => (
                            <option key={`tech-${tech}-${index}`} value={tech}>
                                {tech}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Skill Filter */}
                <div>
                    <label
                        htmlFor="skill"
                        className="mb-2 block text-sm font-medium"
                    >
                        {t("projects.filters.skill")}
                    </label>
                    <select
                        id="skill"
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm backdrop-blur-sm transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                    >
                        <option value="all">{t("projects.filters.all")}</option>
                        {skills.map((skill, index) => (
                            <option
                                key={`skill-${skill}-${index}`}
                                value={skill}
                            >
                                {skill}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
                <button
                    onClick={resetFilters}
                    className="w-full rounded-lg border border-white/10 bg-purple-900/20 px-4 py-2 text-sm font-medium text-purple-200 transition-colors hover:bg-purple-900/30 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                >
                    {t("projects.filters.reset")}
                </button>
            )}
        </div>
    );
}
