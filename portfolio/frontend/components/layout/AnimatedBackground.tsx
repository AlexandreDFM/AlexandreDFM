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

import { useTheme } from "next-themes";
import Particles from "components/particles";
import React, { useState, useEffect } from "react";

interface AnimatedBackgroundProps {
    children: React.ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
    const { theme } = useTheme();
    const [floatingLights, setFloatingLights] = useState<Array<{
        left: string;
        top: string;
        animationDelay: string;
        opacity: number;
    }>>([]);

    useEffect(() => {
        // Generate random values only on the client side
        const lights = [...Array(20)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.3
        }));
        setFloatingLights(lights);
    }, []);

    const isDark = theme === 'dark';

    return (
        <div className={`relative flex flex-col items-center justify-center w-screen min-h-screen overflow-hidden transition-all duration-300 ${
            isDark
                ? 'bg-gradient-to-tl from-slate-900 via-blue-900/30 to-slate-900'
                : 'bg-gradient-to-tl from-orange-50 via-blue-50/50 to-blue-100/30'
        }`}>
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

            {/* Particles effect */}
            <Particles
                className="absolute inset-0 -z-10 animate-fade-in"
                quantity={150}
                staticity={30}
                color={isDark ? "59, 130, 246" : "37, 99, 235"}
            />

            {/* Floating lights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingLights.map((light, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full animate-floating transition-all duration-300 ${
                            isDark ? 'bg-blue-400' : 'bg-blue-500'
                        }`}
                        style={{
                            left: light.left,
                            top: light.top,
                            animationDelay: light.animationDelay,
                            opacity: isDark ? light.opacity : light.opacity * 0.7
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
