# homepage

My homepage on the internet — [kitsonkelly.com](https://kitsonkelly.com). A server-rendered blog, CV and projects page
built with [Astro](https://astro.build/) 7 in SSR mode on Node 26 + pnpm, targeted at
[Cloudflare Workers](https://workers.cloudflare.com/) via `@astrojs/cloudflare`. Posts are Markdown, charts are
rendered server-side as SVG, and there is no client-side JavaScript.

## Requirements

- Node 26 (the toolchain relies on native TypeScript execution for `utils/*.ts`) and [pnpm](https://pnpm.io/) 12.
- No `.env` is needed for local work. `GOATCOUNTER_COUNT_URL` optionally redirects analytics counting to a local
  listener; it defaults to the production GoatCounter endpoint.

## Commands

| Command            | What it does                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `pnpm dev`         | Development server with hot reload on <http://localhost:4321> (binds `[::1]` only; stop with `pnpm exec astro dev stop`) |
| `pnpm build`       | Production build into `dist/` (worker + statics), including the post-asset copy step           |
| `pnpm start`       | Serve the build on <http://localhost:8787> via `wrangler dev` (requires a prior `pnpm build`) |
| `pnpm build:posts` | Regenerate `posts.json` from `posts/` after adding or editing content                          |
| `pnpm test`        | Unit tests (Vitest)                                                                           |

## Writing a post

A post is either a single Markdown file (`posts/my-post.md`) or a directory with an `index.md`
(`posts/my-post/index.md`) when it needs its own assets. The URL is always `/posts/<id>`, where `<id>` is the file or
directory name.

```md
---
title: "HTTP Speed"
description: >
  Checking out how fast different runtimes are with the oak framework.
date: 2024-03-11T12:00:00+10:00
hero: /posts/http-speed/hero.webp
summary: >
  Since I was writing recently about getting oak to work under Deno, Deno Deploy, Node.js, Bun
  and Cloudflare Workers, I started to wonder if there would be performance differences.
tags:
  - deno
  - deno deploy
author: kitsonk
---

Post body in Markdown. A directory post's assets are referenced by absolute path, for example
`![Hero](/posts/http-speed/hero.webp)`.
```

- `title`, `date` and `author` are required; `author` must be a key in `config.json` (currently only `kitsonk`).
- `summary` is what cards and the RSS feed show; it falls back to `description`.
- `hero` is a site-absolute URL to an image next to `index.md`; assets in a post directory are copied into the static
  build and served from `/posts/<id>/<file>` (`index.md` itself is never published).
- `tags` is optional (defaults to an empty list) and becomes the RSS `<category>` entries.

`posts.json` — the index every page, listing and the RSS feed reads — is generated and committed. After changing
anything in `posts/`, run:

```sh
pnpm build:posts
```

## Project structure

```
src/pages/        routes: .astro pages and .ts endpoints (charts, RSS)
src/components/   presentational components (PostCard, PostArticle, Project, Role, …)
src/layouts/      App.astro — the HTML shell and all <head> metadata
src/lib/          shared types and helpers (meta, RSS builder, bundled post content)
src/styles/       global.css — the Tailwind entry point
posts/            Markdown source of truth, plus per-post assets
public/           static assets served at / (images, favicon, RSS logo, _headers)
utils/            post pipeline: reading, building posts.json, post-asset copy, read-time estimate
astro.config.ts   Astro/Cloudflare adapter and Vite configuration
```

`AGENTS.md` documents the conventions, patterns and traps in more depth (aimed at AI assistants).

## Deployment

Cloudflare Workers: build with `pnpm build`; the adapter emits `dist/server/wrangler.json` (worker entry plus the
static assets in `dist/client`, including post assets and the `_headers` caching rules). Analytics counting is
server-side (GoatCounter, fire-and-forget from middleware) and needs no configuration.

## Notes

- The chart SVGs (`/charts/rps-local`, `/charts/latency-edge`, …) and the RSS feed (`/rss-feed`) are rendered on demand
  from the data and content committed in the repository.
- Post assets are served by the Workers asset layer with `Cache-Control: public, max-age=0, must-revalidate` and
  platform-native `ETag`/`304` handling (`public/_headers`). The old `?__frsh_c=` immutable-caching variant is gone —
  header rules cannot match query strings.
