import { createChapter, section, show } from "../shared/chapter";

type LoadingState = "idle" | "loading" | "success" | "error";

type LoginSuccess = {
  success: true;
  token: string;
};

type LoginFailure = {
  success: false;
  message: string;
};

type LoginResult = LoginSuccess | LoginFailure;

type BaseUser = {
  id: number;
  name: string;
};

type WithTimestamps = {
  createdAt: string;
  updatedAt: string;
};

type UserDetail = BaseUser & WithTimestamps;

function describeLogin(result: LoginResult): string {
  return result.success ? `token=${result.token}` : `error=${result.message}`;
}

export const chapter05 = createChapter({
  id: "05",
  title: "联合类型、交叉类型与类型别名",
  articlePath: "docs/typescript-series/05-联合类型交叉类型与类型别名.md",
  summary: "展示几选一和同时满足两类约束的区别。",
  run() {
    section("联合类型");
    const state: LoadingState = "loading";
    show("state", state);
    show("login success", describeLogin({ success: true, token: "ts-token" }));
    show("login failure", describeLogin({ success: false, message: "密码错误" }));

    section("交叉类型");
    const user: UserDetail = {
      id: 1,
      name: "Alice",
      createdAt: "2026-04-16",
      updatedAt: "2026-04-16"
    };
    show("user detail", user);
  }
});
