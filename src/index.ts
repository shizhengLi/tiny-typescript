import { chapterIds, divider, type ChapterId } from "./shared/chapter";
import { chapterMap, chapters } from "./chapters";

function normalizeChapterId(value: string): ChapterId | undefined {
  const normalized = value.padStart(2, "0") as ChapterId;
  return chapterIds.includes(normalized) ? normalized : undefined;
}

function printHelp(): void {
  console.log("TypeScript 示例项目");
  console.log("");
  console.log("可用命令:");
  console.log("  npm run list");
  console.log("  npm run chapter 01");
  console.log("  npm run all");
  console.log("");
  console.log("章节列表:");
  for (const chapter of chapters) {
    console.log(`  ${chapter.id}  ${chapter.title}`);
  }
}

async function runChapter(id: ChapterId): Promise<void> {
  const chapter = chapterMap.get(id);

  if (!chapter) {
    throw new Error(`Unknown chapter: ${id}`);
  }

  divider(`${chapter.id} ${chapter.title}`);
  console.log(`文档: ${chapter.articlePath}`);
  console.log(`说明: ${chapter.summary}`);
  await chapter.run();
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? "list";

  if (command === "list" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "all") {
    for (const chapter of chapters) {
      await runChapter(chapter.id);
    }
    return;
  }

  const chapterId = normalizeChapterId(command);
  if (!chapterId) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  await runChapter(chapterId);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
