import { createChapter, section, show } from "../shared/chapter";

type UserList = Array<{ id: number; name: string }>;
type PostList = Array<{ id: number; title: string }>;
type Profile = { id: number; nickname: string };

interface ApiMap {
  "/users": UserList;
  "/posts": PostList;
  "/profile": Profile;
}

interface ApiParamsMap {
  "/users": { page: number; pageSize: number };
  "/posts": { category?: string };
  "/profile": undefined;
}

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: string;
};

type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const apiData: { [K in keyof ApiMap]: ApiMap[K] } = {
  "/users": [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ],
  "/posts": [
    { id: 101, title: "TypeScript Fundamentals" },
    { id: 102, title: "Advanced Generics" }
  ],
  "/profile": {
    id: 7,
    nickname: "tiny-ts"
  }
};

async function request<T extends keyof ApiMap>(
  path: T,
  params: ApiParamsMap[T]
): Promise<ApiResult<ApiMap[T]>> {
  await Promise.resolve(params);

  if (path === "/users") {
    const userParams = params as ApiParamsMap["/users"];
    if (userParams.page <= 0) {
      return {
        success: false,
        error: "page 必须大于 0"
      };
    }

    return {
      success: true,
      data: apiData["/users"] as ApiMap[T]
    };
  }

  if (path === "/posts") {
    return {
      success: true,
      data: apiData["/posts"] as ApiMap[T]
    };
  }

  return {
    success: true,
    data: apiData["/profile"] as ApiMap[T]
  };
}

export const chapter14 = createChapter({
  id: "14",
  title: "高级实战：设计类型安全的 API",
  articlePath: "docs/typescript-series/14-高级实战-设计类型安全的-api.md",
  summary: "展示路径、参数和返回值如何通过映射表建立稳定关系。",
  async run() {
    section("请求用户列表");
    const userResult = await request("/users", { page: 1, pageSize: 20 });
    show("user result", userResult);

    section("请求个人资料");
    const profileResult = await request("/profile", undefined);
    show("profile result", profileResult);

    section("错误分支");
    const invalidResult = await request("/users", { page: 0, pageSize: 20 });
    show("invalid result", invalidResult);
  }
});
