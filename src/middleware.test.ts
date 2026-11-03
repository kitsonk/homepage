import { expect, test } from "vitest";
import { countUserAgent } from "./middleware.ts";

const FALLBACK = "Mozilla/5.0 (compatible; Cloudflare-Workers)";

test("countUserAgent - forwards the visitor's User-Agent unchanged", () => {
  const ua =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
  expect(countUserAgent(ua)).toBe(ua);
});

test("countUserAgent - falls back to a counted UA when absent, empty, or blank", () => {
  expect(countUserAgent(null)).toBe(FALLBACK);
  expect(countUserAgent(undefined)).toBe(FALLBACK);
  expect(countUserAgent("")).toBe(FALLBACK);
  expect(countUserAgent("   ")).toBe(FALLBACK);
});
