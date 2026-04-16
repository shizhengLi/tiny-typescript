import { createChapter, section, show } from "../shared/chapter";

interface Book {
  readonly id: number;
  title: string;
  author?: string;
}

type Validator = (value: string) => boolean;

function createBook(title: string, author?: string): Book {
  const book: Book = {
    id: title.length * 100,
    title
  };

  if (author) {
    book.author = author;
  }

  return book;
}

const hasContent: Validator = (value) => value.trim().length > 0;

export const chapter03 = createChapter({
  id: "03",
  title: "函数、对象与接口",
  articlePath: "docs/typescript-series/03-函数对象与接口.md",
  summary: "展示函数契约、对象建模和接口的作用。",
  run() {
    section("函数签名");
    show("标题是否合法", hasContent("  TypeScript 实战  "));

    section("对象和接口");
    const book = createBook("深入理解 TypeScript", "Lishizheng");
    show("book", book);

    section("可选属性");
    const shortBook = createBook("匿名作品");
    show("shortBook", shortBook);
  }
});
