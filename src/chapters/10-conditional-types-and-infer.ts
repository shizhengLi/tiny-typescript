import { createChapter, section, show } from "../shared/chapter";

type ElementType<T> = T extends (infer U)[] ? U : never;
type PromiseValue<T> = T extends Promise<infer U> ? U : T;
type AsyncReturn<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;
type OnlyString<T> = T extends string ? T : never;

async function fetchArticle() {
  return {
    id: 1,
    title: "条件类型",
    tags: ["typescript", "infer"]
  };
}

export const chapter10 = createChapter({
  id: "10",
  title: "条件类型与 `infer`",
  articlePath: "docs/typescript-series/10-条件类型与-infer.md",
  summary: "展示如何在类型层面做条件判断和结构提取。",
  async run() {
    section("提取数组元素类型");
    const tag: ElementType<string[]> = "typescript";
    show("tag", tag);

    section("提取 Promise 值类型");
    const asyncTag: PromiseValue<Promise<string>> = "resolved";
    show("async tag", asyncTag);

    section("提取异步函数返回类型");
    const article: AsyncReturn<typeof fetchArticle> = await fetchArticle();
    show("article", article);

    section("条件过滤联合类型");
    const keyword: OnlyString<string | number | boolean> = "ts";
    show("keyword", keyword);
  }
});
