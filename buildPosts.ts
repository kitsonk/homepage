import { buildPosts } from "./utils/posts.ts";
import type { Plugin } from "$fresh/server.ts";

console.log("%cBuilding%c posts...", "color:green", "color:none");
const posts = await buildPosts();

await Deno.writeTextFile(
  "./posts.json",
  JSON.stringify(posts, undefined, "  "),
);
console.log(`  %c${posts.length} posts written to disk.`, "color:gray");

export default function svgMinify(): Plugin {
  return {
    name: "build-posts",
    async buildStart(_config) {
      const posts = await buildPosts();
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
