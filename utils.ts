import { createDefine } from "fresh";

import { Post } from "./utils/posts.ts";

export interface State {
  post?: Post;
}

export const define = createDefine<State>();
