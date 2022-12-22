import { getPosts } from "./posts.ts";

Deno.test({
  name: "getPosts()",
  async fn() {
    console.log(await getPosts());
  },
});
