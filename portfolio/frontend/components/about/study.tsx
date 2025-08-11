/**
 * File Name: study.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: study.tsx
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

'use client';

import { useTranslation } from "hooks/useTranslation";

export default function Study() {
    const { t } = useTranslation();

    return (
        <div>
            {t<any[]>('about.content.formation.items', { returnObjects: true }).map((formation, index) => (
                <div key={index} className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3 className="flex-grow text-lg font-semibold text-default-600">{formation.degree}</h3>
                        <span className="flex-shrink-0 align-middle text-sm text-default-400">{formation.date}</span>
                    </div>
                    <div className="text-sm text-default-500">{formation.school}</div>
                    <p className="text-sm text-default-400">{formation.desc}</p>
                </div>
            ))}
        </div>
    );
}
