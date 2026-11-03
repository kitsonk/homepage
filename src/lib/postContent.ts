import { extract } from "@std/front-matter/any";

/**
 * Post bodies are bundled at build time: Cloudflare Workers has no filesystem,
 * so request-time reads are impossible. Vite's raw import records every
 * markdown file under `posts/` as a string keyed by its path relative to this
 * module.
 */
const raw = import.meta.glob("../../posts/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface PostContentRef {
  id: string;
  isDir: boolean;
}

export async function getPostContent({ id, isDir }: PostContentRef): Promise<string> {
  const path = isDir ? `../../posts/${id}/index.md` : `../../posts/${id}.md`;
  const str = raw[path];
  if (str === undefined) {
    throw new Error(`No bundled markdown found for post "${id}" (expected ${path})`);
  }
  const { body } = extract(str);
  return body;
}
