/**
 * File Name: ThemeSwitcher.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 6/6/2025
 * Description: This is the ThemeSwitcher.tsx
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
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@heroui/react";

export const ThemeSwitcher = () => {
    // resolvedTheme is "light" or "dark" even when the theme follows the system
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLight = mounted && resolvedTheme === "light";
    const label = isLight ? "Switch to dark theme" : "Switch to light theme";

    // HeroUI's onPress already handles mouse, touch, Enter and Space:
    // no extra onKeyDown (it used to toggle twice from the keyboard).
    return (
        <Button
            isIconOnly
            aria-label={label}
            title={label}
            variant="bordered"
            radius="full"
            isDisabled={!mounted}
            onPress={() => setTheme(isLight ? "dark" : "light")}
        >
            {isLight ? <SunIcon size={22} /> : <MoonIcon size={22} />}
        </Button>
    );
};
