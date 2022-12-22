import { type ComponentChildren } from "preact";

export function ArticleCard(
  { children, title, alt, href, length, src }: {
    children: ComponentChildren;
    title: string;
    alt?: string;
    href: string;
    length: number;
    src: string;
  },
) {
  return (
    <article class="max-w-xs">
      <a href="#">
        <img
          src={src}
          class="mb-5 rounded-lg"
          alt={alt}
        />
      </a>
      <h2 class="font-header mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
        <a href={href}>{title}</a>
      </h2>
      <p class="mb-4 font-light text-gray-500 dark:text-gray-400">{children}</p>
      <a
        href={href}
        class="inline-flex items-center font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
      >
        Read in {length} minutes
      </a>
    </article>
  );
}

export function Recent() {
  return (
    <aside
      aria-label="Recent articles"
      class="py-8 lg:py-24 bg-gray-50 dark:bg-gray-800"
    >
      <div class="px-4 mx-auto max-w-screen-xl">
        <h2 class="font-header mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Recent articles
        </h2>
        <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <ArticleCard
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-2.png"
            alt="Image 2"
            title="Enterprise design tips"
            href="/post"
            length={2}
          >
            Over the past year, Volosoft has undergone many changes! After
            months of preparation.
          </ArticleCard>
          <article class="max-w-xs">
            <a href="#">
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-3.png"
                class="mb-5 rounded-lg"
                alt="Image 3"
              />
            </a>
            <h2 class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
              <a href="#">We partnered with Google</a>
            </h2>
            <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
              Over the past year, Volosoft has undergone many changes! After
              months of preparation.
            </p>
            <a
              href="#"
              class="inline-flex items-center font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
            >
              Read in 8 minutes
            </a>
          </article>
          <article class="max-w-xs">
            <a href="#">
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-4.png"
                class="mb-5 rounded-lg"
                alt="Image 4"
              />
            </a>
            <h2 class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
              <a href="#">Our first project with React</a>
            </h2>
            <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
              Over the past year, Volosoft has undergone many changes! After
              months of preparation.
            </p>
            <a
              href="#"
              class="inline-flex items-center font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
            >
              Read in 4 minutes
            </a>
          </article>
        </div>
      </div>
    </aside>
  );
}
