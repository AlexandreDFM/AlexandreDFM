<!--
/**
 * File Name: Navbar.vue
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: Navbar.vue
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
const props = defineProps<{
    title: string;
}>();
</script>

<template>
    <header
        class="fixed w-full top-0 z-50 border-b border-gray-700 backdrop-blur"
    >
        <div
            class="flex items-center justify-between gap-3 h-[--header-height] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl"
        >
            <div class="flex items-center justify-start">
                <div
                    class="text-light-500 rounded-2xl flex flex-row items-center justify-center"
                    @click="$router.go(-1)"
                >
                    <Icon color="white" name="uil:arrow-left" size="32" />
                    <span class="text-white font-bold"> Go back </span>
                </div>
            </div>
            <div class="flex flex-row gap-2 items-center mr-14">
                <h1 class="text-2xl font-bold items-center">
                    {{ props.title }}
                </h1>
            </div>
            <div class="flex gap-2 items-center"></div>
        </div>
    </header>
</template>
