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

import Link from "next/link";
import { useState } from "react";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Image,
} from "@nextui-org/react";
import Study from "components/about/study";
import Particles from "components/particles";
import { Navigation } from "components/navigation";
import Certification from "components/about/certification";
import avatar from "https://nextui.org/avatars/avatar-1.png";
import Work from "components/about/work";

export default function Home() {
    return (
        <div>
            <Navigation />
            <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
                <Particles
                    className="absolute inset-0 -z-10 animate-fade-in"
                    quantity={100}
                />
                <div className="flex flex-col items-center justify-center mx-10 max-w-7xl">
                    <Card className={"p-4"}>
                        <CardHeader className="justify-center">
                            <div className="flex gap-5">
                                <Avatar
                                    isBordered
                                    radius="full"
                                    size="lg"
                                    src="/app/bio/alexandredfm.jpeg"
                                />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">
                                        AlexandreDFM
                                    </h4>
                                    <h5 className="text-small tracking-tight text-default-400">
                                        @AlexandreDFM
                                    </h5>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="px-3 py-0 text-small text-default-400">
                            <p>
                                {
                                    "En étude pour obtenir un diplôme d'expert en informatique à Epitech, j'aime créer"
                                }
                                {
                                    "de nouvelles choses, et concevoir de moi-même des projets visuels ou auditifs que"
                                }
                                {
                                    "je partage sur les réseaux, ou dans mon cercle privé."
                                }
                                {
                                    "Dans mon temps libre, j'approfondis mes connaissances et je tente de comprendre"
                                }
                                {
                                    "le fonctionnement des choses qui nous entourent."
                                }
                            </p>
                            {/* Enumarate Languages */}
                            <h5 className="font-semibold text-default-600 text-small">
                                Languages
                            </h5>
                            <span className="pt-2">
                                #French #English #Portuguese
                            </span>
                            {/* Enumarate Technologies */}
                            <h5 className="font-semibold text-default-600 text-small">
                                Technologies
                            </h5>
                            <span className="pt-2">
                                #Assembly #C #C++ #Python #Cython #VueJS #Nuxt
                                #Directus #NestJS #React #ReactNative #Flutter
                                #Docker
                            </span>
                        </CardBody>
                        <CardFooter className="flex flex-col gap-2">
                            <div>Studies</div>
                            <Study />
                            <div>Work experiences</div>
                            <Work />
                            <div>Certifications</div>
                            <Certification />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
