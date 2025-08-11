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

'use client';

import { Article } from "./article";
import getConfig from "next/config";
import { Card } from "components/card";
import { IProject } from "types/IProject";
import { useTranslation } from "hooks/useTranslation";

// const { publicRuntimeConfig } = getConfig();

// async function getProjects() {
//     try {
//         const res = await fetch(`http://backend:8055/items/projects/`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${publicRuntimeConfig.apiBearerToken}`,
//             },
//             next: { revalidate: 1 },
//         });
//         if (!res.ok) {
//             return [];
//         }
//         const repo = await res.json();
//         if (!repo.data) {
//             return [];
//         }
//         return repo.data;
//     } catch (error) {
//         return [];
//     }
// }

export default function ProjectsClient() {
    // const projectsData = getProjects();
    // const [projects]: [Project[]] = await Promise.all([projectsData]);
    const { t } = useTranslation();
    const head_projects: IProject[] = t<IProject[]>('projects.content.head_projects', { returnObjects: true });

    const projects: IProject[] = t<IProject[]>('projects.content.projects', { returnObjects: true });

    return (
        <div className="space-y-8 max-w-7xl md:space-y-12">
            <div className="max-w-2xl mx-auto lg:mx-0 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {t('projects.title')}
                </h1>
                <h2 className="text-xl text-default-400 font-bold tracking-tight sm:text-2xl">
                    {t('projects.headline')}
                </h2>
                <p className="text-default-400">
                    {t('projects.description')}
                </p>
            </div>
            <div className="w-full h-px bg-default-400" />
            {head_projects.length <= 0 && projects.length <= 0 && (
                <div className="flex items-center justify-center h-96">
                    <p className="text-default-400">No projects found.</p>
                </div>
            )}
            {head_projects.length >= 0 && (
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
                                .map((project: IProject) => (
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
                                .map((project: IProject) => (
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
                                .map((project: IProject) => (
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
                                .map((project: IProject) => (
                                    <Card key={project.id}>
                                        <Article project={project} />
                                    </Card>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
