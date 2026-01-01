/**
 * File Name: useTranslation.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 6/6/2025
 * Description: This is the useTranslation.ts
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

import Cookies from "js-cookie";
import { useState } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import { usePathname } from "next/navigation";

type TranslationType = typeof fr;
type NestedKeys<T> = T extends string
    ? never
    : T extends object
      ? {
            [K in keyof T]: `${string & K}${"" | `.${NestedKeys<T[K]>}`}`;
        }[keyof T]
      : never;

const translations: Record<string, TranslationType> = {
    en,
    fr,
};

// Get the user's preferred language from URL pathname
const getInitialLanguage = (pathname: string): "en" | "fr" => {
    // Check if pathname starts with a locale
    if (pathname.startsWith("/fr/") || pathname === "/fr") {
        return "fr";
    }
    if (pathname.startsWith("/en/") || pathname === "/en") {
        return "en";
    }
    // Default to English if no locale in path
    return "en";
};

// Get the actual client language preference
const getClientLanguage = (): "en" | "fr" => {
    if (typeof window === "undefined") {
        // Server-side: check cookies from request headers
        // Default to English on server
        return "en";
    }

    // Client-side: check cookies first, then browser language
    const savedLocale = Cookies.get("locale");
    if (savedLocale === "fr" || savedLocale === "en") {
        return savedLocale;
    }

    const browserLang = navigator.language.split("-")[0];
    return browserLang === "fr" ? "en" : "fr";
};

export const useTranslation = () => {
    const pathname = usePathname();
    const [locale, setLocaleState] = useState<"en" | "fr">(() =>
        getInitialLanguage(pathname),
    );

    const t = <T = string>(
        key: NestedKeys<TranslationType>,
        options?: { returnObjects: boolean },
    ): T => {
        const keys = key.split(".");
        let translation: any = translations[locale];

        for (const k of keys) {
            if (translation && typeof translation === "object") {
                translation = translation[k];
            } else {
                return key as T;
            }
        }

        if (options?.returnObjects) {
            return translation as T;
        }

        if (typeof translation !== "string") {
            return key as T;
        }

        return translation as T;
    };

    const setLocale = (newLocale: "en" | "fr") => {
        // Store for 1 year
        Cookies.set("locale", newLocale, { expires: 365 });
        setLocaleState(newLocale);

        // Navigate to the new locale by replacing the locale in the pathname
        const currentPath = pathname;
        let newPath: string;

        // Remove the current locale prefix if it exists
        if (currentPath.startsWith("/fr/")) {
            newPath = currentPath.replace("/fr/", `/${newLocale}/`);
        } else if (currentPath.startsWith("/en/")) {
            newPath = currentPath.replace("/en/", `/${newLocale}/`);
        } else if (currentPath === "/fr" || currentPath === "/en") {
            newPath = `/${newLocale}`;
        } else {
            // No locale in path, add it
            newPath = `/${newLocale}${currentPath}`;
        }

        window.location.href = newPath;
    };

    return {
        t,
        locale,
        setLocale,
    };
};
