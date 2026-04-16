import { createChapter, section, show } from "../shared/chapter";

type PageResult<T> = {
  list: T[];
  total: number;
};

function identity<T>(value: T): T {
  return value;
}

function wrap<T>(value: T): { value: T } {
  return { value };
}

function getFirst<T>(list: T[]): T | undefined {
  return list[0];
}

export const chapter07 = createChapter({
  id: "07",
  title: "泛型入门与实战",
  articlePath: "docs/typescript-series/07-泛型入门与实战.md",
  summary: "展示泛型如何保留输入和输出之间的类型关系。",
  run() {
    section("identity");
    show("string", identity("hello"));
    show("number", identity(42));

    section("wrap");
    show("wrapped object", wrap({ id: 1, name: "Alice" }));

    section("分页类型");
    const page: PageResult<{ id: number; title: string }> = {
      list: [
        { id: 1, title: "TS 基础" },
        { id: 2, title: "TS 泛型" }
      ],
      total: 2
    };
    show("first item", getFirst(page.list));
  }
});
