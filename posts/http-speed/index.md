---
title: "HTTP Speed"
description: >
  Checking out how fast different runtimes are with the oak framework.
date: 2024-03-11T12:00:00+10:00
hero: /posts/http-speed/hero.webp
summary: >
  Since I was writing recently about getting oak to work under Deno, Deno
  Deploy, Node.js, Bun and Cloudflare Workers, I started to wonder if there
  would be performance differences. Well I found out.
tags:
- jsr
- deno
- deno deploy
- node
- bun
- cloudflare workers
author: kitsonk
---

Since I was [writing recently](./the-usual-suspects) about getting oak to work under [Deno runtime](https://deno.land/),
[Deno Deploy](https://deno.com/deploy), [Node.js](https://nodejs.org/), [Bun](https://bun.sh/) and
[Cloudflare Workers](https://workers.cloudflare.com/), I started to wonder if there would be performance differences.
Well I found out.

![Runners at the starting blocks featuring an anthropomorphic Chinese dumpling, a cartoon brontosaurus, a construction worker in hi-viz, and a turtle wearing flight goggles](/posts/http-speed/hero.webp)

## Approach and method

I have seen a lot of benchmarks in the Javascript/TypeScript space, and I have seen almost everyone of the merits of
them debated _ad nauseam_. I am certain someone will take issue with my approach and method, but I wanted to do
something that I felt was fair.

One criticism I have of other benchmarks in the space is they are not enough of the picture to gauge really real world
performance and implications. While my test code is simplistic, it has some features I wanted to make sure there were
features you would expect to leverage in a real world application. It requires the oak framework to determine the "type"
of the body and set the content header on each response. This is likely something people using oak leverage a lot. It
also has a error handler middleware, which is likely something that you would find in a real world application.

Here is the test code that I used for each test of Deno CLI, Bun, and Node.js:

```ts
import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { isHttpError } from "@oak/commons/http_errors";

const router = new Router();

router.get("/", (ctx, next) => {
  ctx.response.body = { hello: "world" };
  return next();
});

const app = new Application();

app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      context.response.status = err.status;
      const { message, status, stack } = err;
      if (context.request.accepts("json")) {
        context.response.body = { message, status, stack };
        context.response.type = "json";
      } else {
        context.response.body = `${status} ${message}\n\n${stack ?? ""}`;
        context.response.type = "text/plain";
      }
    } else {
      console.log(err);
      throw err;
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https" : "http"}://${hostname}:${port}`,
  );
});

