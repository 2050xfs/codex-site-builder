import { gzipSync } from "node:zlib";
import { Buffer } from "node:buffer";
import type { FileSpec } from "@/agents/types";

export async function zipRepoToBase64(files: FileSpec[]) {
  const payload = JSON.stringify(files);
  const compressed = gzipSync(payload, { level: 9 });
  return Buffer.from(compressed).toString("base64");
}
