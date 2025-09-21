import { Footer } from "../components/Footer.tsx";
import { Meta } from "../components/Meta.tsx";
import { PostCard } from "../components/Post.tsx";
import { Project } from "../components/Project.tsx";
import { define } from "../utils.ts";
import { posts } from "../utils/posts.ts";

export default define.page(function Home() {
  return (
    <>
      <Meta title="7 foot tall cactus" description="The homepage of Kitson P. Kelly." canonical="/" />
      <section class="bg-hero-pattern bg-no-repeat bg-cover bg-center bg-gray-700 bg-blend-multiply">
        <div class="relative py-8 px-4 mx-auto max-w-screen-xl text-white lg:py-16 z-0">
          <div class="mb-6 max-w-screen-lg lg:mb-0">
            <h1 class="font-header mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl">
              7 foot tall cactus
            </h1>
            <p class="mb-6 font-light text-gray-400 lg:mb-8 md:text-lg lg:text-xl">
              Hi, I'm Kit.
            </p>
            <p class="mb-6 font-light text-gray-400 lg:mb-8 md:text-lg lg:text-xl">
              I am a husband. I am a father. I am a technologist. I have lots of opinions. I work on M&amp;A due
              diligence.
            </p>
            <a
              href="/resume-cv"
              class="inline-flex items-center py-3 px-5 font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-900 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              resumé / cv
              <svg
                class="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                >
                </path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
            <h2 class="font-header mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Blog
            </h2>
            <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              My latest ramblings, about the things that interest me.
            </p>
          </div>
          <div class="grid gap-8 lg:grid-cols-3">
            {posts.slice(0, 3).map((post, idx) => <PostCard key={idx}>{post}</PostCard>)}
          </div>
        </div>
      </section>
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 text-gray-700 sm:text-lg dark:text-gray-200 space-y-6">
          <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
            <h2 class="font-header mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Projects
            </h2>
            <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              Open source projects that I created or had a significant role in developing.
            </p>
          </div>
          <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 xl:gap-8 md:space-y-0">
            <Project
              title="Deno"
              logo="/images/projects/deno.svg"
              href="https://deno.land/"
            >
              A former core team member, having worked on Deno for four and half years. Mainly focused on the TypeScript
              integration, the language server, and other DX features.
            </Project>
            <Project
              title="kview"
              logo="/images/projects/kview.svg"
              href="https://kview.deno.dev/"
            >
              A{" "}
              <a
                href="https://deno.com/kv"
                target="_blank"
                class="text-green-600 dark:text-green-400 hover:underline"
              >
                Deno KV
              </a>{" "}
              viewer, editor, and other tooling to make it easy to manage KV stores.
            </Project>
            <Project
              title="tswhy?"
              logo="/images/projects/tswhy.svg"
              href="https://tswhy.deno.dev/"
            >
              A community effort to enrich TypeScript diagnostics, providing documentation of what can cause the
              diagnostic to occur and common fixes or workarounds.
            </Project>
            <Project
              title="oak"
              logo="/images/projects/oak.png"
              href="https://oakserver.org/"
            >
              The most popular server middleware framework for Deno. Adapting a lot of concepts from Express or koa.
            </Project>
            <Project
              title="nocuous"
              logo="/images/projects/nocuous.svg"
              href="https://nocuous.deno.dev/"
            >
              Static code toxicity analysis for JavaScript and TypeScript, based on Erik Dörnenburg's concepts described
              in{" "}
              <a
                href="https://erik.doernenburg.com/2008/11/how-toxic-is-your-code/"
                target="_blank"
                class="text-green-600 dark:text-green-400 hover:underline"
              >
                How toxic is your code?
              </a>
            </Project>
            <Project
              title="Dojo"
              logo="/images/projects/dojo.png"
              href="https://dojo.io"
            >
              Former project lead, taking the "legacy" Dojo Toolkit and re-inventing it as a modern
              JavaScript/TypeScript web application framework.
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
                class="text-green-600 dark:text-green-400 hover:underline"
              >
                Chart.js
              </a>, intended for use with{" "}
              <a
                href="https://fresh.deno.dev/"
                target="_blank"
                class="text-green-600 dark:text-green-400 hover:underline"
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
});
