# Repository Guidelines

Personal homepage of Kitson P. Kelly (kitsonkelly.com): a server-rendered blog/CV site built with **Astro 7 SSR on
Deno**, deployed to Deno Deploy. Strictly Markdown + front-matter. There is **no client-side JavaScript** — no islands,
no hydration, no signals — so every interactive concern is a plain hyperlink or form.

## Project Overview

- 8 HTML pages, 6 chart-SVG endpoints, an RSS feed, a post-asset endpoint, plus GA4 server-side pageview reporting in
  middleware.
- Content is committed Markdown under `posts/`, pre-processed into a committed `posts.json` index.
- Rendering is per-request (SSR). Nothing is prerendered; nothing is cached in memory.
- `README.md` is stale (Fresh-era, documents only `deno task dev`). Treat this file as the source of truth for tooling
  and conventions.

## Architecture & Data Flow

```
request → src/middleware.ts (GA4, fire-and-forget) → src/layouts/App.astro → src/pages/*.astro
                                                     ↑ `<App meta={meta}>…</App>` wraps every page
endpoints: src/pages/**/*.ts export `const GET: APIRoute` and return a Response (no layout)
```

- **Layout owns the document.** `src/layouts/App.astro` is the only `<html>`/`<head>` producer; it imports
  `src/styles/global.css` and emits `<slot />` inside `<body>`. Head-tag order is deliberate (see Patterns). No other
  file emits head tags.
- **Meta contract.** Pages build `const meta: MetaProps = { … }` (`src/lib/meta.ts`) and pass it down. `NOT_FOUND_META`
  is the shared 404 meta.
- **Content pipeline.** `posts/<id>.md` or `posts/<id>/index.md` (+ sibling assets) → `deno task build:posts` →
  committed `posts.json` → imported at module load by `@/utils/posts.ts` (exported as `posts: Post[]`) →
  pages/components. `src/pages/rss-feed.ts` imports `posts.json` directly and passes it to `buildRss()` in
  `src/lib/rss.ts`.
- **Per-request file reads.** Post bodies come from disk on each request (`getPostContent(post)` in `utils/posts.ts`,
  used by `src/pages/posts/[id].astro`). Post assets (images beside `index.md`) are served by
  `src/pages/posts/[id]/[...path].ts` — never copied by the build.
- **Paths are cwd-relative** (`./posts/…`, `Deno.cwd()`), so the server must run from the repo root with `posts/`
  present.
- **Two dynamic routes coexist and are not interchangeable:** `src/pages/posts/[id].astro` (the page) and
  `src/pages/posts/[id]/[...path].ts` (the asset endpoint). The latter is zero-or-more, so it guards
  `if (!params.path) return new Response(null, { status: 404 })`.
- **No state layer, no DI.** Data is module-level constants from `posts.json`/`config.json`; request-scoped values come
  from `Astro.props`, `Astro.params`, `Astro.response`, `url`, `request`.

## Key Directories

