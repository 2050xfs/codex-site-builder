import { NextRequest, NextResponse } from "next/server";
import type { RepoSpec } from "@/agents/types";

// In-memory store for generated sites (in production, use a database)
const siteStore = new Map<string, RepoSpec>();

export async function GET(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const repo = siteStore.get(siteId);

  if (!repo) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  // Find the home page
  const homePage = repo.files.find((f) => f.path === "app/page.tsx");
  if (!homePage) {
    return NextResponse.json({ error: "Home page not found" }, { status: 404 });
  }

  // Find layout and globals
  const layout = repo.files.find((f) => f.path === "app/layout.tsx");
  const globals = repo.files.find((f) => f.path === "app/globals.css");

  // Create a simple HTML preview from the generated page
  // For demo purposes, we'll render a clean HTML version
  const htmlContent = `
    <div style="min-height: 100vh; padding: 2rem;">
      <header style="margin-bottom: 3rem; text-align: center;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary);">
          Welcome to Your Generated Site
        </h1>
        <p style="font-size: 1.25rem; color: #666;">
          Your AI-generated website is ready!
        </p>
      </header>

      <section style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
          <div style="padding: 2rem; background: #f9fafb; border-radius: 0.5rem;">
            <h2 style="margin-bottom: 1rem; color: var(--primary);">Feature 1</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div style="padding: 2rem; background: #f9fafb; border-radius: 0.5rem;">
            <h2 style="margin-bottom: 1rem; color: var(--primary);">Feature 2</h2>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
          </div>
          <div style="padding: 2rem; background: #f9fafb; border-radius: 0.5rem;">
            <h2 style="margin-bottom: 1rem; color: var(--primary);">Feature 3</h2>
            <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>
          </div>
        </div>

        <div style="text-align: center; padding: 3rem; background: var(--primary); color: white; border-radius: 0.5rem;">
          <h2 style="margin-bottom: 1rem; font-size: 2rem;">Ready to Get Started?</h2>
          <button style="padding: 1rem 2rem; font-size: 1.1rem; background: white; color: var(--primary); border: none; border-radius: 0.5rem; cursor: pointer; font-weight: bold;">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  `;

  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Generated Site</title>
  <style>${globals?.contents || ""}</style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

// Store function for the manager to use
export function storeSite(siteId: string, repo: RepoSpec) {
  siteStore.set(siteId, repo);
}

export function getSite(siteId: string): RepoSpec | undefined {
  return siteStore.get(siteId);
}

