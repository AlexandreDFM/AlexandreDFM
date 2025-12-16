/**
 * File Name: association.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: association.tsx
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

import { useTranslation } from "@/hooks/useTranslation";

export default function Association() {
    const { t } = useTranslation();

    return (
        <div className="px-4">
            {t<any[]>("about.content.association.items", {
                returnObjects: true,
            }).map((assoc, index) => (
                <div key={index} className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <h1 className="text-default-600 text-lg font-semibold">
                            {assoc.title}
                        </h1>
                        <span className="text-default-400 text-sm">
                            {assoc.date}
                        </span>
                    </div>
                    <p className="text-default-400 text-sm">
                        {assoc.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
