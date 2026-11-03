import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  output: "server",
  // The site uses no sessions, client islands or image components; keeping both
  // off avoids unused SESSION (KV) and IMAGES bindings in the Worker.
  session: false,
  adapter: cloudflare({ imageService: "passthrough" }),
  compressHTML: true, // lossless whitespace mode (default strips inter-element whitespace)
  trailingSlash: "never", // URL space parity: /blog works, /blog/ does not
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [{ find: "@/", replacement: fileURLToPath(new URL("./", import.meta.url)) }],
    },
  },
});
