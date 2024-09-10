/**
 * File Name: page.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: page.tsx
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

import { Article } from "./article";
import getConfig from "next/config";
import { Card } from "components/card";
import { Project } from "types/project";
import { Navigation } from "components/navigation";

const { publicRuntimeConfig } = getConfig();

async function getProjects() {
    try {
        const res = await fetch(`http://backend:8055/items/projects/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicRuntimeConfig.apiBearerToken}`,
            },
            next: { revalidate: 1 },
        });
        if (!res.ok) {
            return [];
        }
        const repo = await res.json();
        if (!repo.data) {
            return [];
        }
        return repo.data;
    } catch (error) {
        return [];
    }
}

export default async function ProjectsPage() {
    const projectsData = getProjects();
    const [projects]: [Project[]] = await Promise.all([projectsData]);

    return (
        <div className="relative pb-16">
            <Navigation />
            <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-12 md:pt-24 lg:pt-32">
                <div className="max-w-2xl mx-auto lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-blue-100 sm:text-4xl">
                        Projects
                    </h2>
                    <p className="mt-4 text-blue-400">
                        Some of the projects are from work and some are on my
                        own time.
                    </p>
                </div>
                <div className="w-full h-px bg-blue-800" />
                {projects.length === 0 && (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-blue-400">No projects found.</p>
                    </div>
                )}
                {projects.length >= 0 && (
                    <div>
                        <div className="grid grid-row-1 gap-4 mx-auto lg:grid-row-2 ">
                            <div className="flex flex-col w-full gap-4 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
                                {projects
                                    .filter(
                                        (_: any, index: number) =>
                                            index === 0 ||
                                            index === 1 ||
                                            index === 2,
                                    )
                                    .map((project: Project) => (
                                        <Card key={project.id}>
                                            <Article project={project} />
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
                {projects.length >= 3 && (
                    <div>
                        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
                            <div className="grid grid-cols-1 gap-4">
                                {projects
                                    .filter(
                                        (_: any, index: number) =>
                                            index !== 0 &&
                                            index !== 1 &&
                                            index !== 2,
                                    )
                                    .map((project: Project) => (
                                        <Card key={project.id}>
                                            <Article project={project} />
                                        </Card>
                                    ))}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {projects
                                    .filter(
                                        (_: any, index: number) =>
                                            index !== 0 &&
                                            index !== 1 &&
                                            index !== 2 &&
                                            index % 3 === 1,
                                    )
                                    .map((project: Project) => (
                                        <Card key={project.id}>
                                            <Article project={project} />
                                        </Card>
                                    ))}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {projects
                                    .filter(
                                        (_: any, index: number) =>
                                            index !== 0 &&
                                            index !== 1 &&
                                            index !== 2 &&
                                            index % 3 === 2,
                                    )
                                    .map((project: Project) => (
                                        <Card key={project.id}>
                                            <Article project={project} />
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
