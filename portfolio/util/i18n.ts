/**
 * File Name: i18n.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 9/11/2026
 * Description: Supported locales and Accept-Language negotiation
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
 *
 */

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isLocale(value: string | undefined): value is Locale {
    return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Best supported locale from Accept-Language, e.g. "de-DE,de;q=0.9,en;q=0.8" -> "en".
 * Unsupported languages fall back to the default locale (never to an unknown prefix,
 * which used to cause an infinite /de/de/de/... redirect).
 */
export function getLocale(acceptLanguage: string | null): Locale {
    if (!acceptLanguage) return defaultLocale;
    const ranked = acceptLanguage
        .split(",")
        .map((part) => {
            const [tag, ...params] = part.trim().split(";");
            const q = params.find((p) => p.trim().startsWith("q="));
            return {
                lang: tag.trim().toLowerCase().split("-")[0],
                q: q ? Number(q.trim().slice(2)) || 0 : 1,
            };
        })
        .filter((entry) => entry.lang && entry.q > 0)
        .sort((a, b) => b.q - a.q);
    return ranked.find((entry) => isLocale(entry.lang))?.lang as Locale ?? defaultLocale;
}
