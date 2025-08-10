import { page } from "fresh";

import { Footer } from "../components/Footer.tsx";
import { PostCard } from "../components/Post.tsx";
import { define } from "../utils.ts";
import { posts } from "../utils/posts.ts";

export const handler = define.handlers(({ state }) => {
  state.title = "Blog | 7 foot tall cactus";
  state.canonical = "/blog";
  state.description = "Long form rantings from a recovering 7 foot tall cactus.";
  state.keywords = ["blog", "kitson kelly"];
  return page();
});

export default define.page(function Blog() {
  return (
    <>
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
            <h2 class="font-header mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Blog
            </h2>
            <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              Long form rantings from a recovering 7 foot tall cactus.
            </p>
          </div>
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => <PostCard key={idx}>{post}</PostCard>)}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
});
