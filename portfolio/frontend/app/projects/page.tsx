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

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Article } from "./article";
import { Card } from "components/card";
import { Navigation } from "components/navigation";
import { Project } from "types/project";
import { on } from "events";

export const revalidate = 60;

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [views, setViews] = useState<{ [slug: string]: number }>({});

    useEffect(() => {
        fetch("http://localhost:3000/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setProjects(data);
            });
    }, []);

    return (
        <div className="relative pb-16">
            <Navigation />
            <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
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

                <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
                    <Card>
                        <Link href={`/projects/1`}>
                            <article className="relative w-full h-full p-4 md:p-8">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs text-blue-100">
                                        <span>SOON</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs text-blue-500">
                                        <Eye className="w-4 h-4" />{" "}
                                    </span>
                                </div>

                                <h2
                                    id="featured-post"
                                    className="mt-4 text-3xl font-bold text-blue-100 group-hover:text-white sm:text-4xl font-display"
                                >
                                    Title
                                </h2>
                                <p className="mt-4 leading-8 duration-150 text-blue-400 group-hover:text-blue-300">
                                    Description
                                </p>
                                <div className="absolute bottom-4 md:bottom-8">
                                    <p className="hidden text-blue-200 hover:text-blue-50 lg:block">
                                        Read more
                                        <span aria-hidden="true">&rarr;</span>
                                    </p>
                                </div>
                            </article>
                        </Link>
                    </Card>

                    <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
                        {projects.map((project) => (
                            <Card key={project.id}>
                                <Article
                                    project={project}
                                    views={views[project.id] ?? 0}
                                />
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="hidden w-full h-px md:block bg-blue-800" />

                <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
                    <div className="grid grid-cols-1 gap-4">
                        {projects.map((project) => (
                            <Card key={project.id}>
                                <Article
                                    project={project}
                                    views={views[project.id] ?? 0}
                                />
                            </Card>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {projects
                            .filter((_, i) => i % 3 === 1)
                            .map((project) => (
                                <Card key={project.id}>
                                    <Article
                                        project={project}
                                        views={views[project.id] ?? 0}
                                    />
                                </Card>
                            ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {projects
                            .filter((_, i) => i % 3 === 2)
                            .map((project) => (
                                <Card key={project.id}>
                                    <Article
                                        project={project}
                                        views={views[project.id] ?? 0}
                                    />
                                </Card>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
