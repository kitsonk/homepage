import { App, type Context, HttpError, staticFiles } from "fresh";
import { GA4Report, isDocument } from "@kitsonk/ga4";
import { typeByExtension } from "@std/media-types";
import { extname, resolve } from "@std/path";

import type { State } from "./utils.ts";

const ASSET_CACHE_BUST_KEY = "__frsh_c";

export const app = new App<State>();

app
  .use(async (ctx) => {
    const request = ctx.req;
    const response = await ctx.next();
    queueMicrotask(async () => {
      if (!isDocument(request, response)) {
        return;
      }
      // deno-lint-ignore no-explicit-any
      const report = new GA4Report({ request, response, conn: ctx.info as any });
      await report.send();
    });
    return response;
  })
  .get("/posts/:id/:path+", async (ctx: Context<State>) => {
    try {
      const url = new URL(ctx.url);
      const key = url.searchParams.get(ASSET_CACHE_BUST_KEY);
      const filePath = resolve(
        Deno.cwd(),
        `./posts/${ctx.params.id}/${ctx.params.path}`,
      );
      const stat = await Deno.stat(filePath);
      const contentType = typeByExtension(extname(filePath)) ??
        "application/octet-stream";
      const fileBytes = await Deno.readFile(filePath);
      const hash = await crypto.subtle.digest("SHA-1", fileBytes);
      const etag = Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      const headers = new Headers({
        "content-type": contentType,
        etag,
        vary: "If-None-Match",
      });
      if (key !== null) {
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
      }
      const ifNoneMatch = ctx.req.headers.get("if-none-match");
      if (ifNoneMatch === etag || ifNoneMatch === "W/" + etag) {
        return new Response(null, { status: 304, headers });
      }
      headers.set("content-length", String(stat.size));
      return new Response(fileBytes, { headers });
    } catch {
      //
    }
    throw new HttpError(404);
  })
  .use(staticFiles())
  .fsRoutes();
