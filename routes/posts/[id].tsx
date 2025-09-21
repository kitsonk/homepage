import { HttpError, page } from "fresh";

import { Footer } from "../../components/Footer.tsx";
import { Meta } from "../../components/Meta.tsx";
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
      <Meta
        title={post.title}
        description={post.summary}
        keywords={["blog", ...post.tags]}
        image={post.hero.src}
        alt={post.hero.alt}
        type="article"
        canonical={post.href}
      />
      <PostArticle post={post}>{content}</PostArticle>
      <Recent>{posts}</Recent>
      <Footer />
    </>
  );
});
