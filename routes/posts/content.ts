import { type Handlers, type RouteConfig } from "$fresh/server.ts";
import { BUILD_ID } from "$fresh/src/server/constants.ts";
import { ASSET_CACHE_BUST_KEY } from "$fresh/runtime.ts";
import { extname, resolve } from "std/path/mod.ts";
import { typeByExtension } from "std/media_types/mod.ts";

const encoder = new TextEncoder();

export const handler: Handlers = {
  async GET(req, { params, renderNotFound }) {
    try {
      const url = new URL(req.url);
      const key = url.searchParams.get(ASSET_CACHE_BUST_KEY);
      if (key !== null && BUILD_ID !== key) {
        url.searchParams.delete(ASSET_CACHE_BUST_KEY);
        const location = url.pathname + url.search;
        return new Response("", {
          status: 307,
          headers: {
            "content-type": "text/plain",
            location,
          },
        });
      }
      const path = resolve(Deno.cwd(), `./posts/${params.id}/${params.path}`);
      const stat = await Deno.stat(path);
      const contentType = typeByExtension(extname(path)) ??
        "application/octet-stream";
      const hash = await crypto.subtle.digest(
        "SHA-1",
        encoder.encode(BUILD_ID + path),
      );
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
      const ifNoneMatch = req.headers.get("if-none-match");
      if (ifNoneMatch === etag || ifNoneMatch === "W/" + etag) {
        return new Response(null, { status: 304, headers });
      } else {
        const file = await Deno.open(path);
        headers.set("content-length", String(stat.size));
        return new Response(file.readable, { headers });
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};

export const config: RouteConfig = {
  routeOverride: "/posts/:id/:path*",
};
