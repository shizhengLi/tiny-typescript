import { assertNever, createChapter, section, show } from "../shared/chapter";

type Admin = {
  role: "admin";
  permissions: string[];
};

type Member = {
  role: "member";
  points: number;
};

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function isAdmin(user: Admin | Member): user is Admin {
  return user.role === "admin";
}

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape);
  }
}

function lengthOf(value: string | string[]): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  return value.length;
}

export const chapter06 = createChapter({
  id: "06",
  title: "类型缩小与控制流分析",
  articlePath: "docs/typescript-series/06-类型缩小与控制流分析.md",
  summary: "展示如何把联合类型缩小到当前分支里的具体类型。",
  run() {
    section("typeof / Array.isArray");
    show("string length", lengthOf("TypeScript"));
    show("array length", lengthOf(["a", "b", "c"]));

    section("用户自定义守卫");
    const admin: Admin | Member = {
      role: "admin",
      permissions: ["read", "write"]
    };
    show("is admin", isAdmin(admin));

    section("判别联合");
    show("circle area", getArea({ kind: "circle", radius: 3 }));
    show("triangle area", getArea({ kind: "triangle", base: 8, height: 4 }));
  }
});
