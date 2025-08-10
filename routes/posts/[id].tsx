import { HttpError, page } from "fresh";

import { Footer } from "../../components/Footer.tsx";
import { PostArticle } from "../../components/Post.tsx";
import { Recent } from "../../components/Recent.tsx";
import { define } from "../../utils.ts";
import { getPostContent, posts } from "../../utils/posts.ts";

export const handler = define.handlers(({ state, params }) => {
  const post = posts.find(({ id }) => id.toLowerCase() === params.id.toLowerCase());
  if (!post) {
    throw new HttpError(404, `Post with id "${params.id}" not found.`);
  }
  state.post = post;
  state.title = post.title;
  state.canonical = post.href;
  state.description = post.summary;
  state.keywords = ["blog", ...post.tags];
  state.image = post.hero.src;
  state.alt = post.hero.alt;
  state.type = "article";
  return page();
});

export default define.page(async function Blog(ctx) {
  const post = ctx.state.post;
  if (!post) {
    return;
  }
  const content = await getPostContent(post);
  return (
    <>
      <PostArticle post={post}>{content}</PostArticle>
      <Recent>{posts}</Recent>
      <Footer />
    </>
  );
});
