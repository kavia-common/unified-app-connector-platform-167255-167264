import { api } from "@/lib/api";

describe("api.http wrapper", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch as any;
  });

  it("sends tenant header and parses json", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Map([["content-type", "application/json"]]),
      json: async () => ({ message: "ok" }),
    });

    const res = await api.listConnectors("t-1", null);
    expect(res).toEqual({ message: "ok" });
    const call = (global.fetch as any).mock.calls[0];
    const headers = call[1].headers;
    expect(headers["x-tenant-id"]).toBe("t-1");
  });

  it("throws on http error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      headers: new Map([["content-type", "text/plain"]]),
      text: async () => "bad",
    });

    await expect(api.listConnectors("t-1", null)).rejects.toThrow(/HTTP 400/);
  });
});
