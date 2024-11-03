import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="font-body bg-white text-black dark:bg-black dark:text-white">
        <Component />
      </body>
    </html>
  );
}
