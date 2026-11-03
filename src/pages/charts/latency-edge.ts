import type { APIRoute } from "astro";
import { barChartOptions } from "@/utils/charts/options.ts";
import { renderChartResponse } from "@/utils/charts/ssr.ts";

export const prerender = true;

export const GET: APIRoute = () =>
  renderChartResponse(
    barChartOptions({
      name: "Avg Latency (ms)",
      color: "#788746",
      labels: [
        "Deno Deploy",
        "Cloudflare Workers",
      ],
      data: [316.38, 141.96],
    }),
  );
