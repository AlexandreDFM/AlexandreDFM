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
import { Card } from "components/card";
import { IProject } from "types/IProject";
import { useTranslation } from "hooks/useTranslation";

export default function ProjectsClient() {
    const { t } = useTranslation();
    const head_projects: IProject[] = t<IProject[]>(
        "projects.content.head_projects",
        { returnObjects: true },
    );

    const projects: IProject[] = t<IProject[]>("projects.content.projects", {
        returnObjects: true,
    });

    return (
        <main className="max-w-7xl space-y-8 md:space-y-12 mx-auto" role="main">
            <header className="mx-auto max-w-2xl space-y-2 lg:mx-0">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {t("projects.title")}
                </h1>
                <h2 className="text-xl font-bold tracking-tight text-default-400 sm:text-2xl">
                    {t("projects.headline")}
                </h2>
                <p className="text-default-400">{t("projects.description")}</p>
            </header>
            {head_projects.length <= 0 && projects.length <= 0 && (
                <div className="flex h-96 items-center justify-center">
                    <p
                        className="text-default-400"
                        role="status"
                        aria-live="polite"
                    >
                        {t("projects.no_projects")}
                    </p>
                </div>
            )}
            {head_projects.length > 0 && (
                <section aria-labelledby="featured-projects">
                    <h2 id="featured-projects" className="sr-only">
                        Featured Projects
                    </h2>
                    <div className="grid-row-1 lg:grid-row-2 mx-auto grid gap-4">
                        <div className="mx-auto flex w-full flex-col gap-4 border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
                            {head_projects
                                .filter(
                                    (_: any, index: number) =>
                                        index === 0 ||
                                        index === 1 ||
                                        index === 2,
                                )
                                .map((project: IProject, index: number) => (
                                    <Card key={project.id}>
                                        <Article
                                            project={project}
                                            aria-label={`Featured project: ${
                                                project.title
                                            }`}
                                        />
                                    </Card>
                                ))}
                        </div>
                    </div>
                </section>
            )}
            {projects.length >= 3 && (
                <section aria-labelledby="all-projects">
                    <h2 id="all-projects" className="sr-only">
                        All Projects
                    </h2>
                    <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3 lg:mx-0">
                        <div className="grid grid-cols-1 gap-4">
                            {projects
                                .filter(
                                    (_: any, index: number) =>
                                        index % 3 === 0
                                )
                                .map((project: IProject) => (
                                    <Card key={project.id}>
                                        <Article
                                            project={project}
                                            aria-label={`Project: ${
                                                project.title
                                            }`}
                                        />
                                    </Card>
                                ))}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {projects
                                .filter(
                                    (_: any, index: number) =>
                                        index % 3 === 1
                                )
                                .map((project: IProject) => (
                                    <Card key={project.id}>
                                        <Article
                                            project={project}
                                            aria-label={`Project: ${
                                                project.title
                                            }`}
                                        />
                                    </Card>
                                ))}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {projects
                                .filter(
                                    (_: any, index: number) =>
                                        index % 3 === 2,
                                )
                                .map((project: IProject) => (
                                    <Card key={project.id}>
                                        <Article
                                            project={project}
                                            aria-label={`Project: ${
                                                project.title
                                            }`}
                                        />
                                    </Card>
                                ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
