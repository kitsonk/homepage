// deno-lint-ignore-file jsx-void-dom-elements-no-children
import postsJson from "../posts.json" with { type: "json" };
import { define } from "../utils.ts";
import "../utils/rss-types.ts";

interface Post {
  id: string;
  title: string;
  date: string;
  author: string;
  href: string;
  tags?: string[];
  hero: { src: string; alt?: string };
  summary: string;
  readEstimate: number;
  isDir: boolean;
}

function Item({ post }: { post: Post }) {
  const href = new URL(post.href, "https://kitsonkelly.com").toString();
  const hero = post.hero.src ? new URL(post.hero.src, "https://kitsonkelly.com").toString() : undefined;
  const categories = post.tags &&
    post.tags.map((tag, idx) => <category key={idx}>{tag}</category>);
  return (
    <item>
      <title>{post.title}</title>
      <link>{href}</link>
      <description>{post.summary}</description>
      <pubDate>{new Date(post.date).toUTCString()}</pubDate>
      <guid>{href}</guid>
      {hero && <media:content medium="image" url={hero} />}
      {categories}
    </item>
  );
}

function RssFeed() {
  const items = postsJson.map((post, idx) => <Item post={post} key={idx} />);
  return (
    <rss
      xmlns:atom="http://www.w3.org/2005/Atom"
      xmlns:media="http://search.yahoo.com/mrss/"
      version="2.0"
    >
      <channel>
        <title>7 foot tall cactus</title>
        <link>https://kitsonkelly.com</link>
        <description>The homepage and blog of Kitson P. Kelly.</description>
        <language>en-AU</language>
        <generator>Fresh + Preact</generator>
        <atom:link
          href="https://kitsonkelly.com/rss-feed"
          rel="self"
          type="application/rss+xml"
        />
        <image>
          <url>https://kitsonkelly.com/rss-logo.png</url>
          <title>7 foot tall cactus</title>
          <link>https://kitsonkelly.com</link>
        </image>
        {items}
      </channel>
    </rss>
  );
}

export const handler = define.handlers({
  GET(ctx) {
    return ctx.render(<RssFeed />, {
      headers: {
        "content-type": "application/rss+xml",
      },
    });
  },
});
