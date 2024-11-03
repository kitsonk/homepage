import { type ComponentChildren } from "preact";

export function Project(
  { children, title, logo, href }: {
    children: ComponentChildren;
    title: string;
    logo: string;
    href: string;
  },
) {
  return (
    <div class="p-6 bg-gray-50 rounded shadow dark:bg-gray-800">
      <a
        href={href}
        target="_blank"
        class="text-green-700 dark:text-green-400 hover:underline"
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
