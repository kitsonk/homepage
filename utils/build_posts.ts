import { writeFile } from "node:fs/promises";
import { buildPosts } from "./posts.ts";

const posts = await buildPosts();
await writeFile(
  "./posts.json",
  `${JSON.stringify(posts, undefined, "  ")}\n`,
);
