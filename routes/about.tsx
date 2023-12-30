import { Footer } from "../components/Footer.tsx";
import { Meta } from "../components/Meta.tsx";

export default function About() {
  return (
    <>
      <Meta
        title="About | 7 foot tall cactus"
        description="Hi, I'm Kit. I am a husband. I am a father. I am a technologist. I have lots of opinions. I work on M&A due diligence."
      />
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-lg lg:py-16 lg:px-6">
          <div class="text-gray-700 sm:text-lg dark:text-gray-200 space-y-6">
            <h1 class="font-header mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
              About
            </h1>
            <p class="mb-4">
              Hi, I'm Kit. I am a husband. I am a father. I am a technologist. I
              have lots of opinions. I work on M&amp;A due diligence.
            </p>
            <p>
              The site is named <em>7 foot tall cactus</em>{" "}
              which is a reference to me being my High School mascot, which was
              a 7 foot tall cactus outfit.
            </p>
            <h2 class="font-header mb-4 text-3xl tracking-tight font-bold text-gray-900 dark:text-white">
              Life and Family
            </h2>
            <p>
              I was born and raised in the US. I started traveling for work in
              my early 20s, and wanted to travel. My employer started sending me
              on long term assignments overseas. While working on an assignment
              in Dublin, Ireland, I met my future husband online. We met and
              after about 9 months of trying to figure out our lives, we became
              a couple. We have been together for over 20 years and married for
              over 16 years.
            </p>
            <p>
              In 2006 I moved to the UK indefinitely to be with my husband,
              becoming a UK Citizen a few years later. We eventually converged
              on wanting to have a family and spent many years planning and
              researching. One of the things we knew would be hard is raising a
              family in London, where we were living. While we considered
              elsewhere in the UK, we wondered if Australia or New Zealand would
              be a better choice for us, so we took off for 3 months in
              2016/2017 to visit South East Asia, Australia and New Zealand.
              After we returned home, we started to try to find a way to get to
              Australia or New Zealand.
            </p>
            <p>
              As our son was on the way, via surrogacy in the US, I got a
              sponsored visa to relocate to Australia, and so at the start of
              2018 we up roots in the UK and migrated to Australia. Our son
              arrived in August of 2018. Now we have settled in the suburbs of
              Melbourne and focus on family life, raising our son, and enjoying
              a good life.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
