#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { tailwind } from "@fresh/plugin-tailwind";
import { Builder } from "fresh/dev";

import { buildPosts } from "./utils/posts.ts";

const builder = new Builder({ serverEntry: "main.tsx" });
const posts = await buildPosts();
await Deno.writeTextFile("./posts.json", `${JSON.stringify(posts, undefined, "  ")}\n`);
tailwind(builder);
if (Deno.args.includes("build")) {
  await builder.build();
} else {
  await builder.listen(() => import("./main.tsx"));
}
