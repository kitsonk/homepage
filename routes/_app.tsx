import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content="kitsonkelly.com" />
        <meta name="twitter:site" content="@kitsonk" />
      </head>
      <body class="font-body bg-white text-black dark:bg-black dark:text-white">
        <Component />
      </body>
    </html>
  );
});
