import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import buildPosts from "./buildPosts.ts";

export default defineConfig({
  plugins: [tailwind(), buildPosts()],
});
