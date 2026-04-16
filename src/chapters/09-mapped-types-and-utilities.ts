import { createChapter, section, show } from "../shared/chapter";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, "password">;
type UpdateUserInput = Partial<Omit<User, "id" | "password">>;
type Permission = "read" | "write" | "delete";

function updateUser(current: PublicUser, patch: UpdateUserInput): PublicUser {
  return {
    ...current,
    ...patch
  };
}

export const chapter09 = createChapter({
  id: "09",
  title: "映射类型与内置工具类型",
  articlePath: "docs/typescript-series/09-映射类型与内置工具类型.md",
  summary: "展示如何从一个源模型派生多个场景类型。",
  run() {
    section("Pick / Omit / Partial");
    const user: PublicUser = {
      id: 1,
      name: "Alice",
      email: "alice@example.com"
    };
    show("updated user", updateUser(user, { name: "Alice Chen" }));

    section("Record");
    const permissionLabel: Record<Permission, string> = {
      read: "读取",
      write: "写入",
      delete: "删除"
    };
    show("permission label", permissionLabel);
  }
});
