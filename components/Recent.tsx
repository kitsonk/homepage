import { PostCard } from "./Post.tsx";
import { type Post } from "../utils/posts.ts";

export function Recent({ children }: { children?: Post[] }) {
  return (
    <aside
      aria-label="Recent posts"
      class="py-8 lg:py-24 bg-gray-100 dark:bg-gray-900"
    >
      <div class="px-4 mx-auto max-w-screen-xl">
        <h2 class="font-header mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Recent posts
        </h2>
        <div class="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {children
            ?.slice(0, 3)
            .map((post, idx) => <PostCard key={idx}>{post}</PostCard>)}
        </div>
      </div>
    </aside>
  );
}
