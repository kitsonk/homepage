import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { GA4Report, isDocument } from "ga4";

export async function handler(request: Request, ctx: MiddlewareHandlerContext) {
  const response = await ctx.next();
  queueMicrotask(async () => {
    if (!isDocument(request, response)) {
      return;
    }
    const report = new GA4Report({ request, response, conn: ctx });
    await report.send();
  });
  return response;
}
