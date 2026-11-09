import { afterEach, describe, expect, it, vi } from "vitest";
import { isDirectusId, proxyDirectusAsset } from "@/util/directus-asset";

const ID = "4db287fb-b787-44eb-b46f-1d632259b6df";

afterEach(() => vi.unstubAllGlobals());

function stubFetch(body: string, contentType: string, status = 200) {
    const fetchMock = vi.fn(async () => new Response(body, { status, headers: { "Content-Type": contentType } }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

describe("isDirectusId", () => {
    it("accepts UUIDs only", () => {
        expect(isDirectusId(ID)).toBe(true);
        expect(isDirectusId("../users/me")).toBe(false);
        expect(isDirectusId("..%2Fusers%2Fme")).toBe(false);
        expect(isDirectusId(`${ID}/../../users`)).toBe(false);
        expect(isDirectusId(undefined)).toBe(false);
    });
});

describe("proxyDirectusAsset", () => {
    it("rejects path traversal before calling Directus", async () => {
        const fetchMock = stubFetch("{}", "application/json");
        const res = await proxyDirectusAsset("../users/me", { kind: "image", label: "test" });
        expect(res.status).toBe(400);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("streams allowed images with nosniff", async () => {
        stubFetch("png-bytes", "image/png");
        const res = await proxyDirectusAsset(ID, { kind: "image", label: "test" });
        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("image/png");
        expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("refuses JSON, HTML and SVG answers", async () => {
        for (const type of ["application/json", "text/html", "image/svg+xml"]) {
            stubFetch("x", type);
            const res = await proxyDirectusAsset(ID, { kind: "media", label: "test" });
            expect(res.status, type).toBe(415);
        }
    });

    it("returns a non-cached 404 when Directus fails", async () => {
        stubFetch("Forbidden", "application/json", 403);
        const res = await proxyDirectusAsset(ID, { kind: "image", label: "test" });
        expect(res.status).toBe(404);
        expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    it("asks Directus for a resized image", async () => {
        const fetchMock = stubFetch("webp", "image/webp");
        await proxyDirectusAsset(ID, { kind: "image", label: "test", transform: { width: 1200, format: "webp" } });
        const url = String((fetchMock.mock.calls[0] as unknown[])[0]);
        expect(url).toContain(`/assets/${ID}?`);
        expect(url).toContain("width=1200");
        expect(url).toContain("format=webp");
    });
});
