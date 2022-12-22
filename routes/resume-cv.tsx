import { type ComponentChildren } from "preact";

import { Meta } from "../components/Meta.tsx";

function Role(
  { children, title, company, start, end = "Present" }: {
    children: ComponentChildren;
    title: string;
    company: string;
    start: string;
    end?: string;
  },
) {
  return (
    <div class="py-6">
      <div class="flex">
        <div>
          <strong>{title}</strong>;
        </div>
        <div class="flex-grow px-4">{company}</div>
        <div>{start} – {end}</div>
      </div>
      <div class="space-y-4 pt-4">{children}</div>
    </div>
  );
}

export default function ResumeCV() {
  return (
    <article class="bg-white dark:bg-gray-900 py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 sm:text-2xl">
      <Meta
        title="Curriculum Vitae/Resumé"
        description="Details about the professional work and accomplishments of Kitson P. Kelly."
        key={["resume", "cv", "curriculum vitae", "kitson kelly"]}
      />
      <h1 class="font-header text-center mb-4 text-5xl md:text-7xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Kitson P. Kelly
      </h1>
      <h2 class="text-gray-500 sm:text-3xl dark:text-gray-400 text-center">
        Curriculum Vitae – Resumé
      </h2>
      <section class="md:flex w-full py-8 border-b-2">
        <div class="md:flex-1">
          <p>
            <strong>Kitson P. Kelly</strong>
          </p>
          <p>1/60 Naples Road</p>
          <p>Mentone</p>
          <p>Victoria 3194</p>
          <p>Australia</p>
        </div>
        <div class="md:flex-initial my-6 md:my-0">
          <table class="border-separate">
            <tbody>
              <tr>
                <td>
                  <strong>Email</strong>:
                </td>
                <td class="px-4">
                  me@kitsonkelly.com
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Mobile</strong>:
                </td>
                <td class="px-4">+61 451 089 418</td>
              </tr>
              <tr>
                <td>
                  <strong>LinkedIn</strong>:
                </td>
                <td class="px-4">
                  <a
                    href="https://www.linkedin.com/in/kitsonkelly/"
                    target="_blank"
                    class="text-green-600 dark:text-green-400 hover:underline"
                  >
                    linkedin.com/in/kitsonkelly/
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Twitter</strong>:
                </td>
                <td class="px-4">
                  <a
                    href="https://twitter.com/kitsonk"
                    target="_blank"
                    class="text-green-600 dark:text-green-400 hover:underline"
                  >
                    @kitsonk
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>GitHub</strong>:
                </td>
                <td class="px-4">
                  <a
                    href="https://github.com/kitsonk"
                    target="_blank"
                    class="text-green-600 dark:text-green-400 hover:underline"
                  >
                    github.com/kitsonk
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="py-8 border-b-2 space-y-4">
        <p>
          I have been lucky in my career to have a variety of roles, from deep
          technical expertise to senior level management. I really like the
          inflection point where technology meets business problems, believing
          that technology mastery aids in delivery on the promise an
          organisation makes its customers. I am always looking for challenging
          roles which leverage my unique experience and talents.
        </p>
        <p>
          I am a US, UK and Australian citizen.
        </p>
      </section>
      <section class="py-8 border-b-2">
        <Role
          title="Principal Technologist"
          company="CTO Labs"
          start="Nov 2022"
        >
          <p>
            Working within the M&A technical due diligence and technical
            advisory capability within CTO Labs, leading technical due
            diligences activities for merger and acquisition transactions, as
            well as providing strategic technical advisory for clients.
          </p>
        </Role>
        <Role
          title="DX Engineering Lead"
          company="Deno Land, Inc."
          start="Sep 2020"
          end="Oct 2022"
        >
          <p>
            Working within a small global cross-functional team within a seed
            funded start-up building{" "}
            <a
              href="https://deno.land/"
              target="_blank"
              class="text-green-600 dark:text-green-400 hover:underline"
            >
              Deno
            </a>{" "}
            a modern JavaScript, TypeScript and Web Assembly runtime, and{" "}
            <a
              href="https://deno.com/deploy"
              target="_blank"
              class="text-green-600 dark:text-green-400 hover:underline"
            >
              Deno Deploy
            </a>{" "}
            as globally distributed edge computing platform for JavaScript,
            TypeScript and Web Assembly.
          </p>
          <p>
            Focusing in leading the engineering effort around developer
            experience, including integrations into intelligent editors,
            documentation, and discovery of the Deno eco-system.
          </p>
        </Role>
        <Role
          title="Principal Technologist"
          company="Thoughtworks"
          start="Jan 2018"
          end="Sep 2020"
        >
          <p>
            Thoughtworks provides consulting and technology delivery services to
            large IT organisations. As a Principal Technologist I focused on
            advising clients, on their digital transformation strategy, data
            platform strategy, platform architecture, and engineering practices.
            I advised across verticals but specialised in the financial sector.
          </p>
        </Role>
        <Role
          title="Chief Technical Officer"
          company="SitePen, Inc."
          start="Aug 2015"
          end="Dec 2017"
        >
          <p>
            An approximately 30-person company focused on delivering enterprise
            web applications. I was responsible for leading software engineering
            and engaging with our clients on their architecture, digital
            transformation road-map, and engineering practices. I also lead our
            growth into more business consulting with a focus on helping large
            enterprises adopt open source methodologies to scale their
            enterprise development.
          </p>
          <p>
            I also have been the project lead for{" "}
            <a
              href="https://dojo.io/"
              target="_blank"
              class="text-green-600 dark:text-green-400 hover:underline"
            >
              Dojo 2
            </a>. Dojo 2+ is a total re-invention of Dojo 1 and is a front-end
            web framework focused on enabling delivery of modern enterprise web
            applications at scale. This role has meant I have become very
            involved with Microsoft's TypeScript language and have in depth
            knowledge of web technologies including the standards bodies that
            support them.
          </p>
        </Role>
        <Role
          title="Head of Technology"
          company="NOW"
          start="Sep 2013"
          end="Aug 2015"
        >
          <p>
            A truly unique opportunity in my life was to lead technology for
            {" "}
            <a
              href="https://www.nowtv.com/"
              target="_blank"
              class="text-green-600 dark:text-green-400 hover:underline"
            >
              NOW
            </a>. NOW was Sky's response to Netflix entering the UK market, but
            soon after I joined, we realised that there was a much broader focus
            for NOW. NOW offers the best pay TV in the UK on your terms.
          </p>
          <p>
            I was responsible for around 120 technologists across multiple
            disciplines. The NOW grew its customer base about four-fold in the
            two years I was responsible. We also started the process of
            extending the business into broadband during my tenure. While the
            role was almost exclusively management, my technical depth allowed
            me to understand the challenges facing my teams better as well as
            guide the business in a direction where technology was an enabler,
            not a barrier.
          </p>
          <p>
            NOW was very demanding, because of the low friction to join meant
            that there was also low fiction to leave. It really highlighted to
            me the challenges of operating a digital business and the key role
            technology plays in enabling that.
          </p>
        </Role>
        <Role
          title="Head of Technology"
          company="Sky Business"
          start="May 2010"
          end="Aug 2013"
        >
          <p>
            I took over a failing programme of work to deliver a new customer
            management system. I successfully delivered the programme and then
            transitioned the programme team to an efficient business as usual
            support model. We went from a project team of about 185 who were
            mostly contractors to a team of about 65 who were 90% employees. It
            was a challenge to take something that was designed with abstract
            best of breed technologies into something that was a reasonable
            solution that meet the business needs to service Sky's commercial
            customers.
          </p>
        </Role>
        <Role
          title="Director"
          company="Asseverate Services Ltd."
          start="Oct 2009"
          end="May 2010"
        >
          <p>
            A transitional period, where I continued to work for Sky after
            leaving Dimension Data. I was focused primarily continued
            stabilisation and roll-out of the contact centre solution we
            deployed for them as part of my earlier work. In additional to
            technical expertise, there was need for organisational design to
            build an internal team at Sky which could effectively manage the
            large, complex contact centre solution.
          </p>
        </Role>
        <Role
          title="Practice Solution Architect"
          company="Dimension Data"
          start="Dec 2006"
          end="Oct 2009"
        >
          <p>
            I moved full-time to the UK in November 2006 and joined Dimension
            Data in the UK less than a month later. Dimension Data wanted to
            grow their call centre consulting business in the UK and had landed
            a major contract at Sky to roll out the largest installation at that
            time of Genesys as a fully Voice over IP solution. It needed to
            scale to 4,000+ users on a global footprint. I led the architecture
            of the solution and we handed over to the in-house deployment team.
            I continued to architect other solutions, traveling globally working
            with other customers for Dimension Data.
          </p>
          <p>
            The solution at Sky though ran into scalability issues which
            resulted in several frequent outages, several times a week. Because
            of my expertise and knowledge, I was requested to go up to Scotland
            to work with crisis team at Sky to resolve the issues.
          </p>
        </Role>
        <Role
          title="Senior Principal Consultant"
          company="eLoyalty"
          start="Jan 1998"
          end="Sep 2006"
        >
          <p>
            I joined eLoyalty as a Consultant and continued to grow into more
            senior roles. I wanted to travel globally, and I was put on projects
            in varied locations across the US and Hong Kong, Hamburg, Belfast,
            Paris, and Dublin. I touched most technologies that were present in
            customer contact centres, though my main specialty was large scale
            global call routing solutions.
          </p>
        </Role>
        <div class="text-center font-italic">Previous Roles Upon Request</div>
      </section>
      <section class="py-8 border-b-2 space-y-4">
        <h3 class="font-bold">Education</h3>
        <p>
          I graduated <em>Cactus High School</em>{" "}
          in Glendale, Arizona in 1991. I attended a semester at{" "}
          <em>
            Glendale Community College
          </em>{" "}
          in Glendale, Arizona in 1992, but did not earn a degree.
        </p>
      </section>
    </article>
  );
}
