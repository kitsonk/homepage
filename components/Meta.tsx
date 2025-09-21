import { Head } from "fresh/runtime";

export function Meta(
  {
    title,
    description,
    creator = "@kitsonk",
    image,
    alt,
    type = "website",
    keywords = ["homepage", "kitson kelly"],
    canonical,
  }: {
    title: string;
    description?: string;
    creator?: string;
    image?: string;
    alt?: string;
    type?: string;
    keywords?: string[];
    canonical?: string;
  },
) {
  const imageUrl = image && new URL(image, "https://kitsonkelly.com/").toString();
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:title" content={title} />
      <meta property="og:title" content={title} />

      {description && (
        <>
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta name="description" content={description} />
        </>
      )}

      {creator && <meta name="twitter:creator" content={creator} />}

      {imageUrl
        ? (
          <>
            <meta name="twitter:image" content={imageUrl} />
            <meta property="og:image" content={imageUrl} />
            {alt && (
              <>
                <meta name="twitter:image:alt" content={alt} />
                <meta property="og:image:alt" content={alt} />
              </>
            )}
          </>
        )
        : (
          <>
            <meta name="twitter:image" content="/images/hero.png" />
            <meta property="og:image" content="/images/hero.png" />
            <meta name="twitter:image:alt" content="7 foot tall cactus logo" />
            <meta property="og:image:alt" content="7 foot tall cactus logo" />
          </>
        )}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="7 foot tall cactus" />
      <meta property="og:locale" content="en_AU" />

      <meta name="keywords" content={keywords.join(", ")} />

      {canonical && <link rel="canonical" href={`https://kitsonkelly.com${canonical}`} />}
    </Head>
  );
}
