import { renderChart } from "@deno/fresh_charts";
import { transparentize } from "@deno/fresh_charts/utils";

import { define } from "../../utils.ts";

const BODY_TYPEFACE =
  `"Mali","ui-sans-serif","system-ui","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","Noto Sans","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`;

export const handler = define.handlers({
  GET: () => {
    return renderChart({
      type: "bar",
      data: {
        labels: [
          "Deno Deploy",
          "Cloudflare Workers",
        ],
        datasets: [{
          label: "Avg Latency (ms)",
          data: [316.38, 141.96],
          borderColor: "#788746",
          backgroundColor: transparentize("#788746", 0.3),
          borderWidth: 2,
        }],
      },
      options: {
        scales: {
          y: {
            ticks: {
              color: "#788746",
              font: {
                family: BODY_TYPEFACE,
                size: 18,
              },
            },
          },
          x: {
            ticks: {
              backdropColor: "#FEFAE0",
              backdropPadding: 6,
              showLabelBackdrop: true,
              color: "#283618",
              font: {
                family: BODY_TYPEFACE,
                size: 18,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                family: BODY_TYPEFACE,
                size: 20,
              },
            },
            position: "bottom",
          },
        },
        devicePixelRatio: 1,
      },
    });
  },
});
