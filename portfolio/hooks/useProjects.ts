/**
 * File Name: useProjects.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2025
 * Description: Custom hook for fetching projects from Directus API
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

import { IProject } from '@/types/IProject';
import { useState, useEffect, useCallback } from 'react';

interface UseProjectsOptions {
    language?: 'en' | 'fr';
    featured?: boolean;
}

interface UseProjectsReturn {
    projects: IProject[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
    const { language = 'en', featured = false } = options;
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Memoize fetch function to prevent unnecessary recreations
    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                lang: language,
                ...(featured && { featured: 'true' }),
            });

            const response = await fetch(`/api/projects?${params}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch projects: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                setProjects(result.data || []);
            } else {
                throw new Error(result.error || 'Failed to fetch projects');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }, [language, featured]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const refetch = () => {
        fetchProjects();
    };

    return {
        projects,
        loading,
        error,
        refetch,
    };
}
