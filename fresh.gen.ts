// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_404.tsx";
import * as $1 from "./routes/_app.tsx";
import * as $2 from "./routes/about.tsx";
import * as $3 from "./routes/blog.tsx";
import * as $4 from "./routes/contact.tsx";
import * as $5 from "./routes/index.tsx";
import * as $6 from "./routes/posts/[id].tsx";
import * as $7 from "./routes/posts/content.ts";
import * as $8 from "./routes/resume-cv.tsx";

const manifest = {
  routes: {
    "./routes/_404.tsx": $0,
    "./routes/_app.tsx": $1,
    "./routes/about.tsx": $2,
    "./routes/blog.tsx": $3,
    "./routes/contact.tsx": $4,
    "./routes/index.tsx": $5,
    "./routes/posts/[id].tsx": $6,
    "./routes/posts/content.ts": $7,
    "./routes/resume-cv.tsx": $8,
  },
  islands: {},
  baseUrl: import.meta.url,
  config,
};

export default manifest;
