import { ComponentChildren } from "https://esm.sh/v95/preact@10.11.0/src/index";

import { Footer } from "../components/Footer.tsx";
import { Meta } from "../components/Meta.tsx";

const icons = {
  "twitter": (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      aria-label="Twitter Icon"
    >
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    </svg>
  ),
  "mastodon": (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      aria-label="Mastodon Icon"
    >
      <path d="M433 179.11c0-97.2-63.71-125.7-63.71-125.7-62.52-28.7-228.56-28.4-290.48 0 0 0-63.72 28.5-63.72 125.7 0 115.7-6.6 259.4 105.63 289.1 40.51 10.7 75.32 13 103.33 11.4 50.81-2.8 79.32-18.1 79.32-18.1l-1.7-36.9s-36.31 11.4-77.12 10.1c-40.41-1.4-83-4.4-89.63-54a102.54 102.54 0 0 1-.9-13.9c85.63 20.9 158.65 9.1 178.75 6.7 56.12-6.7 105-41.3 111.23-72.9 9.8-49.8 9-121.5 9-121.5zm-75.12 125.2h-46.63v-114.2c0-49.7-64-51.6-64 6.9v62.5h-46.33V197c0-58.5-64-56.6-64-6.9v114.2H90.19c0-122.1-5.2-147.9 18.41-175 25.9-28.9 79.82-30.8 103.83 6.1l11.6 19.5 11.6-19.5c24.11-37.1 78.12-34.8 103.83-6.1 23.71 27.3 18.4 53 18.4 175z" />
    </svg>
  ),
  "github": (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      aria-label="GitHub Icon"
    >
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </svg>
  ),
  "linkedin": (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      aria-label="LinkedIn Icon"
    >
      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
    </svg>
  ),
  "threads": (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 192 192"
      aria-label="Threads Icon"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z">
      </path>
    </svg>
  ),
  "signal": (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      aria-label="Signal Icon"
    >
      <path d="M97.2800192,3.739673 L100.160021,15.3787704 C88.8306631,18.1647705 77.9879854,22.6484879 68.0000023,28.6777391 L61.8399988,18.3985363 C72.8467373,11.7537029 84.7951803,6.81153332 97.2800192,3.739673 Z M158.720055,3.739673 L155.840053,15.3787704 C167.169411,18.1647705 178.012089,22.6484879 188.000072,28.6777391 L194.200075,18.3985363 C183.180932,11.7499974 171.218739,6.80771878 158.720055,3.739673 L158.720055,3.739673 Z M18.3999736,61.8351679 C11.7546212,72.8410466 6.81206547,84.7885562 3.73996516,97.2724198 L15.3799719,100.152197 C18.1661896,88.8237238 22.6502573,77.981893 28.6799796,67.9946902 L18.3999736,61.8351679 Z M11.9999699,127.990038 C11.9961044,122.172725 12.4306685,116.363392 13.2999707,110.611385 L1.43996383,108.811525 C-0.479938607,121.525138 -0.479938607,134.454937 1.43996383,147.168551 L13.2999707,145.36869 C12.4306685,139.616684 11.9961044,133.807351 11.9999699,127.990038 L11.9999699,127.990038 Z M194.160075,237.581539 L188.000072,227.302336 C178.024494,233.327885 167.195565,237.811494 155.880053,240.601305 L158.760055,252.240403 C171.231048,249.164732 183.165742,244.222671 194.160075,237.581539 L194.160075,237.581539 Z M244.000104,127.990038 C244.00397,133.807351 243.569406,139.616684 242.700103,145.36869 L254.56011,147.168551 C256.480013,134.454937 256.480013,121.525138 254.56011,108.811525 L242.700103,110.611385 C243.569406,116.363392 244.00397,122.172725 244.000104,127.990038 Z M252.260109,158.707656 L240.620102,155.827879 C237.833884,167.156352 233.349817,177.998183 227.320094,187.985385 L237.6001,194.184905 C244.249159,183.166622 249.191823,171.205364 252.260109,158.707656 L252.260109,158.707656 Z M145.380047,242.701142 C133.858209,244.43447 122.141865,244.43447 110.620027,242.701142 L108.820026,254.560223 C121.534632,256.479975 134.465442,256.479975 147.180048,254.560223 L145.380047,242.701142 Z M221.380091,196.804701 C214.461479,206.174141 206.175877,214.452354 196.800077,221.362797 L203.920081,231.022048 C214.262958,223.418011 223.404944,214.303705 231.040097,203.984145 L221.380091,196.804701 Z M196.800077,34.6172785 C206.177345,41.5338058 214.463023,49.8188367 221.380091,59.1953726 L231.040097,51.9959309 C223.429284,41.6822474 214.31457,32.5682452 204.000081,24.9580276 L196.800077,34.6172785 Z M34.619983,59.1953726 C41.5370506,49.8188367 49.8227288,41.5338058 59.1999972,34.6172785 L51.9999931,24.9580276 C41.6855038,32.5682452 32.5707896,41.6822474 24.9599774,51.9959309 L34.619983,59.1953726 Z M237.6001,61.8351679 L227.320094,67.9946902 C233.346114,77.969489 237.830073,88.7975718 240.620102,100.1122 L252.260109,97.2324229 C249.184198,84.7624043 244.241751,72.8286423 237.6001,61.8351679 L237.6001,61.8351679 Z M110.620027,13.2989317 C122.141865,11.5656035 133.858209,11.5656035 145.380047,13.2989317 L147.180048,1.43985134 C134.465442,-0.479901112 121.534632,-0.479901112 108.820026,1.43985134 L110.620027,13.2989317 Z M40.7799866,234.201801 L15.9999722,239.981353 L21.7799756,215.203275 L10.0999688,212.463487 L4.3199655,237.241566 C3.3734444,241.28318 4.58320332,245.526897 7.51859925,248.462064 C10.4539952,251.39723 14.6980441,252.606895 18.7399738,251.660448 L43.4999881,245.980888 L40.7799866,234.201801 Z M12.5999703,201.764317 L24.279977,204.484106 L28.2799793,187.305438 C22.4496684,177.507146 18.1025197,166.899584 15.3799719,155.827879 L3.73996516,158.707656 C6.34937618,169.311891 10.3154147,179.535405 15.539972,189.125297 L12.5999703,201.764317 Z M68.6000027,227.762301 L51.4199927,231.761991 L54.1399943,243.441085 L66.7800016,240.501313 C76.3706428,245.725462 86.5949557,249.691191 97.2000192,252.300398 L100.080021,240.6613 C89.0307035,237.906432 78.4495684,233.532789 68.6800027,227.682307 L68.6000027,227.762301 Z M128.000037,23.9980665 C90.1565244,24.0177003 55.3105242,44.590631 37.01511,77.715217 C18.7196958,110.839803 19.8628631,151.287212 39.9999861,183.325747 L29.9999803,225.982439 L72.660005,215.983214 C110.077932,239.548522 158.307237,236.876754 192.892851,209.322653 C227.478464,181.768552 240.856271,135.358391 226.242944,93.6248278 C211.629616,51.8912646 172.221191,23.9617202 128.000037,23.9980665 Z">
      </path>
    </svg>
  ),
  "email": (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      aria-label="Email Icon"
    >
      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
    </svg>
  ),
};

