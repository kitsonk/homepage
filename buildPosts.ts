import { buildPosts as build } from "./utils/posts.ts";
import type { Plugin } from "$fresh/server.ts";

export default function buildPosts(): Plugin {
  return {
    name: "build-posts",
    async buildStart(_config) {
      const posts = await build();
      await Deno.writeTextFile(
        "./posts.json",
        `${JSON.stringify(posts, undefined, "  ")}\n`,
      );
      console.log(
        "%cPosts index build.",
        "color:green;font-weight:bold",
      );
    },
  };
}
