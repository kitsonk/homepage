---
title: "The Usual Suspects"
description: >
  Experiences in supporting HTTP servers on multiple Javascript run-times.
date: 2024-03-09T12:00:00+10:00
hero: /posts/the-usual-suspects/hero.webp
summary: >
  The Javascript eco-system is varied these days and JSR is attempting to be a
  package registry up for the challenge. I wanted to share my experience of
  taking the middleware framework I originally wrote for Deno and making it work
  under Node.js, Bun and Cloudflare Workers.
tags:
- jsr
- deno
- node
- bun
- cloudflare workers
author: kitsonk
---

The Javascript eco-system is varied these days and [JSR](https://jsr.io/) is
attempting to be a package registry up for the challenge. I wanted to share my
experience of taking the middleware framework I originally wrote for
[Deno](https://deno.land/) and making it work under
[Node.js](https://nodejs.org/), [Bun](https://bun.sh/) and
[Cloudflare Workers](https://workers.cloudflare.com/).

![A suspect lineup featuring an anthropomorphic Chinese dumpling, a cartoon brontosaurus, a construction worker in hi-viz, and a turtle wearing flight goggles](/posts/the-usual-suspects/hero.webp)

## The story so far

I wrote [oak](https://github.com/oakserver/oak) back in 2018 as part of the
early Deno community. I was making a lot of contributions to Deno and Ry Dahl
and I started regularly chatting about things. He felt that Node.js really
didn't start to take off until [Express](https://expressjs.com/) came along, and
Deno really needed something like that.

Back in 2018, Deno's HTTP server was implemented in TypeScript and was part of
the [Deno std library](https://github.com/denoland/deno_std) and
[Deno Deploy](https://deno.com/deploy) was a couple years in the future.
Eventually Deno implemented a native HTTP server under the `Deno.serveHttp()`
API and then eventually the `Deno.serve()` API.

## Node.js

I originally had Node.js compatibility in oak via
[dnt](https://github.com/denoland/dnt), in fact I was still with Deno and oak
was sort of a guinea pig for dnt. dnt plugged some gaps, like it allowed module
substitution and made polyfilling a lot of APIs trivial. It also allowed me to
run my test suite under Node.js and check for runtime specific issues.

The _problem_ with dnt is that it builds a separate version of the package for
publishing on npm. When migrating to JSR, you have a single code base of which
JSR makes it so that the package can be consumed via npm compatible package
managers. Having a single version of code you are publishing is great, but
currently the
[developer experience is a bit clunky](https://github.com/jsr-io/jsr/issues/179).

That being said, it was relatively straight forward to refactor my code to
support Node.js. I had chosen in oak quite a while ago to abstract the core HTTP
server. This was originally due to the evolving nature of the Deno HTTP server,
but once abstracted, it became a lot easier to implement other runtimes as well.
So there is a
[`http_server_node.ts`](https://github.com/oakserver/oak/blob/main/http_server_node.ts)
which interfaces to the Node.js built-in `http` module. This really didn't
change when moving to JSR.

What did need to change was dynamically importing the correct HTTP server
abstraction at runtime, detecting the runtime environment. Previously dnt was
swapping it out. The other thing that needed to change is that I needed to
manually expose the web standard streams in Node.js into the global namespace.

## Bun

While the surface API of `Bun.serve()` and `Deno.serve()` is quite different in
ways, the whole lifecycle of how requests and responses are handled is pretty
much the same (except for web sockets). This meant it was actually quite
straight forward to implement
[`http_server_bun.ts`](https://github.com/oakserver/oak/blob/main/http_server_bun.ts).

## Cloudflare Workers

Cloudflare Workers doesn't have an HTTP server, instead, you export a fetch
handler. This sorts of inverts the whole process. That meant that I could create
a `http_server_cw.ts` or something like that. A while back I had a request for a
`.handle()` method on the main class of oak, `Application`, that could be used
to adapt to arbitrary HTTP servers or use cases without needing to implement the
oak server abstraction.

Taking a look at Cloudflare Workers fetch handlers though, there was clearly a
cleaner implementation I could do, and so I created the `.fetch()` method in
`Application` which can be default exported:

```ts
import { Application } from "@oak/oak";

const app = new Application();
app.use((ctx) => {
  ctx.response.body = "hello world!";
});

export default { fetch: app.fetch };
```

There were a couple other challenges with Cloudflare Workers, where it appears
to load all possible modules that it was able to statically analyze to make them
available, even if they are only dynamically imported. This meant the top level
imports of the Node.js builtin HTTP server were occurring, even though that code
would never be called. I had to move the dynamic imports into the class
implementations themselves to make the module loadable by the wrangler.

## Still to do

The biggest gap at the moment is web sockets. oak supports web sockets on Deno
CLI and Deno Deploy, but not elsewhere. Each runtime is quite a different story
about it. Deno chose to adopt the web standard `WebSocket` with a basic upgrade
flow that turns an http connection into a web standard `WebSocket`, Bun uses a
handler mechanism with its own `ServerWebSocket` interface, Node.js would need
to use something like [ws](https://www.npmjs.com/package/ws) and Cloudflare
Workers uses a `WebSocketPair`.

Cloudflare Workers should be the easiest, as it is actually pretty close to what
Deno does current. Both Node.js and Bun should be possible, but are likely a lot
more work and will have a sort of convoluted testing path at the moment.

Cloudflare Workers provide some additional context, like the environment
variables and the ability to _wait until_ promises which affect the lifetime of
the request handler. These aren't exposed in oak.

Sending files via the `.send()` is not supported expect on Deno CLI and Deno
Deploy. This functionality is quite coupled to Deno's specific file APIs to be
able to support things like byte ranges and the like, let alone more general
stuff like generation of etags based on the file's state. Even then, oak is
still using deprecated Deno APIs because of its age. Likely I will have to
abstract away the APIs like I have the HTTP server APIs.

There is a lot of cruft in oak, mostly due to it heritage, having been through
multiple generations of Deno HTTP server implementations. Some of the server
abstractions have _leaked_ into other bits of code and unwinding them is likely
to be complex, but something that should eventually get done.

Also, Supporting HTTPS on Node.js would be a nice to have.

## Keyser Söze

The main challenges with getting code to run "everywhere" breaks down into three
areas:

- Runtime specific APIs
- Filling gaps in standard APIs
- Runtime specific implementations

### Runtime specific APIs

For oak, I abstracted these away, giving myself a single API to have to manage
internally, while each implementation could deal with vagaries of the runtime
specific APIs.

The APIs you expose to your users should be as universal as possible and not
conditional on the runtime environment. This just gets really messy for your
users and makes integrations of your API not portable. In oak, for `.listen()` I
standardized on the Deno specific options for things like TLS. That means for
other implementations, I have to conform those options to match the runtime
reality.

### Filling gaps in standard APIs

All the runtimes implement a lot of the web standard APIs, though depending on
your needs, there are gaps. For example, Bun refuses to implement `URLPattern`
(oak doesn't use it, but it a good example), but has most of the other web
standard APIs.

The best way to address this is to conditionally load and expose polyfills. One
that is present in Deno, but almost no where else is the DOM
[`ErrorEvent`](https://github.com/oakserver/oak/blob/main/node_shims.ts#L3-L38)
which oak uses.

Also, specifically for Node.js, some of the web standard APIs are available,
they are just not exposed in the global scope. Like for example the
[web streams](https://github.com/oakserver/oak/blob/main/node_shims.ts#L49-L67)
that oak uses. Conditionally loading and exposing them in the global scope tends
to work.

I would recommend depending on web standard APIs of which there is at least one
reference implementation in a browser and a server side runtime. Depending on
something that isn't quite fully baked yet, or isn't a standard, is going to
lead to a lot of heart ache.

Also, loading polyfills should be feature detected in the runtime environment.
Assumptions about that Node.js doesn't support _X_ or Bun doesn't support _Y_
are short sighted. All the runtimes are evolving quite quickly these days and
all are generally committed to shipping standard APIs, so what assumptions you
make today might not hold true tomorrow.

### Runtime specific implementations

If dealing with the runtime specific APIs is more complex than a couple branches
of code, and you have chosen to implement an abstraction of some kind, then
conditional dynamic imports are the way to go. In oak, the HTTP server
abstraction is conditionally dynamically loaded.

One thing to note is that Cloudflare Workers will statically analyze the
dependency graph of your code and the wrangler will load all modules it detects,
this means that if you are loading some built-in Node.js modules, even
dynamically, they can't be at the top level, as the wrangler will fail to
successfully execute those modules. Instead you will need to move them as
dynamic imports deeper in the code.

### In the end

JSR takes care of the "packaging" part of the code, so each runtime can be fed
modules in a way that can be best managed with the runtime, but JSR does not
address these "functional" level challenges, and that is where you have to step
in.

Addressing those functional challenges is possible though, and while the overall
developer experience of supporting multiple runtimes needs to improve with JSR,
it is really cool that I can, with a single code base, provide a strongly typed
middleware server framework that runs natively on Deno CLI, Deno Deploy,
Node.js, Bun and Cloudflare Workers, providing users of oak relatively easy
access to run their applications they have built with oak on it.
