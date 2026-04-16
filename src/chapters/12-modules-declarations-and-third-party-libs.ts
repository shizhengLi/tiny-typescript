import { createDemoUser } from "../support/user-module";
import { formatLegacyTitle, makeSlug } from "../support/legacy-text.js";
import { createChapter, section, show } from "../shared/chapter";

export const chapter12 = createChapter({
  id: "12",
  title: "模块、声明文件与第三方库",
  articlePath: "docs/typescript-series/12-模块声明文件与第三方库.md",
  summary: "展示模块导入、本地 JS 模块声明和全局声明的配合。",
  run() {
    section("ES Module");
    const user = createDemoUser("Alice", "reader");
    show("imported ts module", user);

    section("为 JS 模块提供类型");
    show("legacy title", formatLegacyTitle("  tiny typescript  "));
    show("legacy slug", makeSlug("TypeScript Series Project"));

    section("全局声明");
    globalThis.__TS_SERIES_VERSION__ = "1.0.0";
    show("global version", globalThis.__TS_SERIES_VERSION__);
  }
});
