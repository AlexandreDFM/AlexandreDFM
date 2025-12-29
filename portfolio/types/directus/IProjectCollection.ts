/**
 * File Name: IProjectCollection.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 26/12/2025
 * Description: This is the IProjectCollection.ts
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

export interface IProjectCollection {
    id: string;
    status?: "published" | "draft" | "archived";
    sort?: number;
    user_created?: string;
    user_updated?: string;
    date_created?: string;
    date_updated?: string;

    title: string;
    description: string;
    date?: string;
    image?: string; // File ID for project image/thumbnail

    github?: string;
    role?: string;
    duration?: string;
    skills?: string[];
    technologies?: string[];
    achievements?: string[];
    category?: ("professional" | "personal" | "academic")[];
    is_featured?: boolean;

    // Translations fields
    title_en?: string;
    title_fr?: string;
    description_en?: string;
    description_fr?: string;
    role_en?: string;
    role_fr?: string;
    duration_en?: string;
    duration_fr?: string;
    skills_en?: string[];
    skills_fr?: string[];
    technologies_en?: string[];
    technologies_fr?: string[];
    achievements_en?: string[];
    achievements_fr?: string[];
}
