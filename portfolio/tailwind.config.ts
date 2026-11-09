/**
 * File Name: tailwind.config.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: tailwind.config.ts
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

import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./styles/**/*.css",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554",
                },
                background: {
                    light: "rgb(var(--background-start-rgb))",
                    dark: "rgb(var(--background-end-rgb))",
                },
                foreground: {
                    DEFAULT: "rgb(var(--foreground-rgb))",
                },
                accent: {
                    blue: "rgb(var(--accent-blue))",
                    "blue-light": "rgb(var(--accent-blue-light))",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
                display: ["var(--font-calsans)"],
            },
            backgroundImage: {
                "gradient-radial":
                    "radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
            },
            // Animations and keyframes are declared once, in styles/globals.css (@theme)
        },
    },
    plugins: [
        heroui({
            themes: {
                light: {
                    colors: {
                        background: "#faf5ee",
                        foreground: "#292524",
                        primary: {
                            50: "#eff6ff",
                            100: "#dbeafe",
                            200: "#bfdbfe",
                            300: "#93c5fd",
                            400: "#60a5fa",
                            500: "#3b82f6",
                            600: "#2563eb",
                            700: "#1d4ed8",
                            800: "#1e40af",
                            900: "#1e3a8a",
                            DEFAULT: "#1d4ed8",
                            foreground: "#ffffff",
                        },
                        default: {
                            50: "#faf5ee",
                            100: "#f5ede3",
                            200: "#e7d4c1",
                            300: "#d6b896",
                            400: "#c69963",
                            500: "#b8834a",
                            600: "#a0703f",
                            700: "#855836",
                            800: "#6d4830",
                            900: "#5a3c2a",
                            DEFAULT: "#e7d4c1",
                            foreground: "#292524",
                        },
                        secondary: {
                            50: "#faf5ee",
                            100: "#f5ede3",
                            200: "#e7d4c1",
                            300: "#d6b896",
                            400: "#c69963",
                            500: "#b8834a",
                            600: "#a0703f",
                            700: "#855836",
                            800: "#6d4830",
                            900: "#5a3c2a",
                            DEFAULT: "#e7d4c1",
                            foreground: "#292524",
                        },
                    },
                },
                dark: {
                    colors: {
                        background: "#0f172a",
                        foreground: "#f8fafc",
                        primary: {
                            50: "#eff6ff",
                            100: "#dbeafe",
                            200: "#bfdbfe",
                            300: "#93c5fd",
                            400: "#60a5fa",
                            500: "#3b82f6",
                            600: "#2563eb",
                            700: "#1d4ed8",
                            800: "#1e40af",
                            900: "#1e3a8a",
                            DEFAULT: "#3b82f6",
                            foreground: "#ffffff",
                        },
                        default: {
                            50: "#020617",
                            100: "#0f172a",
                            200: "#1e293b",
                            300: "#334155",
                            400: "#475569",
                            500: "#64748b",
                            600: "#94a3b8",
                            700: "#cbd5e1",
                            800: "#e2e8f0",
                            900: "#f1f5f9",
                            DEFAULT: "#1e293b",
                            foreground: "#f8fafc",
                        },
                    },
                },
            },
        }),
    ],
};
export default config;
