import { App, staticFiles } from "fresh";

import { configure } from "./configure.tsx";
import type { State } from "./utils.ts";

export const app = new App<State>();

configure(app)
  .use(staticFiles())
  .fsRoutes();
