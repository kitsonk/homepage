import { type Handlers, type PageProps } from "$fresh/server.ts";

import { Footer } from "../components/Footer.tsx";
import { Meta } from "../components/Meta.tsx";
import { PostCard } from "../components/Post.tsx";
import { getPosts, type Post } from "../utils/posts.ts";

type Data = Post[];

export default function Home({ data: posts }: PageProps<Data>) {
  return (
    <>
      <Meta
        title="7 foot tall cactus"
        description="The homepage of Kitson P. Kelly."
      />
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
              I am a husband. I am a father. I am a technologist. I have lots of
              opinions. I work on M&amp;A due diligence.
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
            {posts.slice(0, 3).map((post) => <PostCard>{post}</PostCard>)}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(_req, { render, renderNotFound }) {
    try {
      return render(await getPosts());
    } catch (e) {
      console.log(e);
    }
    return renderNotFound();
  },
};
