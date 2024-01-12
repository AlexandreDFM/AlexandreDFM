<!--
/**
 * File Name: Footer.vue
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: Footer.vue
 * Company: Tux Inc.
 * Version: 1.0.0
 * License: MIT
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
-->

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
    <div>
        <footer>
            <div
                class="text-gray-300 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:flex lg:items-center lg:justify-between lg:py-4"
            >
                Made with
                <Icon
                    class="mx-1 text-red-600 hover:text-red-800 transition duration-150 ease-in-out border-black"
                    icon="i-mdi-heart "
                    size="sm"
                    color="red"
                />
                by AlexandreDFM
                <div
                    class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3"
                >
                    <Icon
                        aria-label="Linkedin Logo"
                        icon="i-mdi-linkedin"
                        size="sm"
                        to="https://www.linkedin.com/in/alexandre-de-freitas-martins/"
                        color="gray"
                        variant="ghost"
                    />
                    <Icon
                        aria-label="Twitter Logo"
                        icon="i-mdi-twitter"
                        size="sm"
                        to="https://x.com/AlexandreDFM"
                        color="gray"
                        variant="ghost"
                    />
                    <Icon
                        aria-label="Github Logo"
                        icon="i-mdi-github"
                        size="sm"
                        to="https://github.com/AlexandreDFM"
                        color="gray"
                        variant="ghost"
                    />
                </div>
                <div
                    class="mt-3 lg:mt-0 lg:order-2 flex items-center justify-center"
                >
                    <span class="text-sm text-gray-500" />
                </div>
                <div
                    class="lg:flex-1 flex items-center justify-center lg:justify-start gap-x-1.5 lg:order-1"
                >
                    <span class="text-sm text-gray-500" />
                </div>
            </div>
        </footer>
    </div>
</template>
