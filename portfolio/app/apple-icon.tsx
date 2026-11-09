/**
 * File Name: apple-icon.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 9/11/2026
 * Description: Home-screen icon for iOS (served at /apple-icon, linked automatically)
 * Copyright (c) 2026 Alexandre Kévin DE FREITAS MARTINS
 *
 */

import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
                    color: "#f8fafc",
                    fontSize: 84,
                    fontWeight: 700,
                    letterSpacing: -4,
                }}
            >
                AD
            </div>
        ),
        size,
    );
}
