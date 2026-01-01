/**
 * File Name: about-client.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 11/8/2025
 * Description: This is the about-client.tsx
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

import { useState } from "react";
import Work from "@/components/about/work";
import Study from "@/components/about/study";
import { Avatar, Card, CardBody } from "@heroui/react";
import { useTranslation } from "@/hooks/useTranslation";
import Association from "@/components/about/association";
import Certification from "@/components/about/certification";

export default function AboutClient() {
    const { t } = useTranslation();
    const [avatarUrl] = useState<string>("/api/avatar/image");
    const [imageError, setImageError] = useState(false);

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* Colonne de gauche - Informations personnelles */}
            <Card className="border border-white/10 bg-black/10 p-4 backdrop-blur-sm">
                <CardBody>
                    <div className="flex items-center gap-4 px-8">
                        <Avatar
                            className="ml-4 h-20 w-20 shrink-0 md:h-24 md:w-24 lg:h-28 lg:w-28"
                            isBordered
                            radius="full"
                            src={
                                imageError
                                    ? "/app/bio/alexandredfm.jpeg"
                                    : avatarUrl
                            }
                            alt="Alexandre De Freitas Martins profile picture"
                            showFallback={!imageError}
                            onError={() => {
                                console.warn(
                                    "[Avatar] Failed to load from Directus, using fallback",
                                );
                                setImageError(true);
                            }}
                        />
                        <div className="flex-1 px-4">
                            <h1 className="text-xl font-semibold">
                                {t("about.content.personnal_info.myname")}{" "}
                                {t("about.content.personnal_info.mylastname")}
                            </h1>
                            <p className="text-default-400">
                                {t("about.content.personnal_info.mydesc")}
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    <h1 className="my-4 text-lg font-semibold">
                        {t("about.content.bio.title")}
                    </h1>
                    <div className="space-y-2 px-4">
                        {t<string[]>("about.content.bio.items", {
                            returnObjects: true,
                        }).map((text: string, index: number) => (
                            <p key={index} className="text-default-400">
                                {text}
                            </p>
                        ))}
                    </div>

                    {/* Langues */}
                    <h1 className="my-4 text-lg font-semibold">
                        {t("about.content.language.title")}
                    </h1>
                    <div className="space-y-2 px-4">
                        {t<{ name: string; level: string; pourcent: string }[]>(
                            "about.content.language.items",
                            { returnObjects: true },
                        ).map(({ name, level, pourcent }, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-3 items-center gap-2"
                            >
                                <span>{name}</span>
                                <span>{level}</span>
                                <div className="h-2.5 w-full rounded-full bg-purple-900/30 dark:bg-blue-950/50">
                                    <div
                                        className="h-2.5 rounded-full bg-purple-500 dark:bg-blue-500"
                                        style={{ width: pourcent }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Compétences */}
                    <h1 className="my-4 text-lg font-semibold">
                        {t("about.content.skills.title")}
                    </h1>
                    <div className="grid grid-cols-2 gap-2 px-4 sm:grid-cols-3">
                        {t<string[]>("about.content.skills.items", {
                            returnObjects: true,
                        }).map((text: string, index: number) => (
                            <div
                                key={index}
                                className="rounded bg-purple-900/30 px-2 py-1 text-center text-sm text-purple-100 dark:bg-blue-500/10 dark:text-blue-200/80"
                            >
                                {text}
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Colonne de droite - Expériences et formations */}
            <Card className="border border-white/10 bg-black/10 p-4 backdrop-blur-sm">
                <CardBody>
                    <h1 className="mb-4 text-xl font-semibold">
                        {t("about.content.formation.title")}
                    </h1>
                    <Study />
                    <h1 className="my-4 text-xl font-semibold">
                        {t("about.content.job.title")}
                    </h1>
                    <Work />
                    <h1 className="my-4 text-xl font-semibold">
                        {t("about.content.certification.title")}
                    </h1>
                    <Certification />
                    <h1 className="my-4 text-xl font-semibold">
                        {t("about.content.association.title")}
                    </h1>
                    <Association />
                </CardBody>
            </Card>
        </div>
    );
}
