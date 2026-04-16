import { createChapter, section, show } from "../shared/chapter";

type ScoreMap = Record<string, number>;

function getScore(map: ScoreMap, key: string): number | undefined {
  return map[key];
}

export const chapter13 = createChapter({
  id: "13",
  title: "`tsconfig` 与工程化实践",
  articlePath: "docs/typescript-series/13-tsconfig与工程化实践.md",
  summary: "展示严格配置如何让潜在风险更早暴露。",
  run() {
    section("推荐的严格配置");
    const compilerOptions = {
      strict: true,
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true
    } as const;
    show("compilerOptions", compilerOptions);

    section("索引访问要考虑 undefined");
    const scores: ScoreMap = { alice: 100 };
    show("known key", getScore(scores, "alice"));
    show("unknown key", getScore(scores, "bob") ?? "需要默认值或判断");
  }
});
