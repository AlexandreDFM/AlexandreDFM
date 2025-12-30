/**
 * File Name: AnimatedBackground.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 6/6/2025
 * Description: This is the AnimatedBackground.tsx
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

import Particles from "../particles";
import { useTheme } from "next-themes";
import { useState, useEffect, memo } from "react";
import { IAnimatedBackgroundProps } from "@/types/IAnimatedBackgroundProps";

const AnimatedBackground = memo(function AnimatedBackground({
    children,
}: IAnimatedBackgroundProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [floatingLights, setFloatingLights] = useState<
        Array<{
            left: string;
            top: string;
            animationDelay: string;
            opacity: number;
        }>
    >([]);

    useEffect(() => {
        setMounted(true);
        // Reduce from 20 to 10 lights for better performance
        const lights = [...Array(10)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.3,
        }));
        setFloatingLights(lights);
    }, []);

    if (!mounted) {
        return (
            <div className="relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden bg-slate-900">
                <div className="relative z-10 w-full">{children}</div>
            </div>
        );
    }

    const isDark = theme === "dark";

    return (
        <div
            className={`relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                isDark
                    ? "bg-linear-to-tl from-slate-900 via-blue-900/30 to-slate-900"
                    : "bg-linear-to-tl from-orange-50 via-blue-50/50 to-blue-100/30"
            }`}
        >
            {/* Animated background effects */}
            {/* <div className={`absolute inset-0 animate-pulse-slow transition-all duration-300 ${
                isDark
                    ? 'bg-gradient-to-b from-blue-950/50 to-transparent'
                    : 'bg-gradient-to-b from-blue-100/30 to-transparent'
            }`} />
            <div className="absolute inset-0">
                <div className={`absolute inset-0 animate-aurora transition-all duration-300 ${
                    isDark
                        ? 'bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),rgba(59,130,246,0)_50%)]'
                        : 'bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.08),rgba(147,197,253,0)_50%)]'
                }`} />
            </div> */}

            {/* Particles effect - reduced quantity for better performance */}
            <Particles
                className="animate-fade-in absolute inset-0 -z-10"
                quantity={75}
                staticity={30}
                color={isDark ? "59, 130, 246" : "37, 99, 235"}
            />

            {/* Floating lights */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {floatingLights.map((light, i) => (
                    <div
                        key={i}
                        className={`animate-floating absolute h-2 w-2 rounded-full transition-all duration-300 ${
                            isDark ? "bg-blue-400" : "bg-blue-500"
                        }`}
                        style={{
                            left: light.left,
                            top: light.top,
                            animationDelay: light.animationDelay,
                            opacity: isDark
                                ? light.opacity
                                : light.opacity * 0.7,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
});

export default AnimatedBackground;
