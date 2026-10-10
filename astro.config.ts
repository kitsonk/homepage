import { defineConfig } from "astro/config";
import deno from "@deno/astro-adapter";
import denoVite, { type DenoPluginOptions } from "@deno/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// Schemes @deno/loader knows how to resolve.
const denoSchemes: Record<string, true> = {
  "http:": true,
  "https:": true,
  "npm:": true,
  "jsr:": true,
};
const schemePattern = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;

/**
 * `@deno/vite-plugin` resolves the Deno import map's bare `jsr:` specifiers
 * (e.g. `@std/front-matter/any`) in both dev and build, which Vite/Rolldown
 * cannot do on their own. Upstream it hands every id to `@deno/loader`, which
 * throws on Astro's `virtual:`/`astro:` modules and Vite's `\0` ids, and
 * resolves file paths that do not exist (`src/actions`), so only ids this
 * plugin can actually resolve are passed through: bare specifiers and the
 * schemes @deno/loader speaks.
 */
function denoVitePlugins(options?: DenoPluginOptions) {
  const plugins = denoVite(options);
  for (const plugin of plugins) {
    if (plugin.name !== "deno") {
      continue;
    }
    const resolveId = plugin.resolveId;
    if (typeof resolveId !== "function") {
      continue;
    }
    plugin.resolveId = async function (id, importer, resolveOptions) {
      const scheme = schemePattern.exec(id);
      const isBare = scheme === null && !id.startsWith("\0") && !id.startsWith("/") && !id.startsWith(".");
      // Sub-imports of a module loaded through @deno/loader (relative paths,
      // remote URLs) must always go back to the plugin to be resolved.
      const fromDenoModule = typeof importer === "string" && importer.startsWith("\0deno");
      const denoManaged = isBare ||
        (scheme !== null && denoSchemes[scheme[1].toLowerCase() + ":"] === true) ||
        (fromDenoModule && (id.startsWith(".") || id.startsWith("/")));
      if (!denoManaged) {
        return undefined;
      }
      // npm packages are Vite's to resolve (and to alias to the CommonJS
      // shims); only specifiers Vite cannot resolve (bare `jsr:` import-map
      // entries) fall through to @deno/loader.
      if (isBare && await this.resolve(id, importer, { ...resolveOptions, skipSelf: true }) !== null) {
        return undefined;
      }
      return resolveId.call(this, id, importer, resolveOptions);
    } as typeof plugin.resolveId;
  }
  return plugins;
}

export default defineConfig({
  output: "server",
  adapter: deno({ port: 8000 }),
  compressHTML: true, // lossless whitespace mode (default strips inter-element whitespace)
  trailingSlash: "never", // URL space parity: /blog works, /blog/ does not
  vite: {
    plugins: [
      denoVitePlugins(),
      {
        // Bare specifiers left external are unresolvable when the built server
        // runs under Deno (there is no package.json, and JSR transitives are
        // not in the import map), so the build bundles dependencies instead.
        // Dev keeps them external: the module runner needs their paths.
        name: "deno-bundle-dependencies",
        config(_config, { command }) {
          return command === "build" ? { resolve: { noExternal: true } } : undefined;
        },
      },
      tailwindcss(),
    ],
    resolve: {
      alias: [
        // CommonJS packages reached from @deno/gfm; see the shims.
        { find: /^sanitize-html$/, replacement: fileURLToPath(new URL("./src/lib/sanitizeHtml.ts", import.meta.url)) },
        { find: /^prismjs$/, replacement: fileURLToPath(new URL("./src/lib/prismjs.ts", import.meta.url)) },
        { find: /^he$/, replacement: fileURLToPath(new URL("./src/lib/he.ts", import.meta.url)) },
        { find: "@/", replacement: fileURLToPath(new URL("./", import.meta.url)) },
      ],
    },
  },
});
