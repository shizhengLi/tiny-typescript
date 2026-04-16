import { createChapter, section, show } from "../shared/chapter";

interface User {
  id: number;
  name: string;
  active: boolean;
}

const STATUS = {
  PENDING: "pending",
  DONE: "done"
} as const;

function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export const chapter08 = createChapter({
  id: "08",
  title: "`keyof`、`typeof`、索引访问类型",
  articlePath: "docs/typescript-series/08-keyof-typeof-索引访问类型.md",
  summary: "展示如何从已有值和已有类型中继续提取信息。",
  run() {
    section("keyof + 索引访问");
    const user: User = { id: 1, name: "Alice", active: true };
    show("pick name", pick(user, "name"));
    show("pick active", pick(user, "active"));

    section("typeof + as const");
    type Status = typeof STATUS[keyof typeof STATUS];
    const currentStatus: Status = STATUS.PENDING;
    show("status object", STATUS);
    show("current status", currentStatus);
  }
});
