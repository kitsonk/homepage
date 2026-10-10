import type { APIRoute } from "astro";
import { typeByExtension } from "@std/media-types";
import { extname, resolve } from "@std/path";

const ASSET_CACHE_BUST_KEY = "__frsh_c";

export const GET: APIRoute = async ({ params, url, request }) => {
  try {
    const path = params.path;
    if (!path) {
      return new Response(null, { status: 404 });
    }
    const key = url.searchParams.get(ASSET_CACHE_BUST_KEY);
    const filePath = resolve(Deno.cwd(), `./posts/${params.id}/${path}`);
    const stat = await Deno.stat(filePath);
    const contentType = typeByExtension(extname(filePath)) ?? "application/octet-stream";
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
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch === etag || ifNoneMatch === "W/" + etag) {
      return new Response(null, { status: 304, headers });
    }
    headers.set("content-length", String(stat.size));
    return new Response(fileBytes, { headers });
  } catch {
    return new Response(null, { status: 404 });
  }
};
