/**
 * File Name: article.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: article.tsx
 * Copyright (c) 2024 Alexandre Kévin DE FREITAS MARTINS
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

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IProject } from "@/types/IProject";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
    project: IProject;
    featured?: boolean;
};

export const Article: React.FC<Props> = ({ project, featured = false }) => {
    const { t } = useTranslation();
    const [imageError, setImageError] = useState(false);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "professional":
                return "bg-blue-500/15 text-blue-800 border-blue-500/30 dark:text-blue-300";
            case "personal":
                return "bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-300";
            case "academic":
                return "bg-green-500/15 text-green-800 border-green-500/30 dark:text-green-300";
            default:
                return "bg-default-200/60 text-foreground/80 border-default-300 dark:text-gray-300";
        }
    };

    return (
        <Link href={project.github || "#"}>
            <article
                className={`group relative h-full overflow-hidden ${
                    featured ? "md:flex" : "flex flex-col"
                }`}
            >
                {/* Image Section */}
                {project.imageUrl && !imageError ? (
                    <div
                        className={`relative overflow-hidden bg-gradient-to-br from-default-200/60 to-primary-100/60 dark:from-slate-800/40 dark:to-blue-900/20 ${
                            featured ? "h-64 md:h-auto md:w-2/5" : "h-48 w-full"
                        }`}
                    >
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => setImageError(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {project.category && project.category.length > 0 && (
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {project.category.map((cat) => (
                                    <span
                                        key={cat}
                                        className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${getCategoryColor(
                                            cat,
                                        )}`}
                                    >
                                        {t(`projects.category.${cat}`)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className={`relative flex items-center justify-center bg-gradient-to-br from-default-200/60 to-primary-100/60 dark:from-slate-800/40 dark:to-blue-900/20 ${
                            featured ? "h-64 md:h-auto md:w-2/5" : "h-48 w-full"
                        }`}
                    >
                        <div className="text-6xl opacity-20">
                            {project.category?.includes("professional")
                                ? "💼"
                                : project.category?.includes("personal")
                                  ? "🚀"
                                  : project.category?.includes("academic")
                                    ? "🎓"
                                    : "📁"}
                        </div>
                        {project.category && project.category.length > 0 && (
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {project.category.map((cat) => (
                                    <span
                                        key={cat}
                                        className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${getCategoryColor(
                                            cat,
                                        )}`}
                                    >
                                        {t(`projects.category.${cat}`)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Content Section */}
                <div
                    className={`flex flex-col justify-between p-6 ${
                        featured ? "md:w-3/5" : "flex-1"
                    }`}
                >
                    <div className="flex-1">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <h3
                                className={`leading-tight font-bold ${
                                    featured
                                        ? "text-2xl md:text-3xl"
                                        : "text-xl"
                                }`}
                            >
                                {project.title}
                            </h3>
                            {project.date && (
                                <time
                                    className="text-muted text-xs whitespace-nowrap"
                                    dateTime={new Date(
                                        project.date,
                                    ).toISOString()}
                                >
                                    {Intl.DateTimeFormat(undefined, {
                                        dateStyle: "medium",
                                    }).format(new Date(project.date))}
                                </time>
                            )}
                        </div>

                        <p
                            className={`text-muted mb-4 ${
                                featured ? "text-base" : "text-sm"
                            }`}
                        >
                            {project.description}
                        </p>

                        {project.role && (
                            <div className="mb-3 text-sm">
                                <span className="text-muted font-semibold">
                                    {t("projects.role")}:
                                </span>{" "}
                                <span className="text-muted">
                                    {project.role}
                                </span>
                            </div>
                        )}

                        {project.duration && (
                            <div className="mb-3 text-sm">
                                <span className="text-muted font-semibold">
                                    {t("projects.duration")}:
                                </span>{" "}
                                <span className="text-muted">
                                    {project.duration}
                                </span>
                            </div>
                        )}

                        {project.achievements &&
                            project.achievements.length > 0 && (
                                <div className="mb-4">
                                    <span className="text-muted text-sm font-semibold">
                                        {t("projects.achievements")}:
                                    </span>
                                    <ul className="text-muted mt-2 list-inside list-disc space-y-1 text-sm">
                                        {project.achievements
                                            .slice(0, featured ? 4 : 2)
                                            .map((achievement, index) => (
                                                <li key={index}>
                                                    {achievement}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                    </div>

                    {/* Tags Section */}
                    <div className="mt-4 space-y-3">
                        {project.technologies &&
                            project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies
                                        .slice(0, featured ? 8 : 5)
                                        .map((tech, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-800 transition-colors hover:bg-primary/20 dark:bg-primary-900/30 dark:text-primary-100 dark:hover:bg-primary-900/40"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    {project.technologies.length >
                                        (featured ? 8 : 5) && (
                                        <span className="rounded-full bg-primary/5 px-2.5 py-1 text-xs text-primary-700 dark:bg-primary-900/20 dark:text-primary-200">
                                            +
                                            {project.technologies.length -
                                                (featured ? 8 : 5)}
                                        </span>
                                    )}
                                </div>
                            )}

                        {project.skills && project.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.skills
                                    .slice(0, featured ? 6 : 4)
                                    .map((skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-default-200/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-default-200 dark:bg-blue-900/30 dark:text-blue-100 dark:hover:bg-blue-900/40"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                {project.skills.length > (featured ? 6 : 4) && (
                                    <span className="rounded-full bg-default-200/40 px-2.5 py-1 text-xs text-foreground/80 dark:bg-blue-900/20 dark:text-blue-200">
                                        +
                                        {project.skills.length -
                                            (featured ? 6 : 4)}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
};
