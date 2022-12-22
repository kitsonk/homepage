const WPM = 200;
const englishSegmenter = new Intl.Segmenter("en-GB", { granularity: "word" });

/** Return the estimated number of minutes to read for the provided text. */
export function readEstimate(text: string) {
  return Math.round(
    [...englishSegmenter.segment(text)].filter((segment) => segment.isWordLike)
      .length / WPM,
  );
}
