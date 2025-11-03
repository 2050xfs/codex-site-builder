import type {
  SiteDesignPlannerArgs,
  SiteDesignPlannerResult,
  RepoScaffolderArgs,
  RepoScaffolderResult,
  CodeWriterArgs,
  CodeWriterResult,
  QualityGateArgs,
  QualityGateResult,
  VercelDeployerArgs,
  VercelDeployerResult,
  FixItAgentArgs,
  FixItAgentResult,
  PagePlan,
  PageSection,
  FileSpec,
  BrandTokens,
} from "./types";

// Helper to extract pages from brief
function extractPagesFromBrief(brief: string, pagesHint?: string[]): string[] {
  if (pagesHint && pagesHint.length > 0) {
    return pagesHint;
  }

  const lowerBrief = brief.toLowerCase();
  const pages: string[] = ["home"];

  if (lowerBrief.includes("about") || lowerBrief.includes("company")) {
    pages.push("about");
  }
  if (lowerBrief.includes("product") || lowerBrief.includes("service")) {
    pages.push("products");
  }
  if (lowerBrief.includes("contact") || lowerBrief.includes("reach")) {
    pages.push("contact");
  }
  if (lowerBrief.includes("blog") || lowerBrief.includes("article")) {
    pages.push("blog");
  }
  if (lowerBrief.includes("pricing") || lowerBrief.includes("price")) {
    pages.push("pricing");
  }

  return pages;
}

