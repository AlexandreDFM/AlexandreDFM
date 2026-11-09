/**
 * File Name: metadata.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2026
 * Description: Utility functions for generating consistent metadata across pages
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
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

import "server-only";

import type { Metadata, Viewport } from "next";
import { getSiteUrl, isNoIndex } from "@/util/config";
import { defaultLocale, isLocale, locales, type Locale } from "@/util/i18n";

export const SITE_NAME = "AlexandreDFM Portfolio";
export const AUTHOR = "Alexandre De Freitas Martins";
/** Square portrait (460x460), used for JSON-LD and the PWA icons. */
export const PORTRAIT_PATH = "/app/bio/alexandredfm.jpeg";

const DESCRIPTIONS: Record<Locale, string> = {
    fr: "Alexandre De Freitas Martins, développeur full stack : projets, blog et contact.",
    en: "Alexandre De Freitas Martins, full stack developer: projects, blog and contact.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    // Matches the page background of each theme
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#faf5ee" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
};

/** Locale and path of the current request, set by the middleware. */
export function requestLocale(headerLocale: string | null): Locale {
    return isLocale(headerLocale ?? undefined) ? (headerLocale as Locale) : defaultLocale;
}

/**
 * Site-wide metadata. The canonical URL and the hreflang alternates are built
 * from the real request path, so every page gets its own.
 */
export function siteMetadata(locale: Locale, pathname: string | null): Metadata {
    const siteUrl = getSiteUrl();
    const path = pathname && pathname.startsWith(`/${locale}`) ? pathname : `/${locale}`;
    const rest = path.slice(locale.length + 1); // "/about", "" ...
    const languages = Object.fromEntries(
        locales.map((l) => [l === "fr" ? "fr-FR" : "en-US", `/${l}${rest}`]),
    );
    const noIndex = isNoIndex();
    const verification = process.env.GOOGLE_SITE_VERIFICATION;

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: `${AUTHOR} - Developer Portfolio`,
            template: "AlexandreDFM - %s",
        },
        description: DESCRIPTIONS[locale],
        applicationName: SITE_NAME,
        authors: [{ name: AUTHOR, url: siteUrl }],
        creator: AUTHOR,
        keywords: [
            AUTHOR,
            "AlexandreDFM",
            "Portfolio",
            "Full Stack Developer",
            "Web Development",
            "Next.js",
            "TypeScript",
            "Kubernetes",
            "Game Development",
        ],
        alternates: {
            canonical: path,
            languages: { ...languages, "x-default": `/${defaultLocale}${rest}` },
        },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            locale: locale === "fr" ? "fr_FR" : "en_US",
            alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
            url: path,
            // The image comes from app/opengraph-image.tsx (1200x630)
        },
        twitter: {
            card: "summary_large_image",
            site: "@AlexandreDFM",
            creator: "@AlexandreDFM",
        },
        manifest: "/manifest.json",
        formatDetection: { telephone: false },
        robots: noIndex
            ? { index: false, follow: false }
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      "max-image-preview": "large",
                      "max-snippet": -1,
                      "max-video-preview": -1,
                  },
              },
        ...(verification ? { verification: { google: verification } } : {}),
    };
}

/** JSON-LD describing the person and the website (rendered in the root layout). */
export function siteJsonLd() {
    const siteUrl = getSiteUrl();
    return [
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${siteUrl}#person`,
            name: AUTHOR,
            url: siteUrl,
            image: `${siteUrl}${PORTRAIT_PATH}`,
            sameAs: [
                "https://github.com/AlexandreDFM",
                "https://www.linkedin.com/in/alexandre-de-freitas-martins/",
            ],
            jobTitle: "Full Stack Developer",
            // To keep up to date (see RAPPORT.md §6.2)
            worksFor: {
                "@type": "Organization",
                name: "Tux Inc.",
                url: "https://tux-inc.com",
            },
            knowsAbout: [
                "Web Development",
                "Cloud Solutions",
                "Software Engineering",
                "Open Source",
                "Game Development",
                "Mobile Apps",
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${siteUrl}#website`,
            url: siteUrl,
            name: SITE_NAME,
            publisher: { "@id": `${siteUrl}#person` },
            inLanguage: ["fr-FR", "en-US"],
        },
    ];
}

/** JSON-LD of a blog post (URL with its locale). */
export function blogPostJsonLd(post: {
    title: string;
    description: string;
    slug: string;
    locale: Locale;
    publishedAt?: string;
    updatedAt?: string;
    image?: string | null;
}) {
    const siteUrl = getSiteUrl();
    const url = `${siteUrl}/${post.locale}/blog/${post.slug}`;
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url,
        inLanguage: post.locale === "fr" ? "fr-FR" : "en-US",
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: { "@id": `${siteUrl}#person` },
        image: post.image ? `${siteUrl}${post.image}` : `${siteUrl}${PORTRAIT_PATH}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
    };
}

/** Serialize JSON-LD for a <script> tag ("<" escaped so content cannot close the tag). */
export function jsonLdScript(data: unknown): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}
