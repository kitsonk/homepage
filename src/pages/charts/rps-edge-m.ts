import type { APIRoute } from "astro";
import { barChartOptions } from "@/utils/charts/options.ts";
import { renderChartResponse } from "@/utils/charts/ssr.ts";

export const GET: APIRoute = () =>
  renderChartResponse(
    barChartOptions({
      name: "Avg Request per Second",
      color: "#F6D608",
      labels: [
        "Deno Deploy",
        "Cloudflare Workers",
      ],
      data: [2735, 924],
    }),
  );
