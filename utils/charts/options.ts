import type { ApexChartOptions } from "./ssr.ts";

/**
 * The body typeface the chart.js endpoints rendered with. Single-quoted family
 * names only: ApexCharts interpolates this value into double-quoted SVG
 * attributes without escaping, so `"Mali"` would produce `font-family=""Mali""`
 * and make the whole SVG unparseable.
 */
export const BODY_TYPEFACE =
  "'Mali','ui-sans-serif','system-ui','BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','sans-serif','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'";

const AXIS_LABEL_COLOR = "#788746";
const CATEGORY_LABEL_COLOR = "#283618";
const GRID_COLOR = "#FEFAE0";

export interface BarChartOptions {
  /** Legend/dataset name. */
  name: string;
  /** Category labels, in render order. */
  labels: string[];
  /** Values, one per label. */
  data: number[];
  /** Bar colour; the fill is drawn at 30% opacity with a solid 2px stroke. */
  color: string;
}

/**
 * Column chart matching the previous chart.js styling intent: translucent bar
 * fill with a solid border in the same colour, 18px tick labels, legend at the
 * bottom, transparent plot background.
 */
export function barChartOptions({ name, labels, data, color }: BarChartOptions): ApexChartOptions {
  return {
    chart: {
      type: "bar",
      width: 768,
      height: 384,
      background: "transparent",
      fontFamily: BODY_TYPEFACE,
      toolbar: { show: false },
      animations: { enabled: false },
    },
    series: [{ name, data }],
    colors: [color],
    dataLabels: { enabled: false },
    fill: { opacity: 0.3 },
    stroke: { width: 2, colors: [color] },
    plotOptions: { bar: { columnWidth: "55%" } },
    // ApexCharts SSR cannot measure text, so y tick labels are always anchored
    // at `yaxis.labels.padding` and the plot starts at ~42px: a wider pad plus
    // left grid padding keeps 5-digit ticks from being clipped at x < 0 and
    // from overlapping the bars. Bottom padding clears the x-axis labels.
    grid: { borderColor: GRID_COLOR, padding: { left: 72, right: 8, bottom: 16 } },
    xaxis: {
      categories: labels,
      labels: {
        rotate: 0,
        trim: false,
        style: { colors: CATEGORY_LABEL_COLOR, fontSize: "18px", fontFamily: BODY_TYPEFACE },
      },
    },
    yaxis: {
      labels: {
        padding: 60,
        style: { colors: AXIS_LABEL_COLOR, fontSize: "18px", fontFamily: BODY_TYPEFACE },
        formatter: (value: number) => String(value),
      },
    },
    // SSR serialises only the chart SVG (the legend is HTML), so this legend is
    // never drawn in the static output; kept as the documented style intent.
    legend: {
      show: true,
      position: "bottom",
      fontSize: "20px",
      fontFamily: BODY_TYPEFACE,
      labels: { colors: CATEGORY_LABEL_COLOR },
    },
  };
}
