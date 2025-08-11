/**
 * File Name: work.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: work.tsx
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

export default function Work() {
    const { t } = useTranslation();

    return (
        <div>
            {t<any[]>('about.content.job.items', { returnObjects: true }).map((job, index) => (
                <div key={index} className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-default-600">{job.title}</h3>
                        <span className="text-sm text-default-400">{job.date}</span>
                    </div>
                    <div className="text-sm text-default-500">{job.company}</div>
                    <p className="text-sm text-default-400">{job.desc}</p>
                </div>
            ))}
        </div>
    );
}
