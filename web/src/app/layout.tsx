import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";
import { brandTokensToCssVars } from "@/brand/applyBrandTokens";
import { getSiteBrandTokens } from "@/data/brand";

export const metadata: Metadata = {
  title: "Upflex AutoSite Builder",
  description: "Agentic pipeline + Daytona integration for production AI sites",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const tokens = await getSiteBrandTokens();
  const vars = brandTokensToCssVars(tokens);

  return (
    <html lang="en">
      <body style={vars as CSSProperties} className="antialiased bg-background text-foreground font-body">
        {children}
      </body>
    </html>
  );
}