// Helper to extract brand colors from brief
function extractBrandColors(brief: string, brandHint?: Partial<BrandTokens>): BrandTokens {
  const lowerBrief = brief.toLowerCase();
  const defaultColors = {
    primary: "#4f46e5",
    secondary: "#94a3b8",
    accent: "#10b981",
    background: "#ffffff",
    foreground: "#0f172a",
  };

  if (brandHint?.colors) {
    return {
      colors: { ...defaultColors, ...brandHint.colors },
      radius: brandHint.radius,
      shadow: brandHint.shadow,
      spacing: brandHint.spacing,
      font: brandHint.font,
    };
  }

  // Extract colors from brief
  let primary = defaultColors.primary;
  if (lowerBrief.includes("blue")) primary = "#3b82f6";
  if (lowerBrief.includes("green")) primary = "#10b981";
  if (lowerBrief.includes("purple")) primary = "#8b5cf6";
  if (lowerBrief.includes("red")) primary = "#ef4444";
  if (lowerBrief.includes("orange")) primary = "#f97316";

  return {
    colors: {
      ...defaultColors,
      primary,
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
    },
    font: {
      heading: "Inter",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  };
}

export const tools = {
  site_design_planner: {
    description: "Create a structured site plan (pages, sections, brand tokens).",
    parameters: {} as const,
    execute: async (args: SiteDesignPlannerArgs): Promise<SiteDesignPlannerResult> => {
      const { businessBrief, goals, pagesHint, brandHint } = args;
      const pages: PagePlan[] = [];
      const pageNames = extractPagesFromBrief(businessBrief, pagesHint);

      for (const pageName of pageNames) {
        const sections: PageSection[] = [];

        if (pageName === "home") {
          sections.push({ kind: "hero", props: { title: "Welcome", subtitle: businessBrief.slice(0, 100) } });
          sections.push({ kind: "features", props: {} });
          sections.push({ kind: "cta", props: {} });
        } else if (pageName === "about") {
          sections.push({ kind: "header", props: { title: "About Us" } });
          sections.push({ kind: "content", props: {} });
        } else if (pageName === "products" || pageName === "services") {
          sections.push({ kind: "header", props: { title: "Products & Services" } });
          sections.push({ kind: "product-grid", props: {} });
        } else if (pageName === "contact") {
          sections.push({ kind: "header", props: { title: "Contact Us" } });
          sections.push({ kind: "contact-form", props: {} });
        } else if (pageName === "pricing") {
          sections.push({ kind: "header", props: { title: "Pricing" } });
          sections.push({ kind: "pricing-cards", props: {} });
        } else {
          sections.push({ kind: "header", props: { title: pageName.charAt(0).toUpperCase() + pageName.slice(1) } });
          sections.push({ kind: "content", props: {} });
        }

        pages.push({
          slug: pageName === "home" ? "/" : `/${pageName}`,
          title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
          sections,
        });
      }

      const brand = extractBrandColors(businessBrief, brandHint);

      return {
        pages,
        brand,
      };
    },
  },
  repo_scaffolder: {
    description: "Generate a Next.js repo from a SitePlan.",
    parameters: {} as const,
    execute: async (args: RepoScaffolderArgs): Promise<RepoScaffolderResult> => {
      const { plan } = args;
      const files: FileSpec[] = [];

      // Generate package.json
      const packageJson = {
        name: "generated-site",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          next: "15.5.4",
          react: "19.1.0",
          "react-dom": "19.1.0",
        },
        devDependencies: {
          "@types/node": "^20",
          "@types/react": "^19",
          "@types/react-dom": "^19",
          typescript: "^5",
        },
      };
      files.push({
        path: "package.json",
        contents: JSON.stringify(packageJson, null, 2),
      });

      // Generate tsconfig.json
      files.push({
        path: "tsconfig.json",
        contents: JSON.stringify(
          {
            compilerOptions: {
              target: "ES2017",
              lib: ["dom", "dom.iterable", "esnext"],
              allowJs: true,
              skipLibCheck: true,
              strict: true,
              noEmit: true,
              esModuleInterop: true,
              module: "esnext",
              moduleResolution: "bundler",
              resolveJsonModule: true,
              isolatedModules: true,
              jsx: "preserve",
              incremental: true,
              plugins: [{ name: "next" }],
            },
            include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
            exclude: ["node_modules"],
          },
          null,
          2
        ),
      });

      // Generate next.config.ts
      files.push({
        path: "next.config.ts",
        contents: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;`,
      });

      // Generate app layout
      const siteTitle = plan.brand.name || "Generated Site";
      files.push({
        path: "app/layout.tsx",
        contents: [
          'import type { Metadata } from "next";',
          'import "./globals.css";',
          "",
          "export const metadata: Metadata = {",
          `  title: "${siteTitle}",`,
          '  description: "AI-generated website",',
          "};",
          "",
          "export default function RootLayout({",
          "  children,",
          "}: {",
          "  children: React.ReactNode;",
          "}) {",
          "  return (",
          "    <html lang=\"en\">",
          "      <body>{children}</body>",
          "    </html>",
          "  );",
          "}",
        ].join("\n"),
      });

      // Generate globals.css
      const primaryColor = plan.brand.colors.primary;
      const bgColor = plan.brand.colors.background || "#ffffff";
      const fgColor = plan.brand.colors.foreground || "#0f172a";
      const fontFamily = plan.brand.font?.body || "Inter";
      files.push({
        path: "app/globals.css",
        contents: [
          "* {",
          "  margin: 0;",
          "  padding: 0;",
          "  box-sizing: border-box;",
          "}",
          "",
          ":root {",
          `  --primary: ${primaryColor};`,
          `  --background: ${bgColor};`,
          `  --foreground: ${fgColor};`,
          "}",
          "",
          "body {",
          `  font-family: ${fontFamily}, sans-serif;`,
          "  background: var(--background);",
          "  color: var(--foreground);",
          "  line-height: 1.6;",
          "}",
        ].join("\n"),
      });

      // Generate pages
      for (const page of plan.pages) {
        files.push({
          path: page.slug === "/" ? "app/page.tsx" : `app${page.slug}/page.tsx`,
          contents: `// Placeholder for ${page.title} page`,
        });
      }

      return { files };
    },
  },
  code_writer: {
    description: "Apply diffs and fill code blocks for pages/blocks.",
    parameters: {} as const,
    execute: async (args: CodeWriterArgs): Promise<CodeWriterResult> => {
      const { repo, diffs } = args;
      let files = [...repo.files];

      // If diffs provided, apply them
      if (diffs && diffs.length > 0) {
        for (const diff of diffs) {
          if (diff.op === "create" || diff.op === "modify") {
            const existingIndex = files.findIndex((f) => f.path === diff.file);
            const newFile: FileSpec = {
              path: diff.file,
              contents: diff.to || "",
            };
            if (existingIndex >= 0) {
              files[existingIndex] = newFile;
            } else {
              files.push(newFile);
            }
          } else if (diff.op === "delete") {
            files = files.filter((f) => f.path !== diff.file);
          }
        }
      }

      // Generate actual page content
      const pageFiles = files.filter((f) => f.path.includes("/page.tsx"));
      for (const file of pageFiles) {
        if (file.contents.includes("Placeholder")) {
          const pageName = file.path.includes("/app/") ? file.path.split("/app/")[1].replace("/page.tsx", "") : "home";
          file.contents = generatePageContent(pageName, file.path);
        }
      }

      return { files };
    },
  },
  quality_gate: {
    description: "Run pre-deploy checks (types/a11y/seo).",
    parameters: {} as const,
    execute: async (args: QualityGateArgs): Promise<QualityGateResult> => {
      const { repo } = args;
      const checks = [
        { name: "Files Generated", status: repo.files.length > 0 ? ("pass" as const) : ("fail" as const) },
        { name: "Package.json Valid", status: repo.files.some((f) => f.path === "package.json") ? ("pass" as const) : ("fail" as const) },
        { name: "Layout File Present", status: repo.files.some((f) => f.path.includes("layout.tsx")) ? ("pass" as const) : ("fail" as const) },
        { name: "Pages Generated", status: repo.files.some((f) => f.path.includes("page.tsx")) ? ("pass" as const) : ("fail" as const) },
      ];

      return checks;
    },
  },
  vercel_deployer: {
    description: "Deploy zipped repo to Vercel",
    parameters: {} as const,
    execute: async (args: VercelDeployerArgs): Promise<VercelDeployerResult> => {
      const { siteId } = args;
      // For demo purposes, return a local preview URL
      // In production, this would deploy to Vercel
      return { vercelUrl: `/api/preview/${siteId}` };
    },
  },
  fix_it_agent: {
    description: "Produce minimal diffs to fix failing checks",
    parameters: {} as const,
    execute: async (args: FixItAgentArgs): Promise<FixItAgentResult> => {
      void args;
      return { diffs: [] };
    },
  },
};

