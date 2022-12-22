import { type Handlers, type PageProps } from "$fresh/server.ts";
import { Footer } from "../../components/Footer.tsx";
import { Meta } from "../../components/Meta.tsx";
import { PostArticle } from "../../components/Post.tsx";
import { Recent } from "../../components/Recent.tsx";
import { getPostContent, type Post, posts } from "../../utils/posts.ts";

interface Data {
  posts: Post[];
  post: Post;
  content: string;
}

export default function Post(
  { data: { posts, post, content } }: PageProps<Data>,
) {
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

export const handler: Handlers<Data> = {
  async GET(_req, { params, render, renderNotFound }) {
    try {
      const post = posts
        .find(({ id }) => id.toLowerCase() === params.id.toLowerCase());
      if (post) {
        const content = await getPostContent(post);
        return render({ posts, post, content });
      }
    } catch {
      // just ignoring, error === not found
    }
    return renderNotFound();
  },
};
