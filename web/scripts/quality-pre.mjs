import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function run(cmd, name) {
  try {
    const out = execSync(cmd, { stdio: "pipe", encoding: "utf8" });
    console.log(`✅ ${name}\n${out}`);
    return { ok: true, out };
  } catch (error) {
    const err = error;
    const message = err.stdout || err.message;
    console.error(`❌ ${name}\n${message}`);
    return { ok: false, out: message };
  }
}

const steps = [
  () => run("npm run typecheck", "TypeScript types"),
  () => run("npm run lint", "ESLint"),
  () => {
    const offenders = [];
    for (const file of walk(".")) {
      if (!/\.(t|j)sx$/.test(file)) continue;
      const code = fs.readFileSync(file, "utf8");
      const matches = code.match(/<Image\b[^>]*>/g) || [];
      for (const tag of matches) {
        const hasAlt = /alt=/.test(tag) || /aria-hidden=/.test(tag);
        if (!hasAlt) {
          offenders.push(`${file}: ${tag}`);
        }
      }
    }
    if (offenders.length) {
      console.error(`❌ A11y: missing alt/aria-hidden on <Image>\n${offenders.slice(0, 10).join("\n")}`);
      return { ok: false };
    }
    console.log("✅ A11y heuristics");
    return { ok: true };
  },
  () => {
    const pages = glob("app/**/page.tsx");
    const bad = [];
    for (const page of pages) {
      const contents = fs.readFileSync(page, "utf8");
      if (!/export const metadata/.test(contents) && !/<title>/.test(contents)) {
        bad.push(page);
      }
    }
    if (bad.length) {
      console.error(`❌ SEO: missing metadata/title:\n${bad.join("\n")}`);
      return { ok: false };
    }
    console.log("✅ SEO heuristics");
    return { ok: true };
  },
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".next", "node_modules", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function glob(pattern) {
  const files = walk(".");
  const suffix = pattern.split("*").pop();
  return files.filter((file) => file.endsWith(String(suffix)));
}

let ok = true;
for (const step of steps) {
  const res = step();
  if (!res.ok) {
    ok = false;
    break;
  }
}

process.exit(ok ? 0 : 1);
