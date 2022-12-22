import { extract } from "std/encoding/front_matter.ts";

export interface Post {
  id: string;
  title: string;
  date: Date;
  author: string;
  href: string;
  tags: string[];
  hero: { src: string; alt?: string };
  summary: string;
  content: string;
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

let posts: Post[] | undefined;

export async function getPosts(): Promise<Post[]> {
  if (posts) {
    return posts;
  }
  const files = Deno.readDir("./posts");
  const promises = [];
  for await (const file of files) {
    if (file.isDirectory) {
      promises.push(getPost(file.name, true));
    } else if (file.name.endsWith(".md")) {
      promises.push(getPost(file.name.replace(".md", "")));
    }
  }
  posts = await Promise.all(promises);
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function isDir(id: string): Promise<boolean> {
  try {
    const info = await Deno.stat(`./posts/${id}`);
    return info.isDirectory;
  } catch {
    return false;
  }
}

export async function getPost(id: string, isDir = false): Promise<Post> {
  const filename = isDir ? `./posts/${id}/index.md` : `./posts/${id}.md`;
  const text = await Deno.readTextFile(filename);
  const {
    attrs: { title, description, date, author, hero = "", tags, summary },
    body: content,
  } = extract<FrontMatter>(text);
  return {
    id,
    title,
    date,
    author,
    hero: typeof hero === "string" ? { src: hero } : hero,
    href: `/posts/${id}`,
    tags,
    summary: summary ?? description ?? "",
    content,
  };
}