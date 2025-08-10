import type { JSX as PreactJSX } from "preact";

declare module "preact" {
  export namespace JSX {
    interface RssElement extends Element, EventTarget {
      "xmlns:atom"?: string;
    }

    interface RssAttributes<Target extends EventTarget = RssElement> extends PreactJSX.HTMLAttributes<Target> {
      href?: string | undefined | SignalLike<string | undefined>;
      rel?: string | undefined | SignalLike<string | undefined>;
      type?: string | undefined | SignalLike<string | undefined>;
      medium?: string | undefined | SignalLike<string | undefined>;
      url?: string | undefined | SignalLike<string | undefined>;
      version?: string | undefined | SignalLike<string | undefined>;
      "xmlns:atom"?: string | undefined | SignalLike<string | undefined>;
      "xmlns:media"?: string | undefined | SignalLike<string | undefined>;
    }

    export interface IntrinsicElements {
      "atom:link": RssAttributes<RssElement>;
      category: RssAttributes<RssElement>;
      channel: RssAttributes<RssElement>;
      description: RssAttributes<RssElement>;
      generator: RssAttributes<RssElement>;
      guid: RssAttributes<RssElement>;
      item: RssAttributes<RssElement>;
      language: RssAttributes<RssElement>;
      "media:content": RssAttributes<RssElement>;
      pubDate: RssAttributes<RssElement>;
      rss: RssAttributes<RssElement>;
      url: RssAttributes<RssElement>;
    }
  }
}
