/**
 * File Name: route.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 26/12/2025
 * Description: This is the route.ts
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

import { getAvatarFileId } from "@/util/directus";
import { proxyDirectusAsset } from "@/util/directus-asset";

// Resolved at request time: a build-time render would bake a 404 into the image
export const dynamic = "force-dynamic";

export async function GET() {
    const avatarId = await getAvatarFileId();
    if (!avatarId) {
        return new Response("Avatar not found", {
            status: 404,
            headers: { "Cache-Control": "no-store" },
        });
    }
    return proxyDirectusAsset(avatarId, {
        kind: "image",
        label: "API/avatar/image",
        transform: { width: 512, format: "webp", quality: 85 },
    });
}
