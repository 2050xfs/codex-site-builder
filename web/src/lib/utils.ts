import { randomBytes } from "crypto";

type Primitive = string | number | boolean | null | undefined;
type ClassDictionary = Record<string, Primitive>;
type ClassValue = Primitive | ClassDictionary | ClassValue[];

function normalize(value: ClassValue): string[] {
  if (value === undefined || value === null || value === false) {
    return [];
  }
  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalize(item));
  }
  if (typeof value === "object") {
    return Object.entries(value as ClassDictionary)
      .filter(([, truthy]) => Boolean(truthy))
      .map(([key]) => key);
  }
  return [];
}

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flatMap((value) => normalize(value))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function assertOk<T>(condition: T, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}

export function shortId(length = 6) {
  return randomBytes(length).toString("hex").slice(0, length);
}
