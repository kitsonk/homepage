import { buildPosts } from "./utils/posts.ts";

console.log("%cBuilding%c posts...", "color:green", "color:none");
const posts = await buildPosts();

await Deno.writeTextFile(
  "./posts.json",
  JSON.stringify(posts, undefined, "  "),
);
console.log(`  %c${posts.length} posts written to disk.`, "color:gray");
