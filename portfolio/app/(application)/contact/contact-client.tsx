/**
 * File Name: contact-client.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 11/8/2025
 * Description: This is the contact-client.tsx
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
import { Card } from "@/components/card";
import { ISocial } from "@/types/ISocial";
import { useTranslation } from "@/hooks/useTranslation";

export default function ContactClient() {
    const { t } = useTranslation();

    const socials: ISocial[] = t<any[]>("contact.items", {
        returnObjects: true,
    }).map((item, _) => {
        let icon: JSX.Element;
        switch (item.icon) {
            case "instagram":
                icon = <InstagramIcon size={20} />;
                break;
            case "x":
                icon = <XIcon size={20} />;
                break;
            case "mail":
                icon = <Mail size={20} />;
                break;
            case "github":
                icon = <Github size={20} />;
                break;
            case "phone":
                icon = <Phone size={20} />;
                break;
            case "linkedin":
                icon = <Linkedin size={20} />;
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {socials.map((s) => (
                <Card key={s.href}>
                    <Link
                        href={s.href}
                        target="_blank"
                        className="group relative flex flex-col items-center gap-2 p-4 duration-700 md:gap-4 md:p-8 md:py-9 lg:pb-12"
                    >
                        <span
                            className="absolute h-2/3 w-px bg-linear-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                            aria-hidden="true"
                        />
                        <span className="drop-shadow-orange relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-500 bg-zinc-900 text-sm text-zinc-200 duration-1000 group-hover:border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white">
                            {s.icon}
                        </span>{" "}
                        <div className="z-10 flex flex-col items-center">
                            <span className="font-display text-center font-medium duration-150 group-hover:text-white lg:text-xl xl:text-3xl dark:group-hover:text-zinc-600">
                                {s.handle}
                            </span>
                            <span className="mt-4 text-center text-sm text-zinc-400 duration-1000 group-hover:text-zinc-200">
                                {s.label}
                            </span>
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
    );
}
