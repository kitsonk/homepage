const SITE = "https://kitsonkelly.com";

interface RssPost {
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

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRss(posts: RssPost[]): string {
  const items = posts.map((post) => {
    const href = new URL(post.href, SITE).toString();
    const hero = post.hero.src ? new URL(post.hero.src, SITE).toString() : undefined;
    const categories = (post.tags ?? []).map((tag) => `<category>${escapeXml(tag)}</category>`).join("");
    return `<item>` +
      `<title>${escapeXml(post.title)}</title>` +
      `<link>${escapeXml(href)}</link>` +
      `<description>${escapeXml(post.summary)}</description>` +
      `<pubDate>${escapeXml(new Date(post.date).toUTCString())}</pubDate>` +
      `<guid>${escapeXml(href)}</guid>` +
      (hero ? `<media:content medium="image" url="${escapeXml(hero)}"></media:content>` : "") +
      categories +
      `</item>`;
  }).join("");
  const channel = `<channel>` +
    `<title>7 foot tall cactus</title>` +
    `<link>https://kitsonkelly.com</link>` +
    `<description>The homepage and blog of Kitson P. Kelly.</description>` +
    `<language>en-AU</language>` +
    `<generator>Astro</generator>` +
    `<atom:link href="https://kitsonkelly.com/rss-feed" rel="self" type="application/rss+xml"></atom:link>` +
    `<image>` +
    `<url>https://kitsonkelly.com/rss-logo.png</url>` +
    `<title>7 foot tall cactus</title>` +
    `<link>https://kitsonkelly.com</link>` +
    `</image>` +
    items +
    `</channel>`;
  return `<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">` +
    channel +
    `</rss>`;
}
