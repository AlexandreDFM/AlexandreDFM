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

import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AlexandreDFM",
};

export default function Home() {
    const navigation = [
        { name: "About", href: "/about" },
        { name: "Projects", href: "/projects" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            {/* Skip to main content link for screen readers */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
                aria-label="Skip to main content"
            >
                Skip to main content
            </a>

            {/* Navigation */}
            <nav
                className="my-16 animate-fade-in"
                role="navigation"
                aria-label="Main navigation"
            >
                <ul className="flex items-center justify-center gap-4">
                    {navigation.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-sm duration-500 text-blue-300/80 dark:text-blue-200/80 hover:text-white hover:scale-110 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md px-3 py-2 transition-all"
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
                className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"
                aria-hidden="true"
            />

            {/* Main title */}
            <div id="main-content">
                <h1 className="z-10 text-4xl text-transparent duration-1000 cursor-default font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 animate-title">
                    AlexandreDFM
                </h1>
            </div>

            <div
                className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"
                aria-hidden="true"
            />

            {/* Subtitle */}
            <div className="my-16 text-center animate-fade-in">
                <h2 className="text-sm text-blue-300/80 dark:text-blue-200/80">
                    I{"'"}m a developer. I love{" "}
                    <Link
                        target="_blank"
                        href="https://hownee.com"
                        className="underline duration-500 hover:text-white hover:scale-110 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-sm inline-block transition-all"
                        aria-label="Visit hownee.com (opens in new tab)"
                        rel="noopener noreferrer"
                    >
                        hownee.com
                    </Link>{" "}
                    and{" "}
                    <Link
                        target="_blank"
                        href="https://tux-inc.com"
                        className="underline duration-500 hover:text-white hover:scale-110 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-sm inline-block transition-all"
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
