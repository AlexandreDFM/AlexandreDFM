/**
 * File Name: article.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: article.tsx
 * Copyright (c) 2024 Tux Inc.
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

'use client';

import Link from "next/link";
import { IProject } from "../../../types/IProject";
import { useTranslation } from "../../../hooks/useTranslation";

type Props = {
    project: IProject;
};

export const Article: React.FC<Props> = ({ project }) => {
    const { t } = useTranslation();

    return (
        <Link href={project.github || "#"}>
            <article className="p-4 md:p-8">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold text-zinc-200 group-hover:text-white">
                            {project.title}
                        </div>
                        <div className="text-xs text-zinc-400">
                            {project.date && (
                                <time dateTime={new Date(project.date).toISOString()}>
                                    {Intl.DateTimeFormat(undefined, {
                                        dateStyle: "medium",
                                    }).format(new Date(project.date))}
                                </time>
                            )}
                        </div>
                    </div>

                    <div className="text-sm text-zinc-300">
                        {project.description}
                    </div>

                    {project.role && (
                        <div className="text-sm text-zinc-400">
                            <span className="font-semibold">{t('projects.role')}:</span> {project.role}
                        </div>
                    )}

                    {project.duration && (
                        <div className="text-sm text-zinc-400">
                            <span className="font-semibold">{t('projects.duration')}:</span> {project.duration}
                        </div>
                    )}

                    {/* {project.skills && project.skills.length > 0 && (
                        <div>
                            <span className="text-sm font-semibold text-zinc-300">{t('projects.skills')}:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-blue-900/30 text-blue-100 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {project.technologies && project.technologies.length > 0 && (
                        <div>
                            <span className="text-sm font-semibold text-zinc-300">{t('projects.technologies')}:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-purple-900/30 text-purple-100 rounded-full"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.achievements && project.achievements.length > 0 && (
                        <div>
                            <span className="text-sm font-semibold text-zinc-300">{t('projects.achievements')}:</span>
                            <ul className="list-disc list-inside mt-2 text-sm text-zinc-300">
                                {project.achievements.map((achievement, index) => (
                                    <li key={index}>{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
};
