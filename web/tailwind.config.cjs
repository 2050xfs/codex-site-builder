/* eslint-disable @typescript-eslint/no-require-imports */
const preset = require("./tailwind.preset.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/ui/**/*.{ts,tsx}",
    "./src/brand/**/*.{ts,tsx}",
    "./src/daytona/**/*.{ts,tsx}",
    "./src/agents/**/*.{ts,tsx}",
  ],
};
