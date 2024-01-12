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

import "./mdx.css";
import { Header } from "./header";
import { ReportView } from "./view";
import { Mdx } from "components/mdx";
import { Project } from "types/project";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
    params: {
        slug: string;
    };
};

// export async function getAllProjects(): Promise<Project[]> {
//     return fetch("http://localhost:3000/projects", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })
//         .then((res) => res.json())
//         .then((data) => {
//             return data;
//         });
// }

// export async function generateStaticParams(): Promise<Props["params"][]> {
//     const allProjects = await getAllProjects();

//     return allProjects
//         .filter((p: Project) => p.id)
//         .map((p: Project) => ({
//             slug: p.id.toString(),
//         }));
// }

export default function PostPage({ params }: Props) {
    const id: string = params?.slug ?? "";
    const slug: number = parseInt(id);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [project, setProject] = useState<Project>({
        id: 0,
        title: "",
        description: "",
        body: {
            code: "",
        },
        date: "",
    });

    useEffect(() => {
        fetch("http://localhost:3000/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAllProjects(data);
                setProject(data.find((p: Project) => p.id === slug));
            });
    }, [slug]);

    if (!project) {
        notFound();
    }

    return (
        <div className="bg-zinc-50 min-h-screen">
            <Header project={project} views={0} />
            <ReportView slug={project.id} />

            <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
                <Mdx code={project.body.code} />
            </article>
        </div>
    );
}
