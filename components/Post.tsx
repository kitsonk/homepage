import { render } from "@deno/gfm";

import "prismjs/components/prism-diff.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-typescript.js";

import config from "../config.json" with { type: "json" };
import { type Post } from "../utils/posts.ts";
import { assert } from "@std/assert/assert";

function Markdown(
  { children: markdown, baseUrl }: { children?: string; baseUrl?: string },
) {
  assert(markdown);
  const __html = render(markdown, { allowIframes: true, baseUrl });
  // deno-lint-ignore react-no-danger
  return <div class="markdown" dangerouslySetInnerHTML={{ __html }}></div>;
}

const formatMedium = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
const formatLong = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

export function PostCard(
  {
    children: { hero, href, tags, title, summary, date, readEstimate, author },
  }: {
    children: Post;
  },
) {
  const { name, avatar } = config.authors[author as keyof typeof config["authors"]] ??
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
            {formatMedium.format(date)} · {readEstimate} min read
          </div>
        </div>
      </div>
    </article>
  );
}

export function PostArticle(
  {
    children: content,
    post: { title, author, date },
  }: {
    children?: string;
    post: Post;
  },
) {
  const { name, title: authorTitle, avatar } = config.authors[author as keyof typeof config["authors"]];
  return (
    <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
      <div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
        <article class="mx-auto w-full max-w-2xl markdown">
          <header class="mb-4 lg:mb-6">
            <address class="flex items-center mb-6 not-italic">
              <div class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <img
                  class="mr-4 w-16 h-16 rounded-full"
                  src={avatar}
                  alt={`${name} avatar`}
                />
                <div class="px-4">
                  <a
                    href="#"
                    rel="author"
                    class="font-header text-xl font-bold text-gray-900 dark:text-white"
                  >
                    {name}
                  </a>
                  <p class="text-base font-light text-gray-500 dark:text-gray-400">
                    {authorTitle}
                  </p>
                  <p class="text-base font-light text-gray-500 dark:text-gray-400">
                    <time
                      dateTime={date.toISOString()}
                      title={formatLong.format(date)}
                    >
                      {formatMedium.format(date)}
                    </time>
                  </p>
                </div>
              </div>
            </address>
            <h1 class="font-header mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              {title}
            </h1>
          </header>
          <Markdown>{content}</Markdown>
        </article>
      </div>
    </main>
  );
}
