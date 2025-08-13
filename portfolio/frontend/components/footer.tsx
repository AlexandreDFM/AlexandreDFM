/**
 * File Name: footer.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 11/8/2025
 * Description: This is the footer.tsx
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

import {
    Github,
    InstagramIcon,
    Linkedin,
    Mail,
    Phone,
    XIcon,
} from "lucide-react";

import Link from "next/link";
import { ISocial } from "types/ISocial";
import { useTranslation } from "../hooks/useTranslation";
import React, { useEffect, useRef, useState } from "react";

export const Footer: React.FC = () => {
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

    const socials: ISocial[] = t<any[]>("contact.items", {
        returnObjects: true,
    }).map((item, _) => {
        let icon: JSX.Element;
        switch (item.icon) {
            case "instagram":
                icon = <InstagramIcon size={12} />;
                break;
            case "x":
                icon = <XIcon size={12} />;
                break;
            case "mail":
                icon = <Mail size={12} />;
                break;
            case "github":
                icon = <Github size={12} />;
                break;
            case "phone":
                icon = <Phone size={12} />;
                break;
            case "linkedin":
                icon = <Linkedin size={12} />;
                break;
            default:
                icon = <span />;
        }
        return {
            icon,
            href: item.href,
            label: item.label,
            handle: item.value,
        };
    });

    return (
        <footer ref={ref}>
            <div className="bg-zinc-900/500 h-[var(--footer-size)] border-t border-zinc-800 backdrop-blur">
                <div className="container m-auto px-4 flex h-full flex-row-reverse items-center">
                    <div className="flex space-x-2">
                        {socials.map((s) => (
                            <Link
                                key={s.href}
                                href={s.href}
                                target="_blank"
                                className="items-center"
                            >
                                <span className="drop-shadow-orange flex h-8 w-8 items-center justify-center rounded-full border border-zinc-500 bg-zinc-900 text-sm text-zinc-200 group-hover:border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white">
                                    {s.icon}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
