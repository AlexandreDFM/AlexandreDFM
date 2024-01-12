<!--
/**
 * File Name: [...slug].vue
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: [...slug].vue
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
const emits = defineEmits<{ (event: "setTitle", title: string): void }>();

const title = "Tux Inc. - Home";
emits("setTitle", title);
</script>

<template>
    <div class="flex flex-col items-center justify-center overflow-hidden">
        <div class="text-light-500 gap-4 max-w-[900px] mx-auto p-4">
            <div id="nuxtContent">
                <ContentDoc v-slot="{ doc }">
                    <article class="text-gray-300">
                        <ContentRenderer :value="doc" class="text-primary" />
                    </article>
                </ContentDoc>
            </div>
        </div>
    </div>
</template>
