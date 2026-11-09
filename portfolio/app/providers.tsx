/**
 * File Name: providers.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 9/11/2026
 * Description: Client-side providers (HeroUI, theme) and the animated background
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
 *
 */

"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange={false}
            >
                <AnimatedBackground>{children}</AnimatedBackground>
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
