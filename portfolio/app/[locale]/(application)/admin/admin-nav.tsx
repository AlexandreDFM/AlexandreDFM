/**
 * File Name: admin-nav.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 29/12/2025
 * Description: This is the admin-nav.tsx
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
import { usePathname, useRouter } from "next/navigation";
import { FileText, Home, LogOut, Image, Briefcase } from "lucide-react";
import { logout } from "./auth";
import { useTranslation } from "@/hooks/useTranslation";

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { locale } = useTranslation();

    const handleLogout = async () => {
        await logout();
        router.push(`/${locale}/admin-login`);
        router.refresh();
    };

    const navItems = [
        {
            href: `/${locale}/admin/projects`,
            label: "Projects",
            icon: Briefcase,
        },
        { href: `/${locale}/admin/blog`, label: "Blog Posts", icon: FileText },
        { href: `/${locale}/admin/media`, label: "Media Gallery", icon: Image },
    ];

    return (
        <nav className="border-default-200 bg-default-50 border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link
                            href={`/${locale}`}
                            className="flex items-center gap-2 text-lg font-bold"
                        >
                            <Home className="h-5 w-5" />
                            <span className="hidden sm:inline">
                                Admin Panel
                            </span>
                        </Link>

                        <div className="flex gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-default-600 hover:bg-default-100 hover:text-default-900"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-default-600 hover:bg-default-100 hover:text-default-900 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
