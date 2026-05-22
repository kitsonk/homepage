import { buildPosts } from "./posts.ts";

const posts = await buildPosts();
await Deno.writeTextFile(
  "./posts.json",
  `${JSON.stringify(posts, undefined, "  ")}\n`,
);
