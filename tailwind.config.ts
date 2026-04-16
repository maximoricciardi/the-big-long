import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-sora)", "IBM Plex Sans", "sans-serif"],
        body: ["var(--font-ibm-plex-sans)", "sans-serif"],
        display: ["var(--font-playfair-display)", "Georgia", "serif"],
      },
      colors: {
        bg: "var(--bg)",
        srf: "var(--srf)",
        alt: "var(--alt)",
        brd: "var(--brd)",
        tx: "var(--tx)",
        mu: "var(--mu)",
        fa: "var(--fa)",
        go: "var(--go)",
        "go-bg": "var(--go-bg)",
        "go-acc": "var(--go-acc)",
        gr: "var(--gr)",
        "gr-bg": "var(--gr-bg)",
        "gr-acc": "var(--gr-acc)",
        rd: "var(--rd)",
        "rd-bg": "var(--rd-bg)",
        "rd-acc": "var(--rd-acc)",
        bl: "var(--bl)",
        "bl-bg": "var(--bl-bg)",
        "bl-acc": "var(--bl-acc)",
        pu: "var(--pu)",
        "pu-bg": "var(--pu-bg)",
        hdr: "var(--hdr)",
        tick: "var(--tick)",
        ft: "var(--ft)",
      },
      boxShadow: {
        card: "var(--sh)",
      },
    },
  },
  plugins: [],
};

export default config;
