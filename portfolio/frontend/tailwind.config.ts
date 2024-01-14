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

import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const { nextui } = require("@nextui-org/react");

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        "code::before": {
                            content: '""',
                        },
                        "code::after": {
                            content: '""',
                        },
                    },
                },
                quoteless: {
                    css: {
                        "blockquote p:first-of-type::before": {
                            content: "none",
                        },
                        "blockquote p:first-of-type::after": {
                            content: "none",
                        },
                    },
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
            animation: {
                "fade-in": "fade-in 3s ease-in-out forwards",
                title: "title 3s ease-out forwards",
                "fade-left": "fade-left 3s ease-in-out forwards",
                "fade-right": "fade-right 3s ease-in-out forwards",
            },
            keyframes: {
                "fade-in": {
                    "0%": {
                        opacity: "0%",
                    },
                    "75%": {
                        opacity: "0%",
                    },
                    "100%": {
                        opacity: "100%",
                    },
                },
                "fade-left": {
                    "0%": {
                        transform: "translateX(100%)",
                        opacity: "0%",
                    },

                    "30%": {
                        transform: "translateX(0%)",
                        opacity: "100%",
                    },
                    "100%": {
                        opacity: "0%",
                    },
                },
                "fade-right": {
                    "0%": {
                        transform: "translateX(-100%)",
                        opacity: "0%",
                    },

                    "30%": {
                        transform: "translateX(0%)",
                        opacity: "100%",
                    },
                    "100%": {
                        opacity: "0%",
                    },
                },
                title: {
                    "0%": {
                        "line-height": "0%",
                        "letter-spacing": "0.25em",
                        opacity: "0",
                    },
                    "25%": {
                        "line-height": "0%",
                        opacity: "0%",
                    },
                    "80%": {
                        opacity: "100%",
                    },

                    "100%": {
                        "line-height": "100%",
                        opacity: "100%",
                    },
                },
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("tailwindcss-debug-screens"),
        nextui(),
    ],
};
export default config;
