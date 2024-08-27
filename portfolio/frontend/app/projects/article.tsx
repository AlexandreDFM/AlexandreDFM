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

import Link from "next/link";

type Props = {
    project: any;
};

export const Article: React.FC<Props> = ({ project }) => {
    return (
        <Link href={project.github || "https://google.com"}>
            <article className="p-4 md:p-8">
                <div className="flex justify-between gap-2 items-center">
                    <div className="duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange w-full flex grid-cols-2">
                        <div className="text-3xl col-span-1">
                            {project.title}
                        </div>
                        <div className="text-xs font-medium col-span-2 ml-auto">
                            {project.date ? (
                                <time
                                    dateTime={new Date(
                                        project.date,
                                    ).toISOString()}
                                >
                                    {Intl.DateTimeFormat(undefined, {
                                        dateStyle: "medium",
                                    }).format(new Date(project.date))}
                                </time>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
                <h2 className="z-20 text-xs font-medium duration-1000 text-zinc-200 group-hover:text-white font-display">
                    {project.description}
                </h2>
            </article>
        </Link>
    );
};
