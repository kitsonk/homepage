import { type Handlers, type PageProps } from "$fresh/server.ts";
import { Footer } from "../../components/Footer.tsx";
import { Meta } from "../../components/Meta.tsx";
import { PostArticle } from "../../components/Post.tsx";
import { Recent } from "../../components/Recent.tsx";
import { getPosts, type Post } from "../../utils/posts.ts";

interface Data {
  posts: Post[];
  post: Post;
}

export default function Post({ data: { posts, post } }: PageProps<Data>) {
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
      <PostArticle>{post}</PostArticle>
      <Recent />
      <Footer />
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(_req, { params, render, renderNotFound }) {
    try {
      const posts = await getPosts();
      const post = posts
        .find(({ id }) => id.toLowerCase() === params.id.toLowerCase());
      if (post) {
        return render({ posts, post });
      }
    } catch {
      // just ignoring, error === not found
    }
    return renderNotFound();
  },
};
