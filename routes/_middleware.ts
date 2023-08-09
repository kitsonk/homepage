import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { GA4Report, isDocument } from "ga4";

export async function handler(request: Request, ctx: MiddlewareHandlerContext) {
  const response = await ctx.next();
  queueMicrotask(async () => {
    if (!isDocument(request, response)) {
      return;
    }
    // deno-lint-ignore no-explicit-any
    const report = new GA4Report({ request, response, conn: ctx as any });
    await report.send();
  });
  return response;
}
