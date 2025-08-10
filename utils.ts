import { createDefine } from "fresh";

import { Post } from "./utils/posts.ts";

export interface State {
  alt?: string;
  canonical?: string;
  creator?: string;
  image?: string;
  keywords?: string[];
  description?: string;
  title?: string;
  type?: "website" | "article";
  post?: Post;
}

export const define = createDefine<State>();
