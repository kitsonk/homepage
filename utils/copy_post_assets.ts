import { cp, mkdir, readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

/**
 * Cloudflare Workers has no filesystem, so post assets (images beside a post's
 * `index.md`) are copied into the built static output at build time. The URL
 * space is unchanged: `posts/<id>/<file>` on disk becomes `/posts/<id>/<file>`.
 *
 * Runs after `astro build` (see the `build` script in package.json) because the
 * adapter only writes `dist/server/wrangler.json` — and therefore the assets
 * directory — once the build is done.
 */

const POSTS_DIR = "posts";
const DIST_SERVER = "dist/server";

async function resolveClientDir(): Promise<string> {
  try {
    const raw = await readFile(join(DIST_SERVER, "wrangler.json"), "utf8");
    const directory = JSON.parse(raw).assets?.directory;
    if (typeof directory === "string") return resolve(DIST_SERVER, directory);
  } catch {
    // Fall through to the adapter's default layout.
  }
  return resolve("dist/client");
}

const clientDir = await resolveClientDir();
let copied = 0;

for (const entry of await readdir(POSTS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const postDir = join(POSTS_DIR, entry.name);
  for (const file of await readdir(postDir, { recursive: true })) {
    // Markdown source stays private; only sibling assets are published.
    if (file === "index.md") continue;
    const source = join(postDir, file);
    if (!(await stat(source)).isFile()) continue;
    const destination = join(clientDir, "posts", entry.name, file);
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination);
    copied++;
  }
}

console.log(`Copied ${copied} post asset(s) into ${clientDir}/posts`);
