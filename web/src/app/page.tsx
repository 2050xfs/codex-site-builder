import type { Metadata } from "next";
import { SiteBuilder } from "@/components/SiteBuilder";

export const metadata: Metadata = {
  title: "Upflex AutoSite Builder",
  description: "AI-powered website builder with agent pipeline, Daytona integration, and brand tokens.",
};

export default function Home() {
  return <SiteBuilder />;
}
