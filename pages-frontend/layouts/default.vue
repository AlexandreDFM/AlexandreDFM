<!--
File Name: default.vue
Author: Alexandre Kévin De Freitas Martins
Creation Date: 2024
Description: This file is the default layout

Copyright (c) 2024 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

<script setup lang="ts">
let navbarTitle = "AlexandreDFM";

const setTitle = (title: string) => {
    console.log("title", title);
    navbarTitle = title;
};
</script>

<template>
    <div
        class="antialiased relative min-h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black"
    >
        <Navbar :title="navbarTitle" />
        <div
            class="w-screen h-screen min-h-[calc(100vh-var(--header-height + --footer-height))] overflow-hidden"
        >
            <div class="h-12"></div>
            <div class="mt-4">
                <slot @setTitle="setTitle" />
            </div>
            <Footer />
        </div>
    </div>
</template>
