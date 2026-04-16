import { inspect } from "node:util";

export const chapterIds = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14"
] as const;

export type ChapterId = (typeof chapterIds)[number];

export type Chapter = {
  id: ChapterId;
  title: string;
  articlePath: string;
  summary: string;
  run: () => void | Promise<void>;
};

export function divider(label?: string): void {
  const line = "-".repeat(72);
  if (!label) {
    console.log(line);
    return;
  }

  console.log(`\n${line}`);
  console.log(label);
  console.log(line);
}

export function section(title: string): void {
  console.log(`\n[${title}]`);
}

export function show(label: string, value: unknown): void {
  console.log(`${label}: ${inspect(value, { depth: null, colors: false })}`);
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function createChapter(chapter: Chapter): Chapter {
  return chapter;
}
