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
        "Deno 1.41.2",
        "Bun 1.0.30",
        "Node.js 20.11.1",
        "Node.js 21.6.2",
      ],
      data: [13.54, 12.17, 40.26, 33.06],
    }),
  );
