/**
 * File Name: certification.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: certification.tsx
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

import { useTranslation } from "hooks/useTranslation";

export default function Certification() {
    const { t } = useTranslation();

    return (
        <div className="px-4">
            {t<any[]>("about.content.certification.items", {
                returnObjects: true,
            }).map((cert, index) => (
                <div key={index} className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-default-600">
                            {cert.certification}
                        </h1>
                        <span className="text-sm text-default-400">
                            {cert.date}
                        </span>
                    </div>
                    <div className="text-sm text-default-500">
                        {cert.deliveredBy}
                    </div>
                </div>
            ))}
        </div>
    );
}
