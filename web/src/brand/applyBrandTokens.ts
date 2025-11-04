import type { BrandTokens } from "@/agents/types";
import { hexToHsl } from "./color";

type CssVarRecord = Record<string, string>;

export function brandTokensToCssVars(tokens: BrandTokens): CssVarRecord {
  const toHsl = (hex?: string, fallback = "#000000") => {
    const { h, s, l } = hexToHsl(hex ?? fallback);
    return `${h} ${s}% ${l}%`;
  };

  return {
    "--primary": toHsl(tokens.colors.primary),
    "--primary-foreground": toHsl(tokens.colors.foreground ?? "#ffffff"),
    "--secondary": toHsl(tokens.colors.secondary ?? "#94a3b8"),
    "--secondary-foreground": toHsl(tokens.colors.foreground ?? "#0f172a"),
    "--accent": toHsl(tokens.colors.accent ?? "#10b981"),
    "--accent-foreground": toHsl(tokens.colors.foreground ?? "#f8fafc"),
    "--destructive": toHsl(tokens.colors.danger ?? "#ef4444"),
    "--destructive-foreground": toHsl(tokens.colors.foreground ?? "#f8fafc"),
    "--background": toHsl(tokens.colors.background ?? "#ffffff"),
    "--foreground": toHsl(tokens.colors.foreground ?? "#0f172a"),
    "--border": toHsl(tokens.colors.neutral ?? "#e2e8f0"),
    "--input": toHsl(tokens.colors.neutral ?? "#e2e8f0"),
    "--ring": toHsl(tokens.colors.primary),

    "--radius-sm": tokens.radius?.sm ?? "0.25rem",
    "--radius-md": tokens.radius?.md ?? "0.5rem",
    "--radius-lg": tokens.radius?.lg ?? "0.75rem",
    "--radius-xl": tokens.radius?.xl ?? "1rem",

    "--shadow-sm": tokens.shadow?.sm ?? "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "--shadow-md": tokens.shadow?.md ?? "0 4px 10px 0 rgb(0 0 0 / 0.08)",
    "--shadow-lg": tokens.shadow?.lg ?? "0 10px 25px -5px rgb(0 0 0 / 0.1)",
    "--shadow-xl": tokens.shadow?.xl ?? "0 20px 45px -10px rgb(0 0 0 / 0.15)",

    "--space-sm": tokens.spacing?.sm ?? "0.5rem",
    "--space-md": tokens.spacing?.md ?? "1rem",
    "--space-lg": tokens.spacing?.lg ?? "1.5rem",
    "--space-xl": tokens.spacing?.xl ?? "2rem",

    "--font-heading": tokens.font?.heading ?? "Inter",
    "--font-body": tokens.font?.body ?? "Inter",
    "--font-mono": tokens.font?.mono ?? "JetBrains Mono",
  };
}