app.listen({ port: 8080 });
```

For Deno Deploy, to access JSR and also deal with a regression I introduced related to dynamic imports on oak I had to
rewrite the import statements:

```ts
import { Application, Router } from "jsr:@oak/oak@14.2";
import { isHttpError } from "jsr:@oak/commons@0.7/http_errors";
```

> It should be noted that if I wasn't using the Deploy playground functionality, and instead had deployed via a local
> Deno project published on GitHub, I could have used `deno add` to add the JSR dependencies to the project and they
> would have had the same aliases in the import map.

And for Cloudflare Workers I had to change the last line from `app.listen({ port: 8080 });` to:

```ts
export default { fetch: app.fetch };
```

> Also, the Cloudflare Worker never generates the `"listen"` event so that code is redundant, but I included it for
> completeness.

For Deno runtime, Bun and Node.js I did test runs close together on my laptop which is Apple M1 Pro, 14-inch, 2021 with
32GB of RAM running Sonoma 14.2.1. I ran the server and the load generator on the same machine.

I used the latest versions of Deno runtime (v1.41.2) and Bun (v1.0.30) at the time of testing. For Node.js I used the
current LTS version (v20.11.1) and the latest release that was available on my runtime management tool, `asdf`
(v21.6.2).

For Deno Deploy I deployed the code as a Deploy Playground and as Cloudflare Workers I used wrangler to deploy a worker
without any adjustments. I am located in Melbourne with Telstra NBN with an average 99.16 Mbps download speed and a
18.90 upload speed and an average ping time of 19ms to my POP.

For each test run I used [autocannon](https://github.com/mcollina/autocannon) CLI version 7.15.0 running on Node.js
18.12.1. I also used the same test configuration:

```
autocannon -c 100 -d 10 -p 10
```

This is 100 concurrent connections, with 10 pipelined requests, for a duration of 10 seconds.

I ran each test run against each target multiple times to ensure that each run was not significantly different, and none
were. My results were the last test run I did for each target.

As I looked at the Deno Deploy versus Cloudflare Workers results, there was a stark difference in performance, and I was
curious, and so I ran a different profile against the edge runtimes to see if a more moderate load had the same
performance profile. In this moderate profile I used the following:

```
autocannon -c 100 -d 10
```

This is 100 concurrent connections, with no pipelining, for a duration of 10 seconds.

## Results

The following are tables and graphs representing the results of my benchmarking.

### Latency

With latency, lower is better, and measures the time for an individual request to receive a full response.

#### Locally hosted

| Runtime         |  2.5% |   50% | 97.5% |   99% |      Avg |    Stdev |     Max |
| --------------- | ----: | ----: | ----: | ----: | -------: | -------: | ------: |
| Deno 1.41.2     | 13 ms | 13 ms | 16 ms | 18 ms | 13.54 ms |  1.28 ms |   46 ms |
| Bun 1.0.30      |  6 ms | 13 ms | 15 ms | 15 ms | 12.17 ms |  2.86 ms |   42 ms |
| Node.js 20.11.1 | 15 ms | 29 ms | 71 ms | 79 ms | 40.26 ms | 48.21 ms | 1620 ms |
| Node.js 21.6.2  | 22 ms | 25 ms | 63 ms | 67 ms | 33.06 ms | 13.11 ms |  327 ms |

![A bar chart of the average latency per runtime.](/charts/latency-local)

#### Edge hosted

##### Heavy load

| Runtime            |   2.5% |    50% |  97.5% |    99% |       Avg |     Stdev |    Max |
| ------------------ | -----: | -----: | -----: | -----: | --------: | --------: | -----: |
| Deno Deploy        | 117 ms | 326 ms | 545 ms | 589 ms | 316.38 ms | 133.11 ms | 789 ms |
| Cloudflare Workers | 119 ms | 134 ms | 176 ms | 535 ms | 141.96 ms |  51.13 ms | 661 ms |

![A bar chart of the average latency per edge platform under high load.](/charts/latency-edge)

##### Moderate load

| Runtime            |   2.5% |    50% |  97.5% |    99% |       Avg |    Stdev |    Max |
| ------------------ | -----: | -----: | -----: | -----: | --------: | -------: | -----: |
| Deno Deploy        |  30 ms |  38 ms |  86 ms | 107 ms |  46.78 ms | 22.21 ms | 341 ms |
| Cloudflare Workers | 103 ms | 109 ms | 122 ms | 396 ms | 113.25 ms | 37.49 ms | 743 ms |

![A bar chart of the average latency per edge platform under moderate load.](/charts/latency-edge-m)

### Requests a Second

With requests per second, higher is better, and represents the average amount of requests that were processed per
second.

#### Locally hosted

| Runtime         |     1% |   2.5% |    50% |  97.5% |       Avg |    Stdev |    Min |
| --------------- | -----: | -----: | -----: | -----: | --------: | -------: | -----: |
| Deno 1.41.2     | 65,503 | 65,503 | 71,551 | 72,191 |  70,989.1 | 1,790.04 | 65,495 |
| Bun 1.0.30      | 75,903 | 75,903 | 79,039 | 79,999 | 78,833.46 | 1,013.07 | 75,863 |
| Node.js 20.11.1 | 20,991 | 20,991 | 24,831 | 25,247 | 24,492.37 | 1,144.89 | 20,987 |
| Node.js 21.6.2  | 24,415 | 24,415 | 30,255 | 30,879 | 29,756.37 | 1,716.37 | 24,401 |

![A bar chart of the average requests per second.](/charts/rps-local)

#### Edge hosted

##### Heavy load

| Runtime            |    1% |  2.5% |   50% | 97.5% |     Avg |   Stdev |   Min |
| ------------------ | ----: | ----: | ----: | ----: | ------: | ------: | ----: |
| Deno Deploy        | 4,399 | 4,399 | 6,147 | 7,063 |   5,998 |   771.6 | 4,396 |
| Cloudflare Workers | 3,845 | 3,845 | 7,295 | 7,463 | 6,990.3 | 1,051.6 | 3,845 |

![A bar chart of the average requests per second under high load.](/charts/rps-edge)

##### Moderate load

| Runtime            |    1% |  2.5% |   50% | 97.5% |     Avg |  Stdev |   Min |
| ------------------ | ----: | ----: | ----: | ----: | ------: | -----: | ----: |
| Deno Deploy        | 2,085 | 2,085 | 2,617 | 2,735 | 2,582.2 | 181.14 | 2,084 |
| Cloudflare Workers |   598 |   598 |   910 |   924 |   876.1 |  93.88 |   598 |

![A bar chart of the average requests per second under moderate load.](/charts/rps-edge-m)

## Observations

### Deno runtime

The Deno results didn't really hold any surprises for me personally. Even with the overhead of oak, it is still quite
performant. It is also quite consistent, with a standard deviations of ±1.28ms for latency.

I am really familiar with the Deno developer experience, and even with JSR in the mix, it didn't disappoint. It "just
worked".

### Bun

I haven't done a lot with Bun, but when I was with Deno and Bun was coming on the scene, there was a lot of arm waving
about how fast it is. Well, and with what I consider a more "real world" test than a lot of other benchmarks I have
seen, Bun is faster. Again that doesn't specifically surprise me, as they are very focused on it.

That being said, an average of 12.17ms latency compared to Deno's 13.54ms is to me a strong indicator that it is a
marginal win. Bun running oak is 10% faster than Deno, but I would still say you have to look at other considerations
when making the decision, as that gain is likely to be immaterial in the end.

Overall the Bun developer experience was great. Like Deno, the zero setup cost of using TypeScript is great. Also, with
JSR, I got all my intellisense right in the code for everything. Also with the `bunx jsr add` I was able to add my
dependencies and didn't have to touch another configuration file.

### Node.js

Clearly there is a gap in performance between Node.js and Deno and Bun. In other benchmarks I have seen, the Node.js
folks often point out that older versions of Node.js are being used. While that is a valid point, you also have to
consider what people are likely to run in production. Node.js has a legacy and people update slowly.

That being said, you can see that the Node.js team have been putting in the hard yards to get Node.js to perform better.
I am sure if I went back to Node.js 18 the performance gap would be even greater.

So while Bun is 10% faster then Deno and that could be just a marginal win, both Bun and Deno being at least twice as
fast per request on average than that latest Node.js is harder to _ignore_.

If it were me, and I was using Node.js as some form of API server in my eco-system, I would honestly have to take a look
at other run-times. That is no slight at the Node.js eco-system or team, it is partly the reality of the way the larger
eco-system has been able to evolve.

As far as the developer experience, there is more to do. The larger Node.js eco-system has solved a lot of the friction
points, and in fact the `npx jsr add` I used to install the packages made the whole process pretty painless, I didn't
try to figure out how to use TypeScript in the project. I also knew that I needed to add `"type": "module"` to my
`package.json` to be able to have an `index.js` instead of an `index.mjs`.

### Deno Deploy and Cloudflare Workers

I ran the same load profile against Deno Deploy and Cloudflare Workers that I used with the local situation, which is a
pretty heavy load. I was really surprised to see a big performance gap on request times between the two platforms.

This made me revisit my approach and method a little bit and I tried a more moderate load test and those results
surprised me a bit too.

The observations I have made from this are:

- Both load tests are quite artificial. Reaching about 1000 - 6000 requests per second from a single source is very
  unrealistic. While for some workloads that many transactions per second might be realistic, they would invariably be
  geographically distributed, and especially with edge platforms that is important.
- I noticed Deno Deploy only ever scaled to two isolates (runtime handlers) during the tests. I suspect this is a big
  part of the difference in performance too between the high and moderate load. I did some other adhoc runs with
  different permutations between pipelining and requests and found out that high pipelining can impact performance with
  Deploy, but it mostly seems to be a total volume threshold.
- When under the "scaling" threshold for Deno Deploy, Deno Deploy is substantially faster than Cloudflare Workers.
- Cloudflare Workers scale to high levels of transactions with minimal degradation in performance.
- In the high volume test, Deno Deploy actually errored on 8 of the 62k requests.

From a developer experience perspective, I am again likely biased with Deno Deploy. For many workloads all you need is
the Deno runtime and pushing to GitHub. In this case, I just used Deploy's playground feature, which meant I didn't even
do anything locally.

I wasn't familiar with the Cloudflare Workers developer experience until I converted oak to run on it. I was really
impressed with how well it is put together. There is a lot more "boilerplate" but there is good tooling to abstract it
away.

## And the winner is...

The Javascript and TypeScript eco-system. We are in an era where there is a lot of choices, and that is actually really
good, as that is where innovation occurs.

Also, if you should take anything away from my tests, it is really hard to make a bad decision around performance for
most workloads. Even Node.js LTS can process 24k requests per second.

The other winner in my mind is edge compute. It is clear both Deno Deploy and Cloudflare Workers are the way to go for
hosting your workloads at the edge. They are super low friction and give you a lot of advantages beyond serverless.

I guess I also learned that oak isn't that bad.
