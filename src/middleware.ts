import type { APIContext } from "astro";

const DEFAULT_COUNT_URL = "https://kitsonk.goatcounter.com/count";

/**
 * GoatCounter's bot filter (zgo.at/isbot) drops hits whose User-Agent is
 * missing, empty, or a bare library signature — they are stored but excluded
 * from stats, and `/count` still returns 200, so the loss is silent. Forward
 * the visitor's User-Agent so per-visitor sessions (site_id + UA + IP) match
 * what client-side `count.js` would record; fall back to a known-counted UA so
 * a UA-less request is never sent as an empty header (which would be dropped).
 */
const FALLBACK_USER_AGENT = "Mozilla/5.0 (compatible; Cloudflare-Workers)";

export function countUserAgent(visitorUa: string | null | undefined): string {
  const ua = visitorUa?.trim();
  return ua ? ua : FALLBACK_USER_AGENT;
}

/**
 * The Cloudflare adapter exposes the request's `ExecutionContext` as
 * `locals.cfContext` (see `@astrojs/cloudflare`'s `createLocals`). It is absent
 * outside the Worker runtime, e.g. under `astro dev`.
 */
function waitUntilOf(locals: App.Locals): ((promise: Promise<unknown>) => void) | undefined {
  if (!locals || typeof locals !== "object" || !("cfContext" in locals)) return undefined;
  const ctx = locals.cfContext;
  if (!ctx || typeof ctx !== "object" || !("waitUntil" in ctx)) return undefined;
  const { waitUntil } = ctx;
  if (typeof waitUntil !== "function") return undefined;
  return waitUntil.bind(ctx);
}

/**
 * `GOATCOUNTER_COUNT_URL` overrides the count endpoint for local verification.
 * The two runtimes expose env differently: Vite replaces `process.env` with an
 * empty object in `astro dev` (so `import.meta.env` is the live source there),
 * while the Cloudflare adapter keeps `process.env` real in the Worker build and
 * bakes `import.meta.env` at build time.
 */
function countUrl(): string {
  try {
    const fromProcess = process.env.GOATCOUNTER_COUNT_URL;
    if (fromProcess) return fromProcess;
  } catch {
    // `process` is not defined in every runtime.
  }
  return import.meta.env.GOATCOUNTER_COUNT_URL || DEFAULT_COUNT_URL;
}

function titleOf(html: string): string {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match ? match[1].trim() : "";
}

/**
 * Counts document hits with GoatCounter. Fire-and-forget: the count request is
 * handed to the platform's `waitUntil` so the isolate is not torn down before
 * it completes, and every failure is swallowed.
 */
export const onRequest = async (context: APIContext, next: () => Promise<Response>) => {
  const response = await next();

  // Never count build-time prerender passes.
  if (context.isPrerendered) return response;

  const { request } = context;
  if (request.method !== "GET" && request.method !== "HEAD") return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;

  const url = new URL(countUrl());
  url.searchParams.set("p", new URL(request.url).pathname);
  const userAgent = countUserAgent(request.headers.get("user-agent"));

  const task = response
    .clone()
    .text()
    .then((html) => {
      url.searchParams.set("t", titleOf(html));
      return fetch(url, { headers: { "User-Agent": userAgent } });
    })
    .then(() => undefined)
    .catch(() => undefined);

  const waitUntil = waitUntilOf(context.locals);
  if (waitUntil) waitUntil(task);
  else void task;

  return response;
};
