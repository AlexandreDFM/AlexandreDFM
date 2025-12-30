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

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button, PressEvent } from "@heroui/react";
import { ChangeEvent, useEffect, useState } from "react";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleThemeChange = (
        e?:
            | ChangeEvent<HTMLInputElement>
            | React.MouseEvent
            | React.KeyboardEvent
            | PressEvent,
    ) => {
        if (e && typeof (e as any).preventDefault === "function")
            (e as any).preventDefault();

        if (e && typeof (e as any).stopPropagation === "function")
            (e as any).stopPropagation();

        const newTheme = theme === "light" ? "dark" : "light";

        setTheme(newTheme);
    };

    if (!mounted) {
        return (
            <Button
                isIconOnly
                aria-label="Change Theme"
                variant="bordered"
                radius="full"
                disabled
            >
                <SunIcon size={22} />
            </Button>
        );
    }

    return (
        <>
            <Button
                isIconOnly
                aria-label="Change Theme"
                variant="bordered"
                radius="full"
                onPress={handleThemeChange}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleThemeChange(e);
                    }
                }}
            >
                {theme === "light" ? (
                    <SunIcon size={22} />
                ) : (
                    <MoonIcon size={22} />
                )}
            </Button>
        </>
    );
};
