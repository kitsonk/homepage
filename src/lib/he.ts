// `he` is CommonJS and is reached from @deno/gfm, a JSR module that Vite
// inlines in dev SSR, where its `module.exports` assignment never runs.
// Load it through Deno's CommonJS require instead. Aliased in
// `astro.config.ts`.
import { createRequire } from "node:module";

export default createRequire(import.meta.url)("he");