type Icon = keyof typeof icons;

function ContactCard(
  { title, icon, children, href }: {
    title: string;
    icon: Icon;
    href: string;
    children?: ComponentChildren;
  },
) {
  return (
    <div>
      <a
        href={href}
        target="_blank"
        class="hover:underline"
      >
        <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
          <div class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300">
            {icons[icon]}
          </div>
        </div>
        <h3 class="font-header mb-2 text-xl font-bold dark:text-white">
          {title}
        </h3>
      </a>
      <p class="text-gray-500 dark:text-gray-400">
        {children}
      </p>
    </div>
  );
}

export default function Contact() {
  return (
    <>
      <Meta
        title="Contact | 7 foot tall cactus"
        description="Contact information for Kitson Kelly"
        keywords={["contact", "kitson kelly"]}
      />
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div class="max-w-screen-md mb-8 lg:mb-16">
            <h2 class="font-header mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Contact
            </h2>
            <p class="text-gray-500 sm:text-xl dark:text-gray-400">
              If for whatever reason, you wanted to contact me, there are
              various methods to reach out.
            </p>
          </div>
          <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <ContactCard
              title="@kitsonk"
              icon="twitter"
              href="https://twitter.com/kitsonk"
            />
            <ContactCard
              title="@kitsonk@aus.social"
              icon="mastodon"
              href="https://aus.social/@kitsonk"
            />
            <ContactCard
              title="github.com/kitsonk"
              icon="github"
              href="https://github.com/kitsonk"
            />
            <ContactCard
              title="linkedin.com/in/kitsonkelly/"
              icon="linkedin"
              href="https://www.linkedin.com/in/kitsonkelly/"
            />
            <ContactCard
              title="threads.net/@kitsonk"
              icon="threads"
              href="https://www.threads.net/@kitsonk"
            />
            <ContactCard
              title="Signal"
              icon="signal"
              href="sgnl://signal.me/#p/+61451089418"
            />
            <ContactCard
              title="me@kitsonkelly.com"
              icon="email"
              href="mailto:me@kitsonkelly.com"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
