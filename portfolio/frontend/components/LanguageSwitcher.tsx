/**
 * File Name: LanguageSwitcher.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 6/6/2025
 * Description: This is the LanguageSwitcher.tsx
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

'use client';

import { useTranslation } from '../hooks/useTranslation';

export const LanguageSwitcher = () => {
    const { locale, setLocale } = useTranslation();

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setLocale('fr')}
                className={`px-2 py-1 rounded ${
                    locale === 'fr'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                }`}
                aria-label="Changer la langue en français"
            >
                FR
            </button>
            <button
                onClick={() => setLocale('en')}
                className={`px-2 py-1 rounded ${
                    locale === 'en'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                }`}
                aria-label="Change language to English"
            >
                EN
            </button>
        </div>
    );
};
