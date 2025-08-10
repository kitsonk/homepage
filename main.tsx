import { App, Context, HttpError, staticFiles } from "fresh";
import { BUILD_ID } from "@fresh/build-id";
import { GA4Report, isDocument } from "@kitsonk/ga4";
import { typeByExtension } from "@std/media-types";
import { extname, resolve } from "@std/path";

import { NotFound } from "./components/NotFound.tsx";
import type { State } from "./utils.ts";

const ASSET_CACHE_BUST_KEY = "__frsh_c";
const encoder = new TextEncoder();

export const app = new App<State>();

app
  .use(staticFiles())
  .use(async (ctx) => {
    const request = ctx.req;
    const response = await ctx.next();
    queueMicrotask(async () => {
      if (!isDocument(request, response)) {
        return;
      }
      // deno-lint-ignore no-explicit-any
      const report = new GA4Report({ request, response, conn: ctx.info as any });
      await report.send();
    });
    return response;
  })
  .appWrapper(({ Component, state }) => {
    const {
      alt,
      canonical,
      creator = "@kitsonk",
      description,
      image,
      keywords = ["homepage", "kitson kelly"],
      title,
      type = "website",
    } = state;
    const imageUrl = image && new URL(image, "https://kitsonkelly.com/").toString();
    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:domain" content="kitsonkelly.com" />
          <meta name="twitter:site" content="@kitsonk" />

          <title>{title}</title>
          <meta name="twitter:title" content={title} />
          <meta property="og:title" content={title} />

          {description && (
            <>
              <meta property="og:description" content={description} />
              <meta name="twitter:description" content={description} />
              <meta name="description" content={description} />
            </>
          )}

          {creator && <meta name="twitter:creator" content={creator} />}

          {imageUrl
            ? (
              <>
                <meta name="twitter:image" content={imageUrl} />
                <meta property="og:image" content={imageUrl} />
                {alt && (
                  <>
                    <meta name="twitter:image:alt" content={alt} />
                    <meta property="og:image:alt" content={alt} />
                  </>
                )}
              </>
            )
            : (
              <>
                <meta name="twitter:image" content="/images/hero.png" />
                <meta property="og:image" content="/images/hero.png" />
                <meta name="twitter:image:alt" content="7 foot tall cactus logo" />
                <meta property="og:image:alt" content="7 foot tall cactus logo" />
              </>
            )}

          <meta property="og:type" content={type} />
          <meta property="og:site_name" content="7 foot tall cactus" />
          <meta property="og:locale" content="en_AU" />

          <meta name="keywords" content={keywords.join(", ")} />

          {canonical && <link rel="canonical" href={`https://kitsonkelly.com${canonical}`} />}

          <link rel="stylesheet" href="/styles.css" />
        </head>
        <body class="font-body bg-white text-black dark:bg-black dark:text-white">
          <Component />
        </body>
      </html>
    );
  })
  .notFound((ctx) => {
    ctx.state.title = "Not Found | 7 foot tall cactus";
    ctx.state.description = "The requested page could not be found.";
    ctx.state.keywords = ["not found"];
    return ctx.render(<NotFound />);
  })
  .get("/posts/:id/:path+", async (ctx: Context<State>) => {
    try {
      const url = new URL(ctx.url);
      const key = url.searchParams.get(ASSET_CACHE_BUST_KEY);
      if (key !== null && BUILD_ID !== key) {
        url.searchParams.delete(ASSET_CACHE_BUST_KEY);
        const location = `${url.pathname}${url.search}`;
        return new Response("", {
          status: 307,
          headers: {
            "content-type": "text/plain",
            location,
          },
        });
      }
      const path = resolve(Deno.cwd(), `./posts/${ctx.params.id}/${ctx.params.path}`);
      const stat = await Deno.stat(path);
      const contentType = typeByExtension(extname(path)) ??
        "application/octet-stream";
      const hash = await crypto.subtle.digest(
        "SHA-1",
        encoder.encode(BUILD_ID + path),
      );
      const etag = Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      const headers = new Headers({
        "content-type": contentType,
        etag,
        vary: "If-None-Match",
      });
      if (key !== null) {
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
      }
      const ifNoneMatch = ctx.req.headers.get("if-none-match");
      if (ifNoneMatch === etag || ifNoneMatch === "W/" + etag) {
        return new Response(null, { status: 304, headers });
      } else {
        const file = await Deno.open(path);
        headers.set("content-length", String(stat.size));
        return new Response(file.readable, { headers });
      }
    } catch {
      //
    }
    throw new HttpError(404);
  })
  .fsRoutes();
