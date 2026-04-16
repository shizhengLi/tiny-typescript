import { createChapter, section, show } from "../shared/chapter";

type User = {
  profile: {
    name: string;
  };
};

function unsafeGetUserName(user: any): string {
  return user.profile.name.toUpperCase();
}

function safeGetUserName(user: User): string {
  return user.profile.name.toUpperCase();
}

export const chapter01 = createChapter({
  id: "01",
  title: "为什么要学 TypeScript",
  articlePath: "docs/typescript-series/01-为什么要学-typescript.md",
  summary: "展示运行时错误和显式类型契约的差异。",
  run() {
    section("没有类型时的问题");
    try {
      console.log(unsafeGetUserName({}));
    } catch (error) {
      show("运行时错误", error instanceof Error ? error.message : error);
    }

    section("有类型契约时的目标数据");
    const user: User = {
      profile: {
        name: "alice"
      }
    };

    show("安全结果", safeGetUserName(user));
  }
});
