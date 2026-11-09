/**
 * File Name: sanitize.ts
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 9/11/2026
 * Description: Server-side HTML sanitizing for content coming from Directus
 *              (rendered with dangerouslySetInnerHTML)
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
 *
 */

import sanitize from "sanitize-html";

const options: sanitize.IOptions = {
    allowedTags: [
        ...sanitize.defaults.allowedTags,
        "img",
        "figure",
        "figcaption",
        "h1",
        "h2",
        "picture",
        "source",
        "video",
    ],
    allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        a: ["href", "name", "target", "rel", "title"],
        img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
        source: ["src", "srcset", "type", "media"],
        video: ["src", "controls", "poster", "width", "height", "muted", "loop", "playsinline"],
        code: ["class"],
        pre: ["class"],
        "*": ["id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
        // External links open in a new tab without giving it access to this page
        a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
};

/** Remove scripts, event handlers and dangerous URLs from rich-text HTML. */
export function sanitizeHtml(html: string | null | undefined): string {
    return html ? sanitize(html, options) : "";
}
