/**
 * File Name: page.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 5/1/2026
 * Description: This is the page.tsx
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
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

import { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
    title: "AlexandreDFM - Portfolio",
    description: "Alexandre De Freitas Martins - Full Stack Developer. Passionate about hownee.com and tux-inc.com. Explore my projects, blog, and get in touch.",
    keywords: ["Alexandre De Freitas Martins", "AlexandreDFM", "Portfolio", "Developer", "Full Stack", "Web Development"],
    authors: [{ name: "Alexandre De Freitas Martins" }],
    openGraph: {
        title: "AlexandreDFM - Portfolio",
        description: "Alexandre De Freitas Martins - Full Stack Developer. Passionate about hownee.com and tux-inc.com.",
        type: "website",
        locale: "en_US",
        siteName: "AlexandreDFM",
    },
    twitter: {
        card: "summary_large_image",
        title: "AlexandreDFM - Portfolio",
        description: "Alexandre De Freitas Martins - Full Stack Developer. Passionate about hownee.com and tux-inc.com.",
    },
};

export default function Home() {
    return <HomeClient />;
}
