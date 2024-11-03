import { type Config } from "tailwindcss";

const colors = {
  "chalet-green": {
    DEFAULT: "#606C38",
    "50": "#CDD5AF",
    "100": "#C4CFA1",
    "200": "#B3C187",
    "300": "#A2B36C",
    "400": "#90A254",
    "500": "#788746",
    "600": "#606C38",
    "700": "#3F4725",
    "800": "#1E2212",
    "900": "#000000",
  },
  "mallard": {
    DEFAULT: "#283618",
    "50": "#AECC8C",
    "100": "#A4C57D",
    "200": "#90B961",
    "300": "#7CA74A",
    "400": "#678B3E",
    "500": "#526E31",
    "600": "#3D5225",
    "700": "#283618",
    "800": "#0B0F07",
    "900": "#000000",
  },
  "off-yellow": {
    DEFAULT: "#FEFAE0",
    "50": "#FFFDF4",
    "100": "#FEFAE0",
    "200": "#FCF1AA",
    "300": "#FAE873",
    "400": "#F9E03D",
    "500": "#F6D608",
    "600": "#BFA706",
    "700": "#897704",
    "800": "#534803",
    "900": "#1C1901",
  },
  "di-serria": {
    DEFAULT: "#DDA15E",
    "50": "#FDFAF6",
    "100": "#F9F0E5",
    "200": "#F2DCC3",
    "300": "#EBC8A1",
    "400": "#E4B580",
    "500": "#DDA15E",
    "600": "#D38630",
    "700": "#A76923",
    "800": "#794C1A",
    "900": "#4B2F10",
  },
  "bourbon": {
    DEFAULT: "#BC6C25",
    "50": "#EECAAA",
    "100": "#EBC099",
    "200": "#E4AA77",
    "300": "#DE9555",
    "400": "#D78033",
    "500": "#BC6C25",
    "600": "#8D511C",
    "700": "#5E3613",
    "800": "#2F1B09",
    "900": "#010000",
  },
  "fuscous-gray": {
    DEFAULT: "#525351",
    "50": "#C3C3C2",
    "100": "#B8B9B7",
    "200": "#A4A5A3",
    "300": "#90908E",
    "400": "#7B7C7A",
    "500": "#676765",
    "600": "#525351",
    "700": "#363635",
    "800": "#1A1A1A",
    "900": "#000000",
  },
};

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    backgroundImage: {
      "hero-pattern": "url('/images/bg_green.jpg')",
    },
    colors: {
      black: "#000000",
      green: colors["chalet-green"],
      darkGreen: colors.mallard,
      yellow: colors["off-yellow"],
      brown: colors["di-serria"],
      darkBrown: colors.bourbon,
      gray: colors["fuscous-gray"],
      white: "#FFF7E0",
      primary: colors["chalet-green"],
    },
    fontFamily: {
      body: [
        "Mali",
        "ui-sans-serif",
        "system-ui",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      header: [
        "Love Ya Like A Sister",
        "ui-sans-serif",
        "system-ui",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      mono: [
        "JetBrains Mono",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    extend: {
      screens: {
        print: { raw: "print" },
      },
    },
  },
  // preflight: {
  //   "@import":
  //     "url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Love+Ya+Like+A+Sister&family=Mali:ital,wght@0,400;0,700;1,400;1,700&display=swap')",
  // },
} satisfies Config;