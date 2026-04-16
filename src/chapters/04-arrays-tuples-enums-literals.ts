import { createChapter, section, show } from "../shared/chapter";

enum LegacyRole {
  Admin = "admin",
  User = "user",
  Guest = "guest"
}

const ROLE = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest"
} as const;

type Direction = "left" | "right";

function move(direction: Direction): string {
  return direction === "left" ? "向左移动" : "向右移动";
}

export const chapter04 = createChapter({
  id: "04",
  title: "数组、元组、枚举与字面量类型",
  articlePath: "docs/typescript-series/04-数组元组枚举与字面量类型.md",
  summary: "展示批量数据、固定位置数据和有限状态的区别。",
  run() {
    section("数组");
    const scores: number[] = [88, 92, 96];
    show("scores", scores);

    section("元组");
    const point: [number, number] = [120, 240];
    show("point", point);

    section("枚举与字面量联合");
    show("legacy enum", LegacyRole.Admin);
    show("modern const object", ROLE.USER);
    show("direction", move("right"));
  }
});
