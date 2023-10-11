import { type RouteContext } from "$fresh/server.ts";
import { assert } from "std/assert/assert.ts";
import { Footer } from "../../components/Footer.tsx";
import { Meta } from "../../components/Meta.tsx";
import { PostArticle } from "../../components/Post.tsx";
import { Recent } from "../../components/Recent.tsx";
import { getPostContent, type Post, posts } from "../../utils/posts.ts";

export default async function Post(_req: Request, { params }: RouteContext) {
  const post = posts
    .find(({ id }) => id.toLowerCase() === params.id.toLowerCase());
  assert(post);
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
      />
      <PostArticle post={post}>{content}</PostArticle>
      <Recent>{posts}</Recent>
      <Footer />
    </>
  );
}
