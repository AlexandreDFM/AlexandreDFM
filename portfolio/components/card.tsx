/**
 * File Name: card.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: card.tsx
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

import {
    motion,
    useSpring,
    useMotionTemplate,
} from "framer-motion";

import { PropsWithChildren, useRef, useEffect } from "react";

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const rect = cardRef.current ? cardRef.current.getBoundingClientRect() : null;
    const mouseX = useSpring(rect === null ? 0 : rect.width / 2, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(rect === null ? 0 : rect.height / 2, { stiffness: 500, damping: 100 });

    useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            mouseX.set(rect.width / 2);
            mouseY.set(rect.height / 2);
        }
    }, [mouseX, mouseY]);

    function onMouseMove({ currentTarget, clientX, clientY }: any) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            className="group relative overflow-hidden rounded-xl border border-zinc-600 duration-700 hover:border-zinc-400/50 hover:bg-zinc-800/10 md:gap-8"
        >
            <div className="pointer-events-none">
                <div className="absolute inset-0 z-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
                <motion.div
                    className="absolute inset-0 z-10 bg-gradient-to-br via-zinc-100/10 opacity-100 transition duration-1000 group-hover:opacity-50"
                    style={style}
                />
                <motion.div
                    className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
                    style={style}
                />
            </div>
            {children}
        </div>
    );
};
