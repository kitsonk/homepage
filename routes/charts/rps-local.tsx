import { type Handlers } from "$fresh/server.ts";
import { renderChart } from "$fresh_charts";
import { transparentize } from "$fresh_charts/utils";

const BODY_TYPEFACE =
  `"Mali","ui-sans-serif","system-ui","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","Noto Sans","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`;

export const handler: Handlers = {
  GET() {
    return renderChart({
      type: "bar",
      data: {
        labels: [
          "Deno 1.41.2",
          "Bun 1.0.30",
          "Node.js 20.11.1",
          "Node.js 21.6.2",
        ],
        datasets: [{
          label: "Avg Request per Second",
          data: [70989.1, 78833.46, 24492.37, 29756.37],
          borderColor: "#F6D608",
          backgroundColor: transparentize("#F6D608", 0.3),
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
};
