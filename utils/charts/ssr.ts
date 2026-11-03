/**
 * Server-only bridge to ApexCharts' SSR renderer.
 *
 * `apexcharts/ssr` renders a static SVG plus an embedded hydration config
 * (base64 `data-apexcharts-config` on a wrapper `<div>`). These endpoints serve
 * plain SVG documents with no client JavaScript, so only the `<svg>` element is
 * kept — the hydration payload is discarded.
 *
 * ApexCharts is imported here and nowhere else; endpoints receive `Response`s.
 */

export type ApexChartOptions = Record<string, unknown>;

export interface ChartSize {
  width?: number;
  height?: number;
}

/** Matches the geometry the chart.js endpoints rendered at. */
export const DEFAULT_CHART_WIDTH = 768;
export const DEFAULT_CHART_HEIGHT = 384;

const SVG_OPEN = "<svg";
const SVG_CLOSE = "</svg>";

type ApexSsrModule = {
  default: {
    renderToHTML: (options: ApexChartOptions, ssrOptions: { width: number; height: number }) => Promise<string>;
  };
};

/**
 * Extracts the outermost `<svg …>…</svg>` element from `renderToHTML` output.
 * `renderToHTML` wraps the SVG in a hydration container; that container (and
 * its embedded config) must not reach the response.
 */
export function extractSvg(html: string): string {
  const start = html.indexOf(SVG_OPEN);
  const end = html.lastIndexOf(SVG_CLOSE);
  if (start === -1 || end < start) {
    throw new Error("ApexCharts SSR output did not contain an <svg> element");
  }
  return html.slice(start, end + SVG_CLOSE.length);
}

/** Renders `options` to a standalone SVG document string. */
export async function renderChartSvg(options: ApexChartOptions, size: ChartSize = {}): Promise<string> {
  const mod = await import("apexcharts/ssr") as unknown as ApexSsrModule;
  const html = await mod.default.renderToHTML(options, {
    width: size.width ?? DEFAULT_CHART_WIDTH,
    height: size.height ?? DEFAULT_CHART_HEIGHT,
  });
  return extractSvg(html);
}

/** Renders `options` to an `image/svg+xml` response ready for a chart endpoint. */
export async function renderChartResponse(options: ApexChartOptions, size: ChartSize = {}): Promise<Response> {
  const svg = await renderChartSvg(options, size);
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
