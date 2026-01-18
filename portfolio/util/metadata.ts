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

import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alexandredfm.fr";

interface PageMetadataProps {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    image?: string;
    locale?: string;
    type?: "website" | "article" | "profile";
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
}

/**
 * Generate consistent metadata for pages
 */
export function generatePageMetadata({
    title,
    description,
    path,
    keywords = [],
    image = "/app/bio/me.jpg",
    locale = "en",
    type = "website",
    publishedTime,
    modifiedTime,
    authors = ["Alexandre De Freitas Martins"],
}: PageMetadataProps): Metadata {
    const url = `${baseUrl}${path}`;
    const fullTitle = `${title} | AlexandreDFM`;

    const defaultKeywords = [
        "Alexandre De Freitas Martins",
        "AlexandreDFM",
        "Developer",
        "Web Development",
        "Portfolio",
        "Software Engineer",
        "Full Stack",
        "Cloud Solutions",
        "Open Source",
        "Game Development",
        "Mobile Apps",
    ];

    return {
        title: fullTitle,
        description,
        keywords: [...defaultKeywords, ...keywords],
        authors: authors.map((name) => ({ name })),
        openGraph: {
            type: type,
            locale: locale === "en" ? "en_US" : "fr_FR",
            url,
            title: fullTitle,
            description,
            siteName: "AlexandreDFM Portfolio",
            images: [
                {
                    url: `${baseUrl}${image}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            ...(type === "article" && {
                publishedTime,
                modifiedTime,
                authors,
            }),
        },
        twitter: {
            card: "summary_large_image",
            site: "@AlexandreDFM",
            creator: "@AlexandreDFM",
            title: fullTitle,
            description,
            images: [`${baseUrl}${image}`],
        },
        alternates: {
            canonical: url,
            languages: {
                "en-US": path.replace(/^\/(en|fr)/, "/en"),
                "fr-FR": path.replace(/^\/(en|fr)/, "/fr"),
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

/**
 * Generate JSON-LD structured data for blog posts
 */
export function generateBlogPostJsonLd(post: {
    title: string;
    description: string;
    slug: string;
    publishedAt: string;
    updatedAt?: string;
    author: string;
    image?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: `${baseUrl}/blog/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
            "@type": "Person",
            name: post.author,
            url: baseUrl,
        },
        publisher: {
            "@type": "Person",
            name: "Alexandre De Freitas Martins",
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/app/bio/me.jpg`,
            },
        },
        image: post.image ? `${baseUrl}${post.image}` : `${baseUrl}/app/bio/me.jpg`,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${baseUrl}/blog/${post.slug}`,
        },
    };
}

/**
 * Generate JSON-LD structured data for projects
 */
export function generateProjectJsonLd(project: {
    title: string;
    description: string;
    id: string;
    dateCreated: string;
    dateModified?: string;
    image?: string;
    url?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        url: project.url || `${baseUrl}/projects/${project.id}`,
        dateCreated: project.dateCreated,
        dateModified: project.dateModified || project.dateCreated,
        author: {
            "@type": "Person",
            name: "Alexandre De Freitas Martins",
            url: baseUrl,
        },
        image: project.image ? `${baseUrl}${project.image}` : `${baseUrl}/app/bio/me.jpg`,
    };
}

/**
 * Generate breadcrumb JSON-LD structured data
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
        })),
    };
}
