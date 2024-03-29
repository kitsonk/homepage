import { type JSX as PreactJSX } from "preact";
import { render } from "preact-render-to-string";
import { type Handlers } from "$fresh/server.ts";

import postsJson from "../posts.json" with { type: "json" };

export interface Post {
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

declare module "preact" {
  export namespace JSX {
    interface RssElement extends Element, EventTarget {
      "xmlns:atom"?: string;
    }

    interface RssAttributes<Target extends EventTarget = RssElement>
      extends PreactJSX.HTMLAttributes<Target> {
      medium?: string | undefined | SignalLike<string | undefined>;
      url?: string | undefined | SignalLike<string | undefined>;
      version?: string | undefined | SignalLike<string | undefined>;
      "xmlns:atom"?: string | undefined | SignalLike<string | undefined>;
      "xmlns:media"?: string | undefined | SignalLike<string | undefined>;
    }

    export interface IntrinsicElements {
      "atom:link": RssAttributes<RssElement>;
      category: RssAttributes<RssElement>;
      channel: RssAttributes<RssElement>;
      description: RssAttributes<RssElement>;
      generator: RssAttributes<RssElement>;
      guid: RssAttributes<RssElement>;
      item: RssAttributes<RssElement>;
      language: RssAttributes<RssElement>;
      "media:content": RssAttributes<RssElement>;
      pubDate: RssAttributes<RssElement>;
      rss: RssAttributes<RssElement>;
      url: RssAttributes<RssElement>;
    }
  }
}

function Item({ post }: { post: Post }) {
  const href = new URL(post.href, "https://kitsonkelly.com").toString();
  const hero = post.hero.src
    ? new URL(post.hero.src, "https://kitsonkelly.com").toString()
    : undefined;
  const categories = post.tags &&
    post.tags.map((tag) => <category>{tag}</category>);
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

function Rss() {
  const items = postsJson.map((post) => <Item post={post} />);
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

export const handler: Handlers = {
  GET() {
    const body = render(Rss());
    return new Response(body, {
      headers: {
        "content-type": "application/rss+xml",
      },
    });
  },
};
