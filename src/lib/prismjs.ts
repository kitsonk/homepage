// `prismjs` is CommonJS and is reached from @deno/gfm, a JSR module that Vite
// inlines in dev SSR; Vite's module runner would evaluate it as ESM, so the
// `module.exports = Prism` assignment never runs and the default import is
// undefined. Load it through Deno's CommonJS require instead (this also sets
// the `globalThis.Prism` that prismjs component files rely on). Aliased in
// `astro.config.ts`.
import { createRequire } from "node:module";

export default createRequire(import.meta.url)("prismjs");
