/**
 * File Name: page.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 5/1/2026
 * Description: This is the page.tsx
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
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

import type { Metadata } from "next";
import HomeClient from "./home-client";
import { defaultLocale, isLocale, type Locale } from "@/util/i18n";
import { siteMetadata } from "@/util/metadata";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

type Params = Promise<{ locale: string }>;

const MESSAGES: Record<Locale, typeof fr> = { fr, en };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale: raw } = await params;
    const locale = isLocale(raw) ? raw : defaultLocale;
    const { title, description } = MESSAGES[locale].home;
    // openGraph and twitter replace the layout's objects: start from them so the
    // locale, url and accounts stay, then set this page's title and description
    const site = siteMetadata(locale, `/${locale}`);
    return {
        title: { absolute: title },
        description,
        openGraph: { ...site.openGraph, title, description },
        twitter: { ...site.twitter, title, description },
    };
}

export default function Home() {
    return <HomeClient />;
}
