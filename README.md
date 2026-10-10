# homepage

My homepage on the internet — [kitsonkelly.com](https://kitsonkelly.com). A server-rendered blog, CV and projects page
built with [Astro](https://astro.build/) 7 in SSR mode on [Deno](https://deno.com/), deployed to Deno Deploy. Posts are
Markdown, charts are rendered server-side as SVG, and there is no client-side JavaScript.

## Requirements

- [Deno](https://deno.com/) 2.9 or later. That is the whole toolchain — there is no `package.json`, so no npm/yarn/pnpm
  step; dependencies are declared in `deno.json` and fetched by Deno on first run.
- No `.env` is needed for local work. Set `GA4_MEASUREMENT_ID` to exercise the analytics path.

## Commands

| Command                 | What it does                                                                    |
| ----------------------- | ------------------------------------------------------------------------------- |
| `deno task dev`         | Development server with hot reload on <http://localhost:4321>                   |
| `deno task build`       | Production build into `dist/`                                                   |
| `deno task start`       | Serve the build on <http://localhost:8000> (the port is baked in at build time) |
| `deno task build:posts` | Regenerate `posts.json` from `posts/` after adding or editing content           |
| `deno task check`       | Formatting check, lint and type check — run this before committing              |
| `TZ=UTC deno test`      | Unit tests (no `test` task exists)                                              |

`deno fmt` applies formatting, including `.astro` files.

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
- `hero` is a site-absolute URL to an image next to `index.md`; assets in a post directory are served from
  `/posts/<id>/<file>` at request time and are never copied by the build.
- `tags` is optional (defaults to an empty list) and becomes the RSS `<category>` entries.

`posts.json` — the index every page, listing and the RSS feed reads — is generated and committed. After changing
anything in `posts/`, run:

```sh
deno task build:posts
```

## Project structure

```
src/pages/        routes: .astro pages and .ts endpoints (charts, RSS, post assets)
src/components/   presentational components (PostCard, PostArticle, Project, Role, …)
src/layouts/      App.astro — the HTML shell and all <head> metadata
src/lib/          shared types and helpers (meta, RSS builder, CommonJS interop shims)
src/styles/       global.css — the Tailwind entry point
posts/            Markdown source of truth, plus per-post assets
public/           static assets served at / (images, favicon, RSS logo)
utils/            post pipeline: reading, building posts.json, read-time estimate
astro.config.ts   Astro/Deno adapter and Vite configuration
```

`AGENTS.md` documents the conventions, patterns and traps in more depth (aimed at AI assistants).

## Deployment

Deno Deploy, with Astro framework detection: build command `deno task build`, entrypoint `dist/server/entry.mjs`. The
server serves `dist/client` for static files and renders the 404 page for unmatched paths. Analytics reporting is
server-side and does nothing unless `GA4_MEASUREMENT_ID` is set in the environment.

## Notes

- The chart SVGs (`/charts/rps-local`, `/charts/latency-edge`, …) and the RSS feed (`/rss-feed`) are rendered on demand
  from the data and content committed in the repository.
- Post assets respond with a SHA-1 `ETag`, honour `If-None-Match` with `304`, and switch to immutable caching when a
  `?__frsh_c=` cache-busting parameter is present.
