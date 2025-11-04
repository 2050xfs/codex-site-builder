import type { BrandTokens } from "@/agents/types";

const defaultTokens: BrandTokens = {
  name: "Upflex",
  colors: {
    primary: "#4f46e5",
    secondary: "#94a3b8",
    accent: "#10b981",
    neutral: "#e2e8f0",
    background: "#ffffff",
    foreground: "#0f172a",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 10px 0 rgb(0 0 0 / 0.08)",
    lg: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
    xl: "0 20px 45px -10px rgb(0 0 0 / 0.15)",
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  font: {
    heading: "Inter",
    body: "Inter",
    mono: "JetBrains Mono",
  },
};

export async function getSiteBrandTokens(): Promise<BrandTokens> {
  // TODO: fetch from persistence
  return defaultTokens;
}