| Path                    | Purpose                                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/`            | Routes. `.astro` = page, `.ts` = endpoint (`export const GET: APIRoute`). File path maps to URL; `output: "server"` means no `getStaticPaths`.                                     |
| `src/components/`       | Presentational `.astro` components (`PostCard`, `PostArticle`, `Recent`, `Project`, `Role`, `ContactCard`, `NotFound`, `Footer`).                                                  |
| `src/layouts/App.astro` | Single HTML shell + all `<head>` meta.                                                                                                                                             |
| `src/lib/`              | Shared TypeScript-only modules: `meta.ts` (`MetaProps`), `rss.ts` (`buildRss`, `escapeXml`, `RssPost`), plus CJS `createRequire` shims (`prismjs.ts`, `sanitizeHtml.ts`, `he.ts`). |
| `src/styles/global.css` | Only stylesheet: Tailwind v4 entry (`@import "tailwindcss"`, `@theme` tokens, `.markdown`/`.highlight` rules). Imported only by the layout.                                        |
| `utils/`                | Content/domain logic: `posts.ts` (types, `posts`, `buildPosts`, `getPostContent`), `build_posts.ts` (`build:posts` task), `readEstimate.ts` + its test.                            |
| `posts/`                | Markdown source of truth plus per-post assets.                                                                                                                                     |
| `public/`               | Static assets served verbatim at `/` (`images/**`, `favicon.ico`, `logo.svg`, `rss-logo.png`).                                                                                     |
| `dist/`                 | Build output (gitignored): `dist/server/entry.mjs` (Deno Deploy entry), `dist/server/chunks/**`, `dist/client/_astro/*.css` + copied `public/`.                                    |
| `.vscode/`              | Deno extension config, default formatter, Tailwind CSS custom data.                                                                                                                |

## Development Commands

Run everything from the repo root via `deno task` (the `astro` CLI is only reachable inside these):

| Task                    | Command                                           | Notes                                                                                                                                |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `deno task dev`         | `deno run -A --env-file npm:astro dev`            | Dev server on **http://localhost:4321** (HMR; `--env-file` only warns when `.env` is absent).                                        |
| `deno task build`       | `deno run -A --env-file npm:astro build`          | Writes `dist/`.                                                                                                                      |
| `deno task start`       | `deno run -A ./dist/server/entry.mjs`             | Production server on **http://localhost:8000**; port is baked in at build time (`adapter: deno({ port: 8000 })`), `PORT` is ignored. |
| `deno task build:posts` | `deno run -A utils/build_posts.ts`                | Regenerates `posts.json` from `posts/`. Not run by `dev`/`build`.                                                                    |
| `deno task check`       | `deno fmt --check . && deno lint . && deno check` | Required before yielding.                                                                                                            |

Notes: `deno task dev` detaches into a background daemon when stdin is not a TTY (it prints a pid; manage it with
`deno run -A npm:astro dev stop|status|logs`). Both `dev` and `build` warn — but do not fail — when `.env` is absent.
`.astro` handling in `deno fmt` needs the top-level `unstable: ["fmt-component"]`, so always format through `deno fmt`
rather than an editor default.

Other commands:

```sh
TZ=UTC deno test     # the whole suite (there is no `test` task)
deno fmt             # apply formatting (120 cols, .astro via unstable fmt-component)
```

## Code Conventions & Common Patterns

**Astro components**

- Frontmatter declares `interface Props { … }` then `const { … } = Astro.props;`. Defaults live in that destructuring
  (`Role.astro`: `end = "Present"`).
- Children are slots, not props: `<slot />` (`Project`, `Role`, `ContactCard`, `App`). New components take data as props
  (`{ post }`, `{ posts }`) rather than Markdown-through-children.
- Frontmatter is **straight-line code**: there is no early `return`, so everything derived from possibly-missing data
  must be guarded there (`src/pages/posts/[id].astro` falls back to `NOT_FOUND_META` / `""` and sets
  `Astro.response.status = 404`).
- Raw HTML only via `set:html` (`<div class="markdown" set:html={html}></div>`, `<Fragment set:html={icons[icon]} />`).
- Template expressions stay simple: flat ternaries `{cond ? (<>…</>) : (<>…</>)}` or `{cond ? … : null}`; `.map()`
  returning elements is fine. Hoist anything richer into frontmatter. Keep `{" "}` where it already exists.

**Imports and types**

- Relative paths inside `src/` (`../layouts/App.astro`, `./PostCard.astro`); `@/` for root crossings
  (`@/utils/posts.ts`, `@/config.json`); bare specifiers for dependencies (`astro`, `@deno/gfm`, `@std/path`). Always
  include the `.ts`/`.astro` extension.
- Types shared with routes or tests live in `.ts`, never `.astro` (`deno check` cannot read `.astro`): `MetaProps`,
  `NOT_FOUND_META`, `RssPost`, `Post`, `FrontMatter`.
- JSON imports use the attribute form: `import postsJson from "../../posts.json" with { type: "json" }`.

**Naming**

- Components `PascalCase.astro`; routes `kebab-case` matching the URL (`resume-cv.astro`); endpoints
  `export const GET: APIRoute`; domain functions camelCase in `utils/`/`src/lib/`; tests `<module>.test.ts` co-located
  with the module.

**Error handling**

- Missing post → 404 status + `<NotFound />` (no throw). Unmatched URL → `src/pages/404.astro`.
- The asset endpoint wraps its whole body in `try { … } catch { return new Response(null, { status: 404 }) }`.
- Middleware is fire-and-forget (`queueMicrotask`) so reporting failures never affect the response.
- Never leak user text into the RSS XML — every node/attribute goes through `escapeXml`.

**Traps (do not "clean up")**

- `astro.config.ts` is load-bearing: the `denoVitePlugins()` wrapper around `@deno/vite-plugin` (skips Astro
  `virtual:`/`astro:` ids and non-existent paths), the build-only `deno-bundle-dependencies` plugin
  (`resolve.noExternal: true` only when `command === "build"`; bare externals are unresolvable at runtime because there
  is no `package.json`), and the `sanitize-html`/`prismjs`/`he` aliases to the shims in `src/lib/`. Removing any of
  these breaks dev SSR or the production build.
- `@deno/fresh_charts` must stay remapped to `render.ts`/`utils.ts`; the package root pulls in a Preact `Chart.tsx`.
- `src/components/PostArticle.astro` keeps seven `prismjs/components/prism-*.js` side-effect imports (drop one and that
  language stops highlighting) and `render(content, { allowIframes: true })`.
- `App.astro` head order/defaults are intentional and mirrored from the previous site.
- `config.json` author lookup is unguarded in `PostArticle.astro` but guarded in `PostCard.astro` — a new `author` value
  must be added to `config.json`.
- Existing output quirks are deliberate parity (e.g. the stray `;` after `<strong>{title}</strong>` in `Role.astro`,
  `<html>` without `lang`, `.markdown` on both `<article>` and the inner `<div>`).
- `deno check` does **not** type-check `.astro` files; only `deno task build` surfaces template and frontmatter errors.

## Important Files

| File                                      | Why it matters                                                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `deno.json`                               | Single source of dependencies (`imports`), tasks, lint/fmt/`unstable`/`exclude`/`compilerOptions`. |
| `astro.config.ts`                         | SSR output, Deno adapter, Tailwind, Vite resolution workarounds, `@/` alias.                       |
| `src/middleware.ts`                       | GA4 reporting; keeps one connection object per remote address so sessions stay continuous.         |
| `src/layouts/App.astro`                   | Document shell and every head tag.                                                                 |
| `src/lib/meta.ts`                         | `MetaProps` / `NOT_FOUND_META` — change here first when meta changes.                              |
| `src/pages/posts/[id].astro`              | Dynamic post page + 404 branch.                                                                    |
| `src/pages/posts/[id]/[...path].ts`       | Asset endpoint: SHA-1 `etag`, `304`, `?__frsh_c=…` → immutable caching.                            |
| `src/pages/rss-feed.ts`, `src/lib/rss.ts` | RSS endpoint and escaped XML builder (`<generator>Astro</generator>`).                             |
| `utils/posts.ts`                          | Post types, `posts: Post[]`, `buildPosts()`, `getPostContent()`.                                   |
| `utils/build_posts.ts`                    | `build:posts` generator for the committed `posts.json`.                                            |
| `posts.json`                              | Generated, committed content index (86 entries, 2-space indent, newest first).                     |
| `config.json`                             | Author registry (`authors.kitsonk`).                                                               |

## Runtime/Tooling Preferences

- **Deno only.** No `package.json`, no npm/yarn/pnpm, no `node_modules` management by hand — add dependencies to
  `deno.json` `imports` (`npm:`/`jsr:`/`https:` specifiers; JSR and the `fresh_charts` URL are version-pinned).
  `nodeModulesDir: "auto"` lets Deno materialise `node_modules/` (gitignored).
- Runtime: Deno 2.9+ is required (not pinned in the repo — no CI, no `engines`).
- **Vite is configured only inside `astro.config.ts`** (`vite:` key); there is no `vite.config.ts`. Do not call
  `astro`/`vite` binaries directly — go through `deno task`.
- Build vs dev resolve differently on purpose: the build bundles dependencies, dev leaves them external. A fix verified
  in one mode is not proven in the other — check both.
- `.env` is optional; `--env-file` only warns. `GA4_MEASUREMENT_ID` unset → GA4 short-circuits and logs "reporting
  disabled"; set it to exercise the reporting path.
- Deployment: Deno Deploy, build `deno task build`, entry `dist/server/entry.mjs`. The adapter's `start: true` server
  serves `dist/client` statics and renders the 404 page.
- Editor: Deno extension (`denoland.vscode-deno`) is the default formatter; the Tailwind CSS extension reads
  `.vscode/tailwind.json`.

## Testing & QA

- **Framework:** Deno's built-in runner. No third-party framework, no `test` task, no `deno.json` `test` block, tests
  need no `--allow-*` flags.
- **Run:** `TZ=UTC deno test`. The `TZ=UTC` convention keeps date-sensitive code (`new Date(...)` rehydration,
  `Intl.DateTimeFormat` without an explicit `timeZone`) deterministic; the current test does not itself depend on it.
- **Existing convention:** co-located `<module>.test.ts`, `Deno.test({ name: "<fn> - <case>", fn() {} })`, assertions
  from the `@std/assert/equals` subpath (`assertEquals`). No fake timers, no mocking, no table-driven or `t.step` cases
  in the repo yet — follow the existing single-test style.
- **Coverage today:** one unit test, `utils/readEstimate.test.ts`. `utils/posts.ts`, `utils/build_posts.ts`,
  `src/lib/**`, every endpoint, the middleware and all `.astro` rendering are untested by automation.
- **Expectation:** keep the existing test passing and add co-located unit tests for new pure logic in
  `utils/`/`src/lib/`. Do not introduce a test framework. Behaviour of routes, endpoints, RSS, ETag handling and markup
  is verified by smoke runs, not unit tests.
- **Required gates before yielding:** `deno task check`, `TZ=UTC deno test`, `deno task build`, `git diff --check`.
- **Manual QA:** `curl` each route on dev (:4321) and production (:8000) and assert on **content** (titles, counts,
  headings), not just status codes. Known dev/prod differences: dev inlines the Tailwind CSS in the HTML and Vite's
  static middleware serves `/posts/**` from the repo root (so the asset endpoint's ETag/304 branch is only exercised in
  production).
