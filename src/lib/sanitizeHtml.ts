// `sanitize-html` is CommonJS and is reached from @deno/gfm, a JSR module that
// Vite inlines in dev SSR. Vite's module runner evaluates that inlined CJS as
// ESM (`ReferenceError: require is not defined`), so load it through Deno's
// CommonJS require instead. Aliased in `astro.config.ts`.
import { createRequire } from "node:module";

export default createRequire(import.meta.url)("sanitize-html");
