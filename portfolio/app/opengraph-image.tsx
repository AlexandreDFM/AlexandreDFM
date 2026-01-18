/**
 * File Name: opengraph-image.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2026
 * Description: Generates OpenGraph image for social media previews
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
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

import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Alexandre De Freitas Martins - Full Stack Developer";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 60,
                    background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: "bold",
                            background: "linear-gradient(90deg, #ffffff, #a0a0a0)",
                            backgroundClip: "text",
                            color: "transparent",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Alexandre De Freitas Martins
                    </div>
                    <div
                        style={{
                            fontSize: 36,
                            color: "#a0a0a0",
                        }}
                    >
                        Developer
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            color: "#666666",
                            marginTop: "20px",
                        }}
                    >
                        Portfolio • Projects • Blog
                    </div>
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "40px",
                        fontSize: 28,
                        color: "#505050",
                    }}
                >
                    alexandredfm.fr
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
