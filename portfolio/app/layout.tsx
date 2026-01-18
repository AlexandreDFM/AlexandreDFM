/**
 * File Name: layout.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: layout.tsx
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

import "@/styles/globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import AnimatedBackground from "../components/layout/AnimatedBackground";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const calSans = localFont({
    src: "../public/fonts/CalSans-SemiBold.ttf",
    variable: "--font-calsans",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={[inter.variable, calSans.variable].join(" ")}
            suppressHydrationWarning
        >
            <head>
                <title>Alexandre De Freitas Martins - Developer Portfolio</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=5"
                />
                <meta
                    name="description"
                    content="Alexandre De Freitas Martins - Developer - Passionate about hownee.com and tux-inc.com."
                />
                <meta
                    name="keywords"
                    content="Alexandre De Freitas Martins, AlexandreDFM, Portfolio, Developer, Full Stack, Web Development, React, Next.js, Vue.js, Nuxt, TypeScript, Cloud Solutions, Software Engineer, C++, C#, C, Assembly, Python, Java, Node.js, Express, MongoDB, SQL, PostgreSQL, Docker, Kubernetes, DevOps, Open Source, Game Development, Mobile Apps, Tux Inc, Hownee"
                />
                <meta name="author" content="Alexandre De Freitas Martins" />
                <meta name="theme-color" content="#000000" />
                <meta name="format-detection" content="telephone=no" />

                {/* Robots */}
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:locale:alternate" content="fr_FR" />
                <meta property="og:url" content="https://alexandredfm.fr" />
                <meta property="og:site_name" content="AlexandreDFM Portfolio" />
                <meta property="og:title" content="Alexandre De Freitas Martins - Developer" />
                <meta property="og:description" content="Expert Full Stack Developer specializing in web development, cloud solutions, and innovative projects." />
                <meta property="og:image" content="https://alexandredfm.fr/app/bio/me.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="Alexandre De Freitas Martins" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@AlexandreDFM" />
                <meta name="twitter:creator" content="@AlexandreDFM" />
                <meta name="twitter:title" content="Alexandre De Freitas Martins - Full Stack Developer" />
                <meta name="twitter:description" content="Expert Full Stack Developer specializing in web development, cloud solutions, and innovative projects." />
                <meta name="twitter:image" content="https://alexandredfm.fr/app/bio/me.jpg" />

                {/* Links */}
                <link rel="canonical" href="https://alexandredfm.fr" />
                <link rel="alternate" hrefLang="en" href="https://alexandredfm.fr/en" />
                <link rel="alternate" hrefLang="fr" href="https://alexandredfm.fr/fr" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />

                {/* Verification - Replace with your actual codes */}
                <meta name="google-site-verification" content="your-google-verification-code" />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Person",
                            "@id": "https://alexandredfm.fr#person",
                            name: "Alexandre De Freitas Martins",
                            url: "https://alexandredfm.fr",
                            image: "https://alexandredfm.fr/app/bio/me.jpg",
                            sameAs: [
                                "https://github.com/AlexandreDFM",
                                "https://linkedin.com/in/alexandredfm",
                                "https://twitter.com/AlexandreDFM",
                            ],
                            jobTitle: "Developer",
                            worksFor: {
                                "@type": "Organization",
                                name: "Tux Inc.",
                                url: "https://tux-inc.com",
                            },
                            knowsAbout: [
                                "Web Development",
                                "Development",
                                "Cloud Solutions",
                                "Software Engineering",
                                "Open Source",
                                "Game Development",
                                "Mobile Apps",
                            ],
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "@id": "https://alexandredfm.fr#website",
                            url: "https://alexandredfm.fr",
                            name: "AlexandreDFM Portfolio",
                            description: "Alexandre De Freitas Martins - Developer Portfolio",
                            publisher: {
                                "@id": "https://alexandredfm.fr#person",
                            },
                            inLanguage: ["en-US", "fr-FR"],
                        }),
                    }}
                />
            </head>
            <body suppressHydrationWarning>
                <HeroUIProvider>
                    <NextThemesProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={true}
                        disableTransitionOnChange={false}
                    >
                        <AnimatedBackground>{children}</AnimatedBackground>
                    </NextThemesProvider>
                </HeroUIProvider>
            </body>
        </html>
    );
}
