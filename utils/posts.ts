import { extract } from "@std/front-matter/any";
import { readEstimate } from "./readEstimate.ts";
import postsJson from "../posts.json" with { type: "json" };

export interface Post {
  id: string;
  title: string;
  date: Date;
  author: string;
  href: string;
  tags: string[];
  hero: { src: string; alt?: string };
  summary: string;
  readEstimate: number;
  isDir: boolean;
}

export interface FrontMatter extends Record<string, unknown> {
  title: string;
  description?: string;
  date: Date;
  hero?: string | { src: string; alt?: string };
  images?: string[];
  summary?: string;
  tags: string[];
  author: string;
}

export const posts: Post[] = postsJson.map(({ date, tags, ...rest }) => ({
  date: new Date(date),
  tags: tags ?? [],
  ...rest,
}));

export async function buildPosts(): Promise<Post[]> {
  const files = Deno.readDir("./posts");
  const promises = [];
  for await (const file of files) {
    if (file.isDirectory) {
      promises.push(getPost(file.name, true));
    } else if (file.name.endsWith(".md")) {
      promises.push(getPost(file.name.replace(".md", "")));
    }
  }
  const posts = await Promise.all(promises);
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

async function getPost(id: string, isDir = false): Promise<Post> {
  const path = isDir ? `./posts/${id}/index.md` : `./posts/${id}.md`;
  const str = await Deno.readTextFile(path);
  const {
    attrs: { title, description, date, author, hero = "", tags, summary },
    body: content,
  } = extract<FrontMatter>(str);
  return {
    id,
    title,
    date,
    author,
    hero: typeof hero === "string" ? { src: hero } : hero,
    href: `/posts/${id}`,
    tags,
    summary: summary ?? description ?? "",
    readEstimate: readEstimate(content),
    isDir,
  };
}

export async function getPostContent({ id, isDir }: Post): Promise<string> {
  const path = isDir ? `./posts/${id}/index.md` : `./posts/${id}.md`;
  const str = await Deno.readTextFile(path);
  const { body } = extract(str);
  return body;
}
