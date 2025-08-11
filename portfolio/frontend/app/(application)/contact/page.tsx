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
import { Card } from "components/card";
import { ISocial } from "types/ISocial";
import { useTranslation } from "hooks/useTranslation";
import { Github, InstagramIcon, Linkedin, Mail, Phone, XIcon } from "lucide-react";

export default function Contact() {
    const { t } = useTranslation();

    const socials: ISocial[] = t<any[]>("contact.items", {
        returnObjects: true,
    }).map((item, _) => ({
        icon:
            item.icon === "instagram" ? (
                <InstagramIcon size={20} />
            ) : item.icon === "x" ? (
                <XIcon size={20} />
            ) : item.icon === "mail" ? (
                <Mail size={20} />
            ) : item.icon === "github" ? (
                <Github size={20} />
            ) : item.icon === "phone" ? (
                <Phone size={20} />
            ) : item.icon === "linkedin" ? (
                <Linkedin size={20} />
            ) : null,
        href: item.href,
        label: item.label,
        handle: item.value,
    }));

    return (
        <div>
            <div className="container flex items-center justify-center px-4 mx-auto">
                <div className="grid w-full grid-cols-1 gap-4 mx-auto mt-32 sm:mt-0 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
                    {socials.map((s) => (
                        <Card key={s.href}>
                            <Link
                                href={s.href}
                                target="_blank"
                                className="p-4 relative flex flex-col items-center gap-2 duration-700 group md:gap-4 md:py-9 lg:pb-12 md:p-8"
                            >
                                <span
                                    className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                                    aria-hidden="true"
                                />
                                <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
                                    {s.icon}
                                </span>{" "}
                                <div className="z-10 flex flex-col items-center">
                                    <span className="text-center lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
                                        {s.handle}
                                    </span>
                                    <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                                        {s.label}
                                    </span>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
