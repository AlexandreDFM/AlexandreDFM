/**
 * File Name: navbar.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 10/8/2025
 * Description: This is the navbar.tsx
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

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "../hooks/useTranslation";
import React, { useEffect, useRef, useState } from "react";

export const Navbar: React.FC = () => {
    const { t } = useTranslation();
    const ref = useRef<HTMLElement>(null);
    const [isIntersecting, setIntersecting] = useState(true);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting),
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <header ref={ref}>
            <div
                className={`fixed inset-x-0 top-0 z-50 flex h-(--navbar-size) flex-row-reverse items-center justify-center border-b px-24 backdrop-blur duration-200 ${
                    isIntersecting
                        ? "border-transparent bg-zinc-900/0"
                        : "border-zinc-800 bg-zinc-900/500"
                }`}
            >
                <nav
                    className="flex w-full items-center justify-end gap-8"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <Link
                        href="/about"
                        className="hover:text-primary focus:text-primary focus:ring-primary text-sm transition-all duration-500 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        aria-label="About page"
                    >
                        {t("common.about")}
                    </Link>
                    <Link
                        href="/projects"
                        className="hover:text-primary focus:text-primary focus:ring-primary text-sm transition-all duration-500 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        aria-label="Projects page"
                    >
                        {t("common.projects")}
                    </Link>
                    <Link
                        href="/blog"
                        className="hover:text-primary focus:text-primary focus:ring-primary text-sm transition-all duration-500 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        aria-label="Blog page"
                    >
                        {t("common.blog") || "Blog"}
                    </Link>
                    <Link
                        href="/gallery"
                        className="hover:text-primary focus:text-primary focus:ring-primary text-sm transition-all duration-500 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        aria-label="Gallery page"
                    >
                        {t("common.gallery") || "Gallery"}
                    </Link>
                    <Link
                        href="/contact"
                        className="hover:text-primary focus:text-primary focus:ring-primary text-sm transition-all duration-500 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        aria-label="Contact page"
                    >
                        {t("common.contact")}
                    </Link>
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </nav>
                <Link
                    href="/"
                    className="focus:ring-primary rounded-md p-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    aria-label="Go back to home page"
                >
                    <ArrowLeft className="h-6 w-6" aria-hidden="true" />
                </Link>
            </div>
        </header>
    );
};
