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

import "./mdx.css";
import { Header } from "./header";
import { ReportView } from "./view";
import { notFound } from "next/navigation";
import { Mdx } from "../../components/mdx";
// import { allProjects } from "contentlayer/generated";

const allProjects = [
    {
        title: "Project 1",
        slug: "project-1",
        description: "Project 1 description",
        body: {
            code: `
# Project 1
`,
        },
        repository: "AlexandreDFM/Project-1",
        url: "https://alexandredfm.com",
        published: true,
    },
    {
        title: "Project 2",
        slug: "project-2",
        description: "Project 2 description",
        body: {
            code: `
# Project 2
`,
        },
        repository: "AlexandreDFM/Project-2",
        url: "https://alexandredfm.com",
        published: true,
    },
    {
        title: "Project 3",
        slug: "project-3",
        description: "Project 3 description",
        body: {
            code: `
# Project 3
`,
        },
        repository: "AlexandreDFM/Project-3",
        url: "https://alexandredfm.com",
        published: true,
    },
    {
        title: "Project 4",
        slug: "project-4",
        description: "Project 4 description",
        body: {
            code: `
# Project 4
`,
        },
        repository: "AlexandreDFM/Project-4",
        url: "https://alexandredfm.com",
        published: true,
    },
    {
        title: "Project 5",
        slug: "project-5",
        description: "Project 5 description",
        body: {
            code: `
# Project 5
`,
        },
        repository: "AlexandreDFM/Project-5",
        url: "https://alexandredfm.com",
        published: true,
    },
];

export const revalidate = 60;

type Props = {
    params: {
        slug: string;
    };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
    return allProjects
        .filter((p) => p.published)
        .map((p) => ({
            slug: p.slug,
        }));
}

export default async function PostPage({ params }: Props) {
    const slug = params?.slug;
    const project = allProjects.find((project) => project.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="bg-zinc-50 min-h-screen">
            <Header project={project} views={0} />
            <ReportView slug={project.slug} />

            <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
                <Mdx code={project.body.code} />
            </article>
        </div>
    );
}
