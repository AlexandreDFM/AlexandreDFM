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

'use client';

import {
    Avatar,
    Card,
    CardBody,
} from "@nextui-org/react";

import Work from "components/about/work";
import Study from "components/about/study";
import { useTranslation } from "hooks/useTranslation";
import Association from "components/about/association";
import Certification from "components/about/certification";

export default function AboutClient() {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colonne de gauche - Informations personnelles */}
            <Card className="p-4 bg-black/50 backdrop-blur-sm border border-white/10 text-white">
                <CardBody>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar
                            isBordered
                            radius="full"
                            size="lg"
                            src="/app/bio/alexandredfm.jpeg"
                        />
                        <div>
                            <h4 className="text-xl font-semibold">
                                {t('about.content.personnal_info.myname')} {t('about.content.personnal_info.mylastname')}
                            </h4>
                            <p className="text-default-400">
                                {t('about.content.personnal_info.mydesc')}
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    <h5 className="text-lg font-semibold my-4">{t('about.content.bio.title')}</h5>
                    <div className="space-y-2">
                        {t<string[]>('about.content.bio.items', { returnObjects: true }).map((text: string, index: number) => (
                            <p key={index} className="text-default-400">{text}</p>
                        ))}
                    </div>

                    {/* Langues */}
                    <h5 className="text-lg font-semibold my-4">{t('about.content.language.title')}</h5>
                    <div className="space-y-2">
                        {t<{ name: string; level: string; pourcent: string }[]>('about.content.language.items', { returnObjects: true }).map(
                            ({ name, level, pourcent }, index) => (
                                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                    <span>{name}</span>
                                    <span>{level}</span>
                                    <div className="w-full bg-blue-950/50 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-500 h-2.5 rounded-full"
                                            style={{ width: pourcent }}
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Compétences */}
                    <h5 className="text-lg font-semibold my-4">{t('about.content.skills.title')}</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {t<string[]>('about.content.skills.items', { returnObjects: true }).map((text: string, index: number) => (
                            <div key={index} className="px-2 py-1 rounded bg-blue-500/10 text-blue-200/80 text-sm">
                                {text}
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Colonne de droite - Expériences et formations */}
            <Card className="p-4 bg-black/50 backdrop-blur-sm border border-white/10 text-white">
                <CardBody>
                    <h5 className="text-xl font-semibold my-4">{t('about.content.formation.title')}</h5>
                    <Study />
                    <h5 className="text-xl font-semibold my-4">{t('about.content.job.title')}</h5>
                    <Work />
                    <h5 className="text-xl font-semibold my-4">{t('about.content.certification.title')}</h5>
                    <Certification />
                    <h5 className="text-xl font-semibold my-4">{t('about.content.association.title')}</h5>
                    <Association />
                </CardBody>
            </Card>
        </div>
    );
}
