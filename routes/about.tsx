import { type ComponentChildren } from "preact";

import { Footer } from "../components/Footer.tsx";
import { Meta } from "../components/Meta.tsx";

function Project(
  { children, title, logo, href }: {
    children: ComponentChildren;
    title: string;
    logo: string;
    href: string;
  },
) {
  return (
    <div class="p-6 bg-gray-50 rounded shadow dark:bg-gray-800">
      <Meta
        title="About | 7 foot tall cactus"
        description="Hi, I'm Kit. I am a husband. I am a father. I am a technologist. I have lots of opinions. I work on M&A due diligence."
      />
      <a
        href={href}
        target="_blank"
        class="text-green(700 dark:400) hover:underline"
      >
        <img
          class="justify-center items-center mb-4 w-12 h-12 rounded bg-white lg:h-16 lg:w-16 p-2"
          src={logo}
          alt={`${title} logo`}
        />
        <h3 class="font-header mb-2 text-xl font-bold">
          {title}
        </h3>
      </a>
      <p class="font-light text-gray-700 dark:text-gray-400">
        {children}
      </p>
    </div>
  );
}

export default function About() {
  return (
    <>
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-lg lg:py-16 lg:px-6">
          <div class="text-gray-700 sm:text-lg dark:text-gray-200 space-y-6">
            <h1 class="font-header mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
              About
            </h1>
            <p class="mb-4">
              Hi, I'm Kit. I am a husband. I am a father. I am a technologist. I
              have lots of opinions. I work on M&amp;A due diligence.
            </p>
            <h2 class="font-header mb-4 text-3xl tracking-tight font-bold text-gray-900 dark:text-white">
              Life and Family
            </h2>
            <p>
              I was born and raised in the US. I started traveling for work in
              my early 20s, and wanted to travel. My employer started sending me
              on long term assignments overseas. While working on an assignment
              in Dublin, Ireland, I met my future husband online. We met and
              after about 9 months of trying to figure out our lives, we became
              a couple. We have been together for over 20 years and married for
              over 16 years.
            </p>
            <p>
              In 2006 I moved to the UK indefinitely to be with my husband,
              becoming a UK Citizen a few years later. We eventually converged
              on wanting to have a family and spent many years planning and
              researching. One of the things we knew would be hard is raising a
              family in London, where we were living. While we considered
              elsewhere in the UK, we wondered if Australia or New Zealand would
              be a better choice for us, so we took off for 3 months in
              2016/2017 to visit South East Asia, Australia and New Zealand.
              After we returned home, we started to try to find a way to get to
              Australia or New Zealand.
            </p>
            <p>
              As our son was on the way, via surrogacy in the US, I got a
              sponsored visa to relocate to Australia, and so at the start of
              2018 we up roots in the UK and migrated to Australia. Our son
              arrived in August of 2018. Now we have settled in the suburbs of
              Melbourne and focus on family life, raising our son, and enjoying
              a good life.
            </p>
          </div>
        </div>
      </section>
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6 text-gray-700 sm:text-lg dark:text-gray-200 space-y-6">
          <h2 class="font-header mb-4 text-3xl tracking-tight font-bold text-gray-900 dark:text-white">
            Projects
          </h2>
          <p class="mb-4">
            I have been lucky to be heavily involved in open source software for
            the last 12 years. I have worked on some great software and pursued
            some passion projects. Here are some of my more interesting
            projects:
          </p>
          <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 xl:gap-8 md:space-y-0">
            <Project
              title="Deno"
              logo="/images/projects/deno.svg"
              href="https://deno.land/"
            >
              A former core team member, having worked on Deno for four and half
              years. Mainly focused on the TypeScript integration, the language
              server, and other DX features.
            </Project>
            <Project
              title="nocuous"
              logo="/images/projects/nocuous.svg"
              href="https://nocuous.deno.dev/"
            >
              Static code toxicity analysis for JavaScript and TypeScript, based
              on Erik Dörnenburg's concepts described in{" "}
              <a
                href="https://erik.doernenburg.com/2008/11/how-toxic-is-your-code/"
                target="_blank"
                class="text-green(600 dark:400) hover:underline"
              >
                How toxic is your code?
              </a>
            </Project>
            <Project
              title="oak"
              logo="/images/projects/oak.png"
              href="https://oakserver.github.io/oak/"
            >
              The most popular server middleware framework for Deno. Adapting a
              lot of concepts from Express or koa.
            </Project>
            <Project
              title="Dojo"
              logo="/images/projects/dojo.png"
              href="https://dojo.io"
            >
              Former project lead, taking the "legacy" Dojo Toolkit and
              re-inventing it as a modern JavaScript/TypeScript web application
              framework.
            </Project>
            <Project
              title="entente"
              logo="/images/projects/h-o-t.png"
              href="https://github.com/h-o-t/entente"
            >
              A convention testing framework for JavaScript/TypeScript.
            </Project>
            <Project
              title="Fresh Charts"
              logo="/images/projects/fresh.svg"
              href="https://fresh-charts.deno.dev/"
            >
              Server side rendering for{" "}
              <a
                href="https://www.chartjs.org/"
                target="_blank"
                class="text-green(600 dark:400) hover:underline"
              >
                Chart.js
              </a>, intended for use with{" "}
              <a
                href="https://fresh.deno.dev/"
                target="_blank"
                class="text-green(600 dark:400) hover:underline"
              >
                Fresh.
              </a>
            </Project>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
