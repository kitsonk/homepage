---
title: "Fresh 2 and Deno Deploy Early Access"
description: My journey in taking my homepage and migrating to Fresh 2 and Deploy Early Access.
date: 2025-08-12T12:00:00+10:00
hero: /posts/fresh-2-deploy-ea/hero.jpg
summary: >
  Both Fresh 2 and Deploy Early Access are being heavily worked on, but I wanted to take both for a "test drive" to see
  what the current state of play was for both of these, in particular what it takes to move from Fresh 1 and the
  original Deno Deploy, which has been a host to this blog for a long time.
tags:
  - deno
  - deno deploy
  - fresh
  - fresh 2
author: kitsonk
---

Both [Fresh 2](https://jsr.io/@fresh/core@2.0.0-alpha.57) and
[Deploy Early Access](https://docs.deno.com/deploy/early-access/) are being heavily worked on, but I wanted to take both
for a "test drive" to see what the current state of play was for both of these, in particular what it takes to move from
Fresh 1 and the original Deno Deploy, which has been a host to this blog for a long time.

![A 2-D cartoon child sauropod investigating a large glowing lemon on the ground](/posts/fresh-2-deploy-ea/hero.jpg)

# Fresh 2

While the Deno team have been using Fresh 2 internally for an extended period of time, they didn't really make any noise
about it until [May 2025](https://deno.com/blog/an-update-on-fresh) and then since then there have been about 28
incremental releases since then until the time of this post (early August 2025).

The biggest notable change is the shift to a fluent "middleware" centric application (like `express` or `koa`) while
still supporting file based routing:

```ts
import { App, staticFiles } from "fresh";
import type { State } from "./utils.ts";

export const app = new App<State>();

app
  .use(async (ctx) => {
    // middleware
  })
  // provides ability to serve files from `/static`
  .use(staticFiles())
  .appWrapper((ctx) => {
    // can replace `/routes/_app.tsx`
  })
  .notFound((ctx) => {
    // can replace `/routes/_404.tsx`
  })
  .get("/some/:path+", (ctx) => {
    // alternative to file based routing and handlers
  })
  // enable Fresh 1-like file based routes
  .fsRoutes();
```

To fully support file-system routing, it is recommended that you create a `define()` helper:

```ts
// `/utils.ts`
import { createDefine } from "fresh";

export interface State {
  // your application state
}

export const define = createDefine<State>();
```

Which you then use to define some features in a file-system based route:

```ts
// `/routes/[id].ts`
import { page } from "fresh";

import { define } from "../utils.ts";

export const handler = define.handlers(({ state, params }) => {
  // getting content and updating state ahead of rendering
  return page();
});

export default define.page(async function Page(ctx) {
  // async page rendering
});
```

Having worked with Fresh 1 for an extended period of time, the shift in Fresh 2 is rather stark and in a lot of ways
leads to confusion on what is the "right way", while you _can_ forego file based routing, it was one of the best ways to
make an extensible and maintainable application. Even though I created [oak](https://oakserver.org/) based on
`express`/`koa` like solutions, they can be a challenge when they get complex with multiple "layers". When you combine
file based routing with a middleware router, it can get confusing quite quickly. While I appreciate the flexibility, I
wonder about the long term maintainability of essentially having your cake and eating it too.

## Upgrading

While there is a tool to assist in migrating ([@fresh/update](https://jsr.io/@fresh/update@2.0.0-alpha.57)), I found it
created more problems than it solved and tries to shim a few things that you are much better off just addressing. In the
end, I just created a new project and ported stuff in route by route.

The biggest things that I needed to address, all of which fell outside of the capabilities of the update tool:

- Migrating from Tailwind v3 to v4
- Dealing with removal of `<Head>` component, which also restructured the app wrapper
- Restructuring error handling and other specialized capabilities

> [!NOTE]
> In the beta version of Fresh 2, the `<Head>` component was restored

### Migrating from Tailwind v3 to v4

There aren't any real unique aspects of upgrading from Tailwind v3 to v4 that aren't broadly covered in the
[official upgrade guide](https://tailwindcss.com/docs/upgrade-guide). The most recent versions of the Fresh 2 beta
incorporate the official plugin ([`@fresh/plugin-tailwind`](https://jsr.io/@fresh/plugin-tailwind)) which is
incorporated in the `/dev.ts`:

```ts
#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { tailwind } from "@fresh/plugin-tailwind";
import { Builder } from "fresh/dev";

const builder = new Builder();
tailwind(builder);
if (Deno.args.includes("build")) {
  await builder.build();
} else {
  await builder.listen(() => import("./main.ts"));
}
```

The main changes is that the `tailwind.config.ts` goes away, with all of your theme configuration being directly
incorporated in the `/static/styles.css` using the `@theme` keyword, which gets compiled and optimised as part of the
build process.

The base of the `/static/styles.css` also has to change up a bit:

```diff
- @tailwind base;
- @tailwind components;
- @tailwind utilities;
+ @import "tailwindcss";
```

### Dealing with `<Head>` removal

> [!NOTE]
> In the beta release of Fresh 2, the `<Head>` component was restored and I reverted back to it, as it is really a much
> cleaner abstraction than having to deal with what is described below.

This by far was the most disruptive change for me. I had specifically invested in creating a component to ensure that
the meta information for my blog effectively supported social media unfurling. The argument put forward by the team is
that supporting `<Head>` made page rendering, especially asynchronous, a challenge.

The in progress documentation covers off
[how to modify the `<head>`](https://fresh.deno.dev/docs/canary/examples/modifying-the-head) under Fresh 2, but it is a
pretty major architectural shift that has required a pretty significant reworking of every page of which the update tool
didn't even attempt. In Fresh 1, I could encapsulate all that logic into a nice little re-usable component that I could
incorporate in a page just as JSX like a lot of other page rendering, now, even for the most "trivial" of pages, if I
want to alter the meta information in the header, I have to define a full blown handler.

For example with Fresh 1, my `/about.tsx`, a "static" page, was pretty straight forward:

```tsx
import { Footer } from "../components/Footer.tsx";
import { Meta } from "../components/Meta.tsx";

export default function About() {
  return (
    <>
      <Meta
        title="About | 7 foot tall cactus"
        canonical="/about"
        description="Hi, I'm Kit. I am a husband. I am a father. I am a technologist. I have lots of opinions. I work on M&A due diligence."
      />
      <section class="bg-white dark:bg-gray-900">
        {/* content */}
      </section>
      <Footer />
    </>
  );
}
```

Now it is a bit more complicated:

```tsx
import { page } from "fresh";

import { Footer } from "../components/Footer.tsx";
import { define } from "../utils.ts";

export const handler = define.handlers(({ state }) => {
  state.title = "About | 7 foot tall cactus";
  state.canonical = "/about";
  state.description =
    "Hi, I'm Kit. I am a husband. I am a father. I am a technologist. I have lots of opinions. I work on M&A due diligence.";
  return page();
});

export default define.page(function About() {
  return (
    <>
      <section class="bg-white dark:bg-gray-900">
        {/* content */}
      </section>
      <Footer />
    </>
  );
});
```

In the end, it is just mostly me being grumpy. If I had lived with the second pattern originally, I would have just
accepted it, but because I basically had to do some major refactoring on every page of which there was no direct upgrade
path, is more of the frustration/annoyance.

### Restructuring other stuff

One of the major improvements, in my opinion, of Fresh 2, is error handling. I think getting rid of the
`renderNotFound()` makes a lot of sense and instead you basically throw and error, like:

```ts
import { HttpError, page } from "fresh";

import { define } from "../utils.ts";

export const handler = define.handlers((ctx) => {
  // check to see whatever conditions
  if (!cond) {
    throw new HttpError(404);
  }
  return page();
});

export default define.page(function Page() {
  // return page contents
});
```

And then you can provide a discreet `notFound()` error handler in your application setup:

```tsx
import { App, staticFiles } from "fresh";
import { NotFound } from "./components/NotFound.tsx";
import type { State } from "./utils.ts";

export const app = new App<State>();

app
  .notFound((ctx) => ctx.render(<NotFound />))
  .fsRoutes();
```

### Conclusions

Fresh 2, at this stages, feels like more of a maintenance release where the underpinnings have been invested in, some of
which mandate pretty material shifts to migrate from Fresh 1 to Fresh 2 without any major new features or capabilities.
That being said, while I didn't actually run any speed tests, everything felt a bit snappier.

In the long term, all this reworking of the infrastructure might enable some future capabilities, but Fresh 1 already
had a pretty full set of capabilities.

# Deploy Early Access

I signed up for Deno Deploy Early Access a while ago, but I hadn't had the time to really explore it. I already had this
website deployed to classic Deno Deploy for an extended period of time, but refactoring it for Fresh 2 well a compelling
situation to see how it works.

## Deploying to deploy

This was very frictionless and straight forward. Clicking the `+ New App` button, selecting the GitHub repo, choosing a
couple options with sensible defaults and then watching the magic happen.

The big difference is that there was some hoops to jump through in order to get deployments that require a build step
using `deployctl` in a GitHub action. Now the Deploy platform plasters over all those cracks, meaning that by default,
every commit pushed to the repo gets build and deployed without any GitHub actions.

## Production ready

One big thing I noticed everywhere is the focus on being "production" ready, with appropriate telemetry information
available everywhere. For example, how this application looks on the main org page:

![The 7ft app in the Deploy control panel](/images/deploy_ea_app.png)

And as you drill in deeper you find a pretty rich set of telemetry, including logs, traces and metrics, just built in.
In addition there is the ability to dispatch the open telemetry information to another endpoint.

## Custom domains

I had my custom domains pointed at my classic Deno Deploy projects which I needed to migrate over. The biggest
difference here is that all of your custom domains can be centrally managed at the organization level and then pointed
at different apps. The process of setting up the domains was as straight forward as it could be, with a lot of "magic"
when I properly updated my DNS records. The only improvement could be in that migration path. I updated the ownership
checks but initially forgot to update the `A` records, and strangely needed to delete my `AAAA` records which don't seem
to be supported on EA at the moment. If EA had detected that I was migrating classic controlled domains, it all might
have been a bit cleaner of a process.

## Conclusions

Overall, Deno Deploy EA feels like a much more mature offering than the classic Deploy platform ever got to. It feels
like they really have focused on real-world use of the platform. I haven't yet taken some of the other features for a
spin yet, like the connectivity to databases, but I suspect that will have the same well polished feel.

The integrated CDN/caching feels really powerful and I know that using Fresh 2 means a lot of my static assets are going
to be effectively cached with zero mental overhead and configuration on my side. Currently though any view of that
working appears to be missing from the _Metrics_ section of the console.

I am still morning the loss of Deno KV, it being announced that it will
[never leave beta](https://deno.com/blog/greatly-exaggerated#kv) and is not available on Deno Deploy EA. While the
integrated database connectivity management on EA is great, as the post mentions, there is still a need for a
zero-config persistence like Cloudflare's [Durable Objects](https://developers.cloudflare.com/durable-objects/) for
these type of workloads. The post announcing the demise of Deno KV back in May 2025 hinted that there was something
else, but I am not privy to it.

_[Edit 12-08-2025]_ I missed it when the
[Databases were announced](https://bsky.app/profile/deno.land/post/3luiexi2eu22d), but buried in there is that there is
some form of key value storage coming soon. 🥳

Classic Deploy had already shrunk from 35 regions to 6, while EA is only in 2 regions. As the May 2025
[post explains](https://deno.com/blog/greatly-exaggerated#deno-deploy) this was driven by cost and demand, but I still
think at least something in Asia is called for.

I also have a couple classic Deploy projects that use KV queues and the cron features of which equivalent features
haven't yet appeared in EA that I am aware of, so I am far from being able to move all my workloads over.
