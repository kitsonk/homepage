import type { APIRoute } from "astro";
import postsJson from "../../posts.json" with { type: "json" };
import { buildRss } from "../lib/rss.ts";

export const GET: APIRoute = () =>
  new Response(buildRss(postsJson), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
