/**
 * File Name: LanguageSwitcher.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 6/6/2025
 * Description: This is the LanguageSwitcher.tsx
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

import { useTranslation } from "../hooks/useTranslation";
import { Avatar, Select, SelectItem } from "@heroui/react";

export const LanguageSwitcher = () => {
    const { t, locale, setLocale } = useTranslation();

    const handleLanguageChange = (keys: any) => {
        const selectedKey = Array.from(keys)[0] as "fr" | "en";
        console.log("Selected locale:", selectedKey);
        setLocale(selectedKey);
    };

    const langArray = t<
        Array<{
            fr?: { key: string; flag: string; label: string };
            en?: { key: string; flag: string; label: string };
        }>
    >("lang", { returnObjects: true });

    const languages: { key: string; flag: string; label: string }[] = [];
    langArray.forEach((item) => {
        if (item.fr) languages.push(item.fr);
        if (item.en) languages.push(item.en);
    });

    const currentLang = languages.find((lang) => lang.key === locale);

    return (
        <div role="group" aria-label="Language selection">
            <Select
                className="w-36"
                selectedKeys={[locale]}
                onSelectionChange={handleLanguageChange}
                aria-label="Select language"
                startContent={
                    currentLang && (
                        <Avatar
                            alt={`${currentLang.label} flag`}
                            className="h-5 w-5 shrink-0 md:h-6 md:w-6"
                            radius="full"
                            src={`https://flagcdn.com/${currentLang.flag}.svg`}
                        />
                    )
                }
            >
                {languages.map((lang) => (
                    <SelectItem
                        key={lang.key}
                        aria-label={`Switch to ${lang.label}`}
                        startContent={
                            <Avatar
                                alt={`${lang.label} flag`}
                                className="h-5 w-5 shrink-0 md:h-6 md:w-6"
                                radius="full"
                                src={`https://flagcdn.com/${lang.flag}.svg`}
                            />
                        }
                    >
                        {lang.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
};
