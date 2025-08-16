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

"use client";

import "./globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import AnimatedBackground from "components/layout/AnimatedBackground";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const calSans = localFont({
    src: "../public/fonts/CalSans-SemiBold.ttf",
    variable: "--font-calsans",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={[inter.variable, calSans.variable].join(" ")} suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Alexandre De Freitas Martins - Portfolio" />
            </head>
            <body suppressHydrationWarning>
                <HeroUIProvider>
                    <NextThemesProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={true}
                        disableTransitionOnChange={false}
                    >
                        <AnimatedBackground>
                            {children}
                        </AnimatedBackground>
                    </NextThemesProvider>
                </HeroUIProvider>
            </body>
        </html>
    );
}
