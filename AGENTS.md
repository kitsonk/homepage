# Repository Guidelines

Personal homepage of Kitson P. Kelly (kitsonkelly.com): a server-rendered
blog/CV site built with **Astro 7 SSR on Node 26 + pnpm**, targeted at
**Cloudflare Workers** via `@astrojs/cloudflare`. Strictly Markdown +
front-matter. There is **no first-party client-side JavaScript** — no islands,
no hydration, no signals — the only script is GoatCounter's `count.js` analytics
embed, so every interactive concern is a plain hyperlink or form.

## Project Overview

- 8 HTML pages, 6 chart-SVG endpoints (ApexCharts SSR → static SVG), an RSS
  feed, plus GoatCounter hit counting via the client-side `count.js` embed in
  `src/layouts/App.astro`. Post assets are copied to
  static output at build time.
- Content is committed Markdown under `posts/`, pre-processed into a committed
  `posts.json` index.
- Everything is rendered per-request (SSR) and nothing is cached in memory,
  with one exception: the six chart endpoints are prerendered at build time
  (`export const prerender = true`) and served as Workers assets. (Prerendering
  content routes is the documented mitigation if Workers CPU limits bite.)
- This repo migrated off Deno (Deno Deploy) in Nov 2026. Deno is gone from the
  toolchain; the only `Deno.` string left is site prose about Oak in
  `src/pages/index.astro`.

## Architecture & Data Flow

```
request → src/layouts/App.astro (emits <head>, incl. the GoatCounter `count.js` embed) → src/pages/*.astro
                                                     ↑ `<App meta={meta}>…</App>` wraps every page
endpoints: src/pages/**/*.ts export `const GET: APIRoute` and return a Response (no layout)
```

- **Layout owns the document.** `src/layouts/App.astro` is the only
  `<html>`/`<head>` producer; it imports `src/styles/global.css` and emits
  `<slot />` inside `<body>`. Head-tag order is deliberate (see Patterns). No
  other file emits head tags.
- **Meta contract.** Pages build `const meta: MetaProps = { … }`
  (`src/lib/meta.ts`) and pass it down. `NOT_FOUND_META` is the shared 404 meta.
- **Content pipeline.** `posts/<id>.md` or `posts/<id>/index.md` (+ sibling
  assets) → `pnpm build:posts` → committed `posts.json` → imported at module
  load by `@/utils/posts.ts` (exported as `posts: Post[]`) → pages/components.
  `src/pages/rss-feed.ts` imports `posts.json` directly and passes it to
  `buildRss()` in `src/lib/rss.ts`.
- **Post bodies are bundled at build time.** `src/lib/postContent.ts` inlines
  every `posts/**/*.md` via
  `import.meta.glob(…, { query: "?raw", eager: true })`; `getPostContent()`
  extracts the body per request from that bundle. Workers has no filesystem —
  never reintroduce runtime file reads.
- **Post assets are static.** `pnpm build` runs `utils/copy_post_assets.ts`,
  which copies every non-`index.md` file under `posts/<id>/` into
  `dist/client/posts/<id>/`, served by the Workers asset layer at the same URLs
  (`/posts/<id>/<file>`). `index.md` is never published. A missing asset falls
  through to the Worker and renders the 404 page.
- **One dynamic page route:** `src/pages/posts/[id].astro` (post page + 404
  branch). The old `posts/[id]/[...path].ts` asset endpoint is gone (Workers has
  no filesystem).
- **No state layer, no DI.** Data is module-level constants from
  `posts.json`/`config.json`; request-scoped values come from `Astro.props`,
  `Astro.params`, `Astro.response`, `url`, `request`.

## Key Directories