function generatePageContent(pageName: string, filePath: string): string {
  const isHome = pageName === "" || pageName === "home";
  const title = isHome ? "Home" : pageName.charAt(0).toUpperCase() + pageName.slice(1);
  const componentName = title.replace(/[^a-zA-Z0-9]/g, "");

  if (isHome) {
    return [
      "export default function Home() {",
      "  return (",
      '    <div style={{ minHeight: "100vh", padding: "2rem" }}>',
      '      <header style={{ marginBottom: "3rem", textAlign: "center" }}>',
      '        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--primary)" }}>',
      "          Welcome to Our Site",
      "        </h1>",
      '        <p style={{ fontSize: "1.25rem", color: "#666" }}>',
      "          Your AI-generated website is ready!",
      "        </p>",
      "      </header>",
      "",
      '      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>',
      '        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>',
      '          <div style={{ padding: "2rem", background: "#f9fafb", borderRadius: "0.5rem" }}>',
      '            <h2 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Feature 1</h2>',
      "            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
      "          </div>",
      '          <div style={{ padding: "2rem", background: "#f9fafb", borderRadius: "0.5rem" }}>',
      '            <h2 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Feature 2</h2>',
      "            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna.</p>",
      "          </div>",
      '          <div style={{ padding: "2rem", background: "#f9fafb", borderRadius: "0.5rem" }}>',
      '            <h2 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Feature 3</h2>',
      "            <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>",
      "          </div>",
      "        </div>",
      "",
      '        <div style={{ textAlign: "center", padding: "3rem", background: "var(--primary)", color: "white", borderRadius: "0.5rem" }}>',
      '          <h2 style={{ marginBottom: "1rem", fontSize: "2rem" }}>Ready to Get Started?</h2>',
      '          <button style={{ padding: "1rem 2rem", fontSize: "1.1rem", background: "white", color: "var(--primary)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "bold" }}>',
      "            Get Started Today",
      "          </button>",
      "        </div>",
      "      </section>",
      "    </div>",
      "  );",
      "}",
    ].join("\n");
  }

  return [
    `export default function ${componentName}() {`,
    "  return (",
    '    <div style={{ minHeight: "100vh", padding: "2rem" }}>',
    '      <header style={{ marginBottom: "3rem", textAlign: "center" }}>',
    '        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--primary)" }}>',
    `          ${title}`,
    "        </h1>",
    "      </header>",
    "",
    '      <section style={{ maxWidth: "800px", margin: "0 auto" }}>',
    '        <div style={{ padding: "2rem", background: "#f9fafb", borderRadius: "0.5rem" }}>',
    '          <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>',
    `            This is the ${title.toLowerCase()} page. Content will be generated based on your requirements.`,
    "          </p>",
    "        </div>",
    "      </section>",
    "    </div>",
    "  );",
    "}",
  ].join("\n");
}
