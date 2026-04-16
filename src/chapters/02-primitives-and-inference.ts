import { createChapter, section, show } from "../shared/chapter";

function uppercaseUnknown(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return "NOT A STRING";
}

function fail(message: string): never {
  throw new Error(message);
}

export const chapter02 = createChapter({
  id: "02",
  title: "基础类型与类型推断",
  articlePath: "docs/typescript-series/02-基础类型与类型推断.md",
  summary: "展示推断、unknown 收窄和 never 的含义。",
  run() {
    section("类型推断");
    const title = "TypeScript 入门";
    const price = 99;
    const published = true;
    const status = "draft" as const;

    show("title", title);
    show("price", price);
    show("published", published);
    show("status", status);

    section("unknown 比 any 更安全");
    show("unknown 收窄结果", uppercaseUnknown("hello ts"));
    show("unknown 非字符串时", uppercaseUnknown(123));

    section("never 表示不会正常返回");
    try {
      fail("示例异常");
    } catch (error) {
      show("caught", error instanceof Error ? error.message : error);
    }
  }
});