| Path                    | Purpose                                                                                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/`            | Routes. `.astro` = page, `.ts` = endpoint (`export const GET: APIRoute`). File path maps to URL; `output: "server"` means no `getStaticPaths`.                                                                                                     |
| `src/components/`       | Presentational `.astro` components (`PostCard`, `PostArticle`, `Recent`, `Project`, `Role`, `ContactCard`, `NotFound`, `Footer`).                                                                                                                  |
| `src/layouts/App.astro` | Single HTML shell + all `<head>` meta.                                                                                                                                                                                                             |
| `src/lib/`              | Shared TypeScript-only modules: `meta.ts` (`MetaProps`), `rss.ts` (`buildRss`, `escapeXml`, `RssPost`), `postContent.ts` (build-time-bundled post markdown).                                                                                       |
| `src/styles/global.css` | Only stylesheet: Tailwind v4 entry (`@import "tailwindcss"`, `@theme` tokens, `.markdown`/`.highlight` rules). Imported only by the layout.                                                                                                        |
| `utils/`                | Content/domain logic: `posts.ts` (types, `posts`, `buildPosts`), `build_posts.ts` (`build:posts` generator), `copy_post_assets.ts` (post-asset copy step), `readEstimate.ts` + its test, `charts/` (ApexCharts SSR bridge + shared chart options). |
| `posts/`                | Markdown source of truth plus per-post assets.                                                                                                                                                                                                     |
| `public/`               | Static assets served verbatim at `/` (`images/**`, `favicon.ico`, `logo.svg`, `rss-logo.png`, `_headers`).                                                                                                                                         |
| `dist/`                 | Build output (gitignored): `dist/server/` (worker entry `entry.mjs`, chunks, **generated** `wrangler.json`), `dist/client/` (statics: `public/` copies, `_astro/*.css`, copied `posts/<id>/` assets).                                              |

## Development Commands

Run everything from the repo root via `pnpm` (requires **Node 26** — native
TypeScript execution for `utils/*.ts`; a Node 26 toolchain lives at
`~/.hermes/tools/node-26.12.1-darwin-arm64` on Kitson's Mac if the shell default
is older):

| Task               | Command                                         | Notes                                                                                                                                                                                                  |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`         | `astro dev`                                     | Dev server on **http://localhost:4321** (HMR). Binds `[::1]` only — `localhost` works, `127.0.0.1` does not. Daemonises when stdin is not a TTY; manage with `pnpm exec astro dev stop\|status\|logs`. |
| `pnpm build`       | `astro build && node utils/copy_post_assets.ts` | Writes `dist/` **and** copies post assets — `pnpm build` alone produces deployable output.                                                                                                             |
| `pnpm build:posts` | `node utils/build_posts.ts`                     | Regenerates `posts.json` from `posts/`. Not run by `dev`/`build`. See ICU trap below.                                                                                                                  |
| `pnpm start`       | `wrangler dev -c dist/server/wrangler.json`     | Serves the built site on **http://localhost:8787** through workerd (the real Workers runtime + `_headers` semantics). Needs a prior `pnpm build`; rebuild after changes.                               |
| `pnpm test`        | `vitest run`                                    | Vitest 4, co-located `*.test.ts`.                                                                                                                                                                      |

Dependencies: pnpm 12 (`pnpm-lock.yaml`, `pnpm-workspace.yaml` carries pnpm
policy: `allowBuilds` for esbuild/workerd, a scoped `minimumReleaseAgeExclude`
for just-published Cloudflare packages). JSR packages (`@std/front-matter`,
`@deno/gfm`) are consumed via `npx -y jsr add <pkg>` (npm-compat through the
`@jsr` scope in `.npmrc`) — never hand-edit `.npmrc` or add `jsr:` specifiers.
There is no formatter or linter wired (the Deno fmt/lint gates left with
`deno.json`; a Biome/`astro check` setup is a deferred follow-up) — match
surrounding style by hand.

## Code Conventions & Common Patterns

**Astro components**

- Frontmatter declares `interface Props { … }` then
  `const { … } = Astro.props;`. Defaults live in that destructuring
  (`Role.astro`: `end = "Present"`).
- Children are slots, not props: `<slot />` (`Project`, `Role`, `ContactCard`,
  `App`). New components take data as props (`{ post }`, `{ posts }`) rather
  than Markdown-through-children.
- Frontmatter is **straight-line code**: there is no early `return`, so
  everything derived from possibly-missing data must be guarded there
  (`src/pages/posts/[id].astro` falls back to `NOT_FOUND_META` / `""` and sets
  `Astro.response.status = 404`).
- Raw HTML only via `set:html` (`<div class="markdown" set:html={html}></div>`,
  `<Fragment set:html={icons[icon]} />`).
- Template expressions stay simple: flat ternaries
  `{cond ? (<>…</>) : (<>…</>)}` or `{cond ? … : null}`; `.map()` returning
  elements is fine. Hoist anything richer into frontmatter. Keep `{" "}` where
  it already exists.

**Imports and types**

- Relative paths inside `src/` (`../layouts/App.astro`, `./PostCard.astro`);
  `@/` for root crossings (`@/utils/posts.ts`, `@/config.json`); bare specifiers
  for dependencies (`astro`, `@deno/gfm`, `@std/front-matter`). Always include
  the `.ts`/`.astro` extension.
- Types shared with routes or tests live in `.ts`, never `.astro` (no
  type-checker reads `.astro`): `MetaProps`, `NOT_FOUND_META`, `RssPost`,
  `Post`, `FrontMatter`.
- JSON imports use the attribute form:
  `import postsJson from "../../posts.json" with { type: "json" }`.

**Naming**

- Components `PascalCase.astro`; routes `kebab-case` matching the URL
  (`resume-cv.astro`); endpoints `export const GET: APIRoute`; domain functions
  camelCase in `utils/`/`src/lib/`; tests `<module>.test.ts` co-located with the
  module.

**Error handling**

- Missing post → 404 status + `<NotFound />` (no throw). Unmatched URL →
  `src/pages/404.astro`.
- The GoatCounter `count.js` embed is async third-party code: if it fails to
  load or send (ad-blocked, offline), page delivery must be completely
  unaffected — never gate rendering on it.
- Never leak user text into the RSS XML — every node/attribute goes through
  `escapeXml`.

**Traps (do not "clean up")**

- `src/lib/postContent.ts` uses `import.meta.glob` (Vite compile-time). It must
  never be imported from anything that runs under plain Node
  (`utils/build_posts.ts`, `utils/copy_post_assets.ts`) — Node cannot execute
  it. The split is load-bearing: Node-run `utils/posts.ts` (generator) vs
  Vite-bundled `src/lib/postContent.ts` (runtime).
- `posts.json` is generated under **Node's ICU** (`Intl.Segmenter` word
  counting). Regenerating under a different runtime (Deno ICU4X, other Node
  builds) churns `readEstimate` values, because ICU splits URLs into words
  differently. Regenerate only with the pinned Node 26 toolchain; the committed
  file is Node-26-generated.
- Analytics (GoatCounter) is client-side by design: the standard `count.js`
  embed in `src/layouts/App.astro` natively sends `p` (path), `t` (title),
  `r` (`document.referrer`) and `s` (`window.screen.width`); GoatCounter derives
  language from the hit's `Accept-Language`. Never reintroduce a server-side
  count fetch alongside it and never call `goatcounter.count()` manually — both
  double-count.
- Env plumbing differs per runtime: Vite blanks `process.env` in `astro dev`
  (read `import.meta.env`), and wrangler exposes no shell env to the worker.
  There are no env seams in the app — don't add one just to configure analytics.
- `_headers`: the adapter **prepends** its own `/_astro/*` immutable rule at
  build time — never hand-write that rule in `public/_headers`. `/posts/*` is
  `max-age=0, must-revalidate` deliberately: `_headers` cannot match query
  strings, so the old `?__frsh_c=` immutable behaviour is retired (see the
  migration handoff); ETag/304 come natively from the Workers asset layer.
  `/charts/*` maps `Content-Type: image/svg+xml; charset=utf-8` because Astro
  writes prerendered endpoint snapshots as extensionless files
  (`dist/client/charts/<name>`), which the Workers asset layer would otherwise
  serve without a useful `Content-Type`.
- Chart endpoints (`src/pages/charts/*.ts`) render through
  `utils/charts/ssr.ts`, the only module allowed to import `apexcharts`
  (`apexcharts/ssr` → `renderToHTML`). That helper keeps just the `<svg>`
  element and discards the hydration wrapper and its base64 config, so charts
  stay client-JavaScript-free. Never import `apexcharts` from an endpoint.
  These endpoints carry `export const prerender = true` (build-time snapshots),
  which is adapter-specific history: on `@deno/astro-adapter` 0.6.0 prerendered
  endpoint snapshots were served via `serveFile` with no `Content-Type`,
  breaking `<img>` embeds, so prerender was deferred; on `@astrojs/cloudflare`
  the same snapshots are Workers assets, and the `/charts/*` `_headers` rule
  restores the MIME — `export const prerender = true` is the sanctioned pattern
  for these endpoints.
- Two ApexCharts quirks the chart module works around: `BODY_TYPEFACE` must stay
  **single**-quoted, because `fontFamily` is interpolated unescaped into
  double-quoted SVG attributes (double quotes yield `font-family=""Mali"…"` and
  an unparseable SVG); and SSR serialises only the `<svg>` — the legend is HTML,
  so `legend` options never appear in the output.
- `src/components/PostArticle.astro` keeps seven `prismjs/components/prism-*.js`
  side-effect imports (drop one and that language stops highlighting) and
  `render(content, { allowIframes: true })`.
- `App.astro` head order/defaults are intentional and mirrored from the previous
  site.
- `config.json` author lookup is unguarded in `PostArticle.astro` but guarded in
  `PostCard.astro` — a new `author` value must be added to `config.json`.
- Existing output quirks are deliberate parity (e.g. the stray `;` after
  `<strong>{title}</strong>` in `Role.astro`, `<html>` without `lang`,
  `.markdown` on both `<article>` and the inner `<div>`).
- No type-checker gate exists (`astro check` is not wired; `tsconfig.json` is
  for editor tooling). `pnpm build` is what surfaces template and frontmatter
  errors.
- Server processes fork: `pnpm start` (workerd) and `pnpm dev` (daemon) can
  outlive the parent shell. Kill the whole tree and confirm the port is free
  (`lsof -nP -iTCP:<port> -sTCP:LISTEN`) before re-verifying against a rebuilt
  `dist/`, otherwise you silently test a stale build.

## Important Files

| File                                      | Why it matters                                                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `package.json` / `pnpm-workspace.yaml`    | Scripts, dependencies, pnpm 12 policy config. JSR deps arrive via `npx jsr add` (`.npmrc` @jsr scope).                           |
| `astro.config.ts`                         | SSR output, `@astrojs/cloudflare` adapter (`imageService: "passthrough"`, `session: false`), Tailwind, `@/` alias.               |
| `wrangler.jsonc`                          | Source-level Wrangler config (name, compat date/flags). The **generated** `dist/server/wrangler.json` is what `pnpm start` uses. |
| `src/layouts/App.astro`                   | Document shell and every head tag, plus the GoatCounter `count.js` embed.                                                        |
| `src/lib/meta.ts`                         | `MetaProps` / `NOT_FOUND_META` — change here first when meta changes.                                                            |
| `src/lib/postContent.ts`                  | Bundled post markdown (`import.meta.glob ?raw`) + `getPostContent()`.                                                            |
| `src/pages/posts/[id].astro`              | Dynamic post page + 404 branch.                                                                                                  |
| `src/pages/rss-feed.ts`, `src/lib/rss.ts` | RSS endpoint and escaped XML builder (`<generator>Astro</generator>`).                                                           |
| `utils/posts.ts`                          | Post types, `posts: Post[]`, `buildPosts()` (build-time, node:fs).                                                               |
| `utils/build_posts.ts`                    | `build:posts` generator for the committed `posts.json` (ICU-sensitive — see traps).                                              |
| `utils/copy_post_assets.ts`               | Post-asset copy into `dist/client/posts/<id>/` (part of `pnpm build`).                                                           |
| `public/_headers`                         | `/posts/*` caching; `/charts/*` SVG MIME rules.                                                                                  |
| `utils/charts/ssr.ts`                     | ApexCharts SSR bridge (`renderToHTML` → bare `<svg>`); the only module that may import `apexcharts`.                             |
| `posts.json`                              | Generated, committed content index (86 entries, 2-space indent, newest first).                                                   |
| `config.json`                             | Author registry (`authors.kitsonk`).                                                                                             |

## Runtime/Tooling Preferences

- **Node 26 + pnpm 12 only.** No Deno, no alternative package managers
  (npm/yarn/bun) — dependencies go in `package.json` (npm) or via `npx jsr add`
  (JSR). `node_modules/` is managed by pnpm (gitignored).
- **Vite is configured only inside `astro.config.ts`** (`vite:` key); there is
  no `vite.config.ts`. Do not call `astro`/`vite` binaries directly — go through
  `pnpm` scripts.
- `.env` is optional. There are no env seams — the app reads no environment
  configuration (analytics ships as the static `count.js` embed).
- Deployment: Cloudflare Workers. Build with `pnpm build`; the adapter generates
  `dist/server/wrangler.json` (worker entry + `assets.directory: ../client`,
  `nodejs_compat`, asset fallback). Deploy is handled by a separate
  staging/cutover workstream — do not bind kitsonk.com from this repo's tooling.
- Editor: any TS-aware editor against `tsconfig.json` (`astro/tsconfigs/strict`,
  `types: ["node", "vite/client"]`, `allowImportingTsExtensions`).

## Testing & QA

- **Framework:** Vitest 4. Co-located `<module>.test.ts`,
  `test("<fn> - <case>", () => {})`, `expect(...)` from `vitest`. No mocking, no
  table-driven cases in the repo yet — follow the existing single-test style.
- **Run:** `pnpm test`. Two tests today: `utils/readEstimate.test.ts`,
  `utils/charts/ssr.test.ts`.
- **Coverage today:** those two unit tests. `utils/posts.ts`,
  `utils/build_posts.ts`, `utils/copy_post_assets.ts`, `src/lib/**`, every
  endpoint and all `.astro` rendering are untested by
  automation.
- **Expectation:** keep the existing tests passing and add co-located unit tests
  for new pure logic in `utils/`/`src/lib/`. Behaviour of routes, endpoints,
  RSS, caching headers and markup is verified by smoke runs, not unit tests.
- **Required gates before yielding:** `pnpm install`, `pnpm build:posts`
  (posts.json must not churn — see the ICU trap), `pnpm build`, `pnpm test`,
  `git diff --check`.
- **Manual QA:** `curl` each route and assert on **content** (titles, counts,
  headings), not just status codes. Dev (`pnpm dev`, :4321, `[::1]` only) and
  production-shaped (`pnpm start`, :8787, workerd) differ: `_headers` caching
  rules, asset serving and 304s only exist under `pnpm start`; `astro dev`
  serves `public/` without the asset layer. Always kill the full server tree and
  `lsof`-confirm the port before rebuilding, or you will test a stale build.
