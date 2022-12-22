import { render } from "gfm";
import { apply, tw } from "twind";
import { css } from "twind/css";

import "prism/components/prism-jsx?no-check";
import "prism/components/prism-javascript?no-check";
import "prism/components/prism-json?no-check";
import "prism/components/prism-rust?no-check";
import "prism/components/prism-tsx?no-check";
import "prism/components/prism-typescript?no-check";

import config from "../config.json" assert { type: "json" };
import { type Post } from "../utils/posts.ts";

const postCss = css({
  // headings
  h2: apply`font-header text-2xl`,
  h3: apply`font-header text-xl`,
  h4: apply`font-header text-lg`,
  h5: apply`font-header font-bold`,
  h6: apply`font-header`,

  // links
  a: apply`text-green(600 dark:400) hover:underline`,

  // paragraphs / lists
  p: apply`py-4`,
  ".lead": apply`text-xl`,
  ol: apply`list-decimal px-4 space-y-2 mb-4`,
  ul: apply`list-disc px-4 space-y-2 mb-4`,
  blockquote:
    apply`p-4 my-4 bg-gray-50 border-l-4 border-gray-300 italic font-medium leading-relaxed text-gray-900 dark:(border-gray-500 bg-gray-800 text-white)`,

  // code
  code: apply`p-1 bg-gray-50 dark:bg-gray-800`,
  pre:
    apply`my-6 py-2 px-4 bg-gray-50 dark:bg-gray-800 rounded overflow-x-auto`,
  "pre > code": apply`p-0`,

  // tables
  table: apply`w-full my-8`,
  thead: apply`bg-gray-50 dark:bg-gray-800`,
  th: apply`font-header`,

  // images/figures
  img: apply`my-8`,
  figure: apply`py-4`,
  "figure > img": apply`my-0`,
  figcaption: apply`text-center py-4 text-gray-500`,
});

const highlightCss = css({
  ".highlight .token": apply`text-green(600 dark:400)`,
  ".highlight .token.attr-name": apply`text-darkGreen-500`,
  ".highlight .token.class-name": apply`text-darkGreen(600 dark:400)`,
  ".highlight .token.comment": apply`text-gray(600 dark:400)`,
  ".highlight .token.keyword": apply`text-green(600 dark:400)`,
  ".highlight .token.number": apply`text-darkBrown(400 dark:300)`,
  ".highlight .token.operator": apply`text-yellow-800 dark:text-yellow-500`,
  ".highlight .token.punctuation": apply`text(black dark:white)`,
  ".highlight .token.string": apply`text-brown-700 dark:text-brown-400`,
  ".highlight .token.tag": apply`text-yellow-700 dark:text-yellow-300`,
});

function Markdown(
  { children: markdown, baseUrl }: { children: string; baseUrl?: string },
) {
  const __html = render(markdown, { allowIframes: true, baseUrl });
  return (
    <div class={tw`${highlightCss}`} dangerouslySetInnerHTML={{ __html }}></div>
  );
}

const formatMedium = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
const formatLong = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

export function PostArticle(
  { children: { title, content, author, date, summary, hero } }: {
    children: Post;
  },
) {
  const { name, title: authorTitle, avatar } =
    config.authors[author as keyof typeof config["authors"]];
  return (
    <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
      <div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
        <article class={tw`mx-auto w-full max-w-2xl ${postCss}`}>
          <header class="mb-4 lg:mb-6">
            <address class="flex items-center mb-6 not-italic">
              <div class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <img
                  class="mr-4 w-16 h-16 rounded-full"
                  src={avatar}
                  alt={`${name} avatar`}
                />
                <div>
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
