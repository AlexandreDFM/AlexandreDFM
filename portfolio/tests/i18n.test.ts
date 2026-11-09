import { describe, expect, it } from "vitest";
import { getLocale, isLocale } from "@/util/i18n";

describe("getLocale", () => {
    it("falls back to the default locale for unsupported languages (no /de/de/... loop)", () => {
        expect(getLocale("de-DE,de;q=0.9")).toBe("fr");
        expect(getLocale("es")).toBe("fr");
    });
    it("picks the best supported language by quality", () => {
        expect(getLocale("de-DE,de;q=0.9,en;q=0.8")).toBe("en");
        expect(getLocale("en;q=0.5,fr;q=0.9")).toBe("fr");
        expect(getLocale("en-US,fr;q=0.9")).toBe("en");
        expect(getLocale("fr-FR")).toBe("fr");
    });
    it("handles missing or malformed headers", () => {
        expect(getLocale(null)).toBe("fr");
        expect(getLocale("")).toBe("fr");
        expect(getLocale("*")).toBe("fr");
        expect(getLocale("en;q=0")).toBe("fr");
    });
    it("only accepts known locales", () => {
        expect(isLocale("en")).toBe(true);
        expect(isLocale("de")).toBe(false);
        expect(isLocale(undefined)).toBe(false);
    });
});
