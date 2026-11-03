import type { APIRoute } from "astro";
import { barChartOptions } from "@/utils/charts/options.ts";
import { renderChartResponse } from "@/utils/charts/ssr.ts";

export const prerender = true;

export const GET: APIRoute = () =>
  renderChartResponse(
    barChartOptions({
      name: "Avg Request per Second",
      color: "#F6D608",
      labels: [
        "Deno 1.41.2",
        "Bun 1.0.30",
        "Node.js 20.11.1",
        "Node.js 21.6.2",
      ],
      data: [70989.1, 78833.46, 24492.37, 29756.37],
    }),
  );
