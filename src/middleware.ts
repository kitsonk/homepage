import type { APIContext } from "astro";

export const onRequest = async (_context: APIContext, next: () => Promise<Response>) => await next();
