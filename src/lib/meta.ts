export interface MetaProps {
  title: string;
  description?: string;
  creator?: string;
  image?: string;
  alt?: string;
  type?: string;
  keywords?: string[];
  canonical?: string;
}

export const NOT_FOUND_META: MetaProps = {
  title: "Not Found | 7 foot tall cactus",
  description: "The requested page could not be found.",
  keywords: ["not found"],
};
