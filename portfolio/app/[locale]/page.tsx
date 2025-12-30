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

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
    const { locale } = useTranslation();

    const navigation = [
        { name: "About", href: `/${locale}/about` },
        { name: "Projects", href: `/${locale}/projects` },
        { name: "Contact", href: `/${locale}/contact` },
        { name: "Blog", href: `/${locale}/blog` },
        { name: "Gallery", href: `/${locale}/gallery` },
    ];

    return (
        <main className="flex h-screen flex-col items-center justify-center">
            {/* Skip to main content link for screen readers */}
            <a
                href="#main-content"
                className="bg-primary sr-only z-50 rounded-md px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
                aria-label="Skip to main content"
            >
                Skip to main content
            </a>

            {/* Navigation */}
            <nav
                className="animate-fade-in my-16"
                role="navigation"
                aria-label="Main navigation"
            >
                <ul className="flex items-center justify-center gap-4">
                    {navigation.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="rounded-md px-3 py-2 text-sm text-blue-300/80 transition-all duration-500 hover:scale-110 hover:text-white focus:text-white focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none dark:text-blue-200/80"
                                aria-label={`Navigate to ${item.name} page`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Decorative lines */}
            <div
                className="animate-fade-left hidden h-px w-screen bg-linear-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 md:block"
                aria-hidden="true"
            />

            {/* Main title */}
            <div id="main-content">
                <h1 className="font-display animate-title z-10 cursor-default bg-linear-to-b from-blue-200 via-blue-400 to-blue-600 bg-clip-text text-4xl whitespace-nowrap text-transparent duration-1000 sm:text-6xl md:text-9xl">
                    AlexandreDFM
                </h1>
            </div>

            <div
                className="animate-fade-right hidden h-px w-screen bg-linear-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 md:block"
                aria-hidden="true"
            />

            {/* Subtitle */}
            <div className="animate-fade-in my-16 text-center">
                <h2 className="text-sm text-blue-300/80 dark:text-blue-200/80">
                    I{"'"}m a developer. I love{" "}
                    <Link
                        target="_blank"
                        href="https://hownee.com"
                        className="inline-block rounded-sm underline transition-all duration-500 hover:scale-110 hover:text-white focus:text-white focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
                        aria-label="Visit hownee.com (opens in new tab)"
                        rel="noopener noreferrer"
                    >
                        hownee.com
                    </Link>{" "}
                    and{" "}
                    <Link
                        target="_blank"
                        href="https://tux-inc.com"
                        className="inline-block rounded-sm underline transition-all duration-500 hover:scale-110 hover:text-white focus:text-white focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
                        aria-label="Visit tux-inc.com (opens in new tab)"
                        rel="noopener noreferrer"
                    >
                        tux-inc.com
                    </Link>{" "}
                    with all my heart{" "}
                    <span role="img" aria-label="blue heart emoji">
                        💙
                    </span>{" "}
                    !
                </h2>
            </div>
        </main>
    );
}
