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

import "@/styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "./providers";
import {
    jsonLdScript,
    requestLocale,
    siteJsonLd,
    siteMetadata,
} from "@/util/metadata";

export { viewport } from "@/util/metadata";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const calSans = localFont({
    src: "../public/fonts/CalSans-SemiBold.ttf",
    variable: "--font-calsans",
});

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    return siteMetadata(requestLocale(h.get("x-locale")), h.get("x-pathname"));
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = requestLocale((await headers()).get("x-locale"));

    return (
        <html
            lang={locale}
            className={[inter.variable, calSans.variable].join(" ")}
            suppressHydrationWarning
        >
            <body suppressHydrationWarning>
                {siteJsonLd().map((data, i) => (
                    <script
                        key={i}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
                    />
                ))}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
