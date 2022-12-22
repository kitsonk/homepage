import { type Handlers, type PageProps } from "$fresh/server.ts";

import config from "../config.json" assert { type: "json" };
import { Footer } from "../components/Footer.tsx";
import { Meta } from "../components/Meta.tsx";
import { getPosts, type Post } from "../utils/posts.ts";
import { readEstimate } from "../utils/readEstimate.ts";

type Data = Post[];

const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

function PostCard(
  { children: { hero, href, tags, title, summary, date, content, author } }: {
    children: Post;
  },
) {
  const { name, avatar } =
    config.authors[author as keyof typeof config["authors"]] ??
      { name: "", avatar: "" };
  return (
    <article class="p-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      {hero.src && (
        <a href={href}>
          <img class="mb-5 rounded-lg" src={hero.src} alt={hero.alt} />
        </a>
      )}
      {tags &&
        (
          <div class="flex flex-wrap">
            {tags.map((tag) => (
              <span class="bg-brown-100 text-brown-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-brown-200 dark:text-brown-900 my-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      <h2 class="font-header my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <a href={href}>{title}</a>
      </h2>
      {summary && (
        <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
          {summary}
        </p>
      )}
      <div class="flex items-center space-x-4">
        <img
          class="w-10 h-10 rounded-full"
          src={avatar}
          alt={`${name} avatar`}
        />
        <div class="font-medium dark:text-white">
          <div>{name}</div>
          <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
            {formatter.format(date)} · {readEstimate(content)} min read
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Blog({ data }: PageProps<Data>) {
  return (
    <>
      <Meta
        title="Blog | 7 foot tall cactus"
        description="Long form rantings from a recovering 7 foot tall cactus."
        keywords={["blog", "kitson kelly"]}
      />
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
            {data.map((post) => <PostCard>{post}</PostCard>)}
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
