import { expect, test } from "vitest";
import { extractSvg } from "./ssr.ts";

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>';

test("extractSvg - drops the hydration wrapper and embedded config", () => {
  const html = `<div class="apexcharts-ssr-wrapper" data-apexcharts-hydrate data-apexcharts-config="e30=">${SVG}</div>`;
  expect(extractSvg(html)).toBe(SVG);
});
