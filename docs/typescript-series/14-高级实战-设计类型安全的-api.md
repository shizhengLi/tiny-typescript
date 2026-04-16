# 高级实战：设计类型安全的 API

如果学完前面的知识，你还只是停留在“我会写几个类型、看得懂一些泛型”，那 TypeScript 其实只学了一半。真正拉开差距的地方，是你能不能把类型系统转化成设计能力，尤其是在 API 设计上。

一个成熟的 TypeScript 工程师，和一个只是会写注解的开发者，最大的区别通常不在语法量，而在于前者会主动思考：**怎样设计一个 API，让正确用法自然、错误用法困难、调用成本低、扩展路径清晰。**

这篇就是收尾篇。它不再单独讲某个语法，而是把前面学过的类型映射、联合类型、类型缩小、泛型、索引访问类型、工具类型、运行时校验思路串成一个更接近真实项目的案例。

## 一个现实目标：封装类型安全的请求函数

假设我们希望封装这样一个函数：

```ts
request("/users");
request("/posts");
request("/profile");
```

理想效果是：

- 不同路径返回不同数据类型
- 编辑器能自动提示合法路径
- 调用方尽量少写额外类型参数
- 错误状态能被明确建模
- 后续增加接口时改动可控

这其实就是一个非常典型的 API 设计问题。

## 第一步：不要先写函数，先写关系表

很多人一上来就想写函数签名，但更成熟的顺序应该是：**先写数据关系，再写函数。**

```ts
interface ApiMap {
  "/users": {
    id: number;
    name: string;
  }[];
  "/posts": {
    id: number;
    title: string;
  }[];
  "/profile": {
    id: number;
    nickname: string;
  };
}
```

这张映射表非常重要，因为它把“路径”和“返回值类型”之间的关系明确了。一旦核心映射关系清楚，后面的泛型设计会自然很多。

这也是很多类型设计的通用经验：**不要先想函数长什么样，先想系统里有哪些稳定关系。**

## 第二步：让路径和返回值自动关联

```ts
async function request<T extends keyof ApiMap>(path: T): Promise<ApiMap[T]> {
  const response = await fetch(path);
  return response.json() as Promise<ApiMap[T]>;
}
```

这里的关键点有三个：

- `T extends keyof ApiMap`：路径只能来自 `ApiMap` 的键
- `path: T`：调用方传入的路径会绑定到这个类型参数
- `Promise<ApiMap[T]>`：返回值会根据路径自动变成对应数据类型

于是：

```ts
const users = await request("/users");
const profile = await request("/profile");
```

此时：

- `users` 会被推断成用户数组
- `profile` 会被推断成个人信息对象

这就是类型安全 API 设计最核心的体验价值：**调用方几乎不用思考额外类型，提示系统已经把正确约束送到了手边。**

## 第三步：别只建模成功结果，失败路径同样是 API 的一部分

很多初学者设计 API 时，只想着“成功时返回什么”，却把失败逻辑推给 `throw` 或松散字符串。这样做很常见，但类型表达通常不够完整。

更好的做法是把成功和失败都纳入模型：

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: string;
};

type ApiResult<T> = ApiSuccess<T> | ApiFailure;
```

这样你的 `request` 就可以改造成：

```ts
async function request<T extends keyof ApiMap>(path: T): Promise<ApiResult<ApiMap[T]>> {
  try {
    const response = await fetch(path);
    const data = await response.json();

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "unknown error"
    };
  }
}
```

调用方随之获得的好处很明显：

```ts
const result = await request("/users");

if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error);
}
```

这里的 `success` 同时承担了业务语义和类型缩小的作用。

## 第四步：如果每个接口还有不同参数，继续把关系显式写出来

真实项目里，请求通常不只是一个路径。很多接口还会有不同参数结构。这时你应该继续遵循同一个原则：把关系写成映射，而不是把复杂度塞进函数实现里。

例如：

```ts
interface ApiParamsMap {
  "/users": { page: number; pageSize: number };
  "/posts": { category?: string };
  "/profile": undefined;
}
```

然后可以继续设计：

```ts
async function request<T extends keyof ApiMap>(
  path: T,
  params: ApiParamsMap[T]
): Promise<ApiResult<ApiMap[T]>> {
  console.log(path, params);
  throw new Error("not implemented");
}
```

这时：

- `request("/users", { page: 1, pageSize: 20 })` 合法
- `request("/users", { category: "ts" })` 报错
- `request("/profile", undefined)` 合法

这种精确约束，才是类型系统在 API 设计里的真正价值。

## 第五步：如果路径越来越多，核心不是写更多泛型，而是保证映射结构可维护

很多人一学会高级类型，就想把所有请求逻辑都压缩成一段复杂的泛型魔法。这样通常走不远。真正成熟的做法，是保持系统里有一个清晰、稳定、可维护的“关系源”。

也就是说，你真正应该投入设计的是：

- 路径映射是否清楚
- 参数映射是否清楚
- 成功/失败模型是否统一
- 响应包裹结构是否一致

一旦这些关系源稳定，泛型函数本身反而会很薄。

## 第六步：别被类型安全错觉骗了，运行时数据仍然不可信

这里必须强调一个现实问题。下面这行代码：

```ts
const data = await response.json();
```

在运行时拿到的其实只是一个未知值。即使你的函数签名写成了 `Promise<ApiMap[T]>`，也不代表后端真的按照这个结构返回。

这就是为什么成熟项目里，类型安全 API 设计必须和运行时校验配套。

例如：

```ts
const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});
```

拿到数据后，先校验，再进入类型系统：

```ts
const parsed = UserSchema.parse(data);
```

这一步不是 TypeScript 的补丁，而是 TypeScript 真正进入生产环境后的必要搭档。因为 TypeScript 只能保证“你写出来的静态约束”，不能替你验证“外部世界真的遵守了这些约束”。

## 第七步：API 设计不是类型游戏，而是调用体验设计

一个好的类型安全 API，不是写得越复杂越高级，而是调用方会明显感受到：

- 自动提示很准
- 错误用法会被及时阻止
- 成功路径和失败路径都清楚
- 不需要频繁手动标类型参数
- 扩展新接口时规律稳定

换句话说，类型设计的最终价值，不在定义文件里，而在调用体验里。

## 一个更完整的设计视角

如果你把这篇内容和前面的知识串起来，会发现一个成熟的 API 类型设计通常包含这些层面：

- 用字面量联合或映射表限制合法路径
- 用泛型把路径和返回值关联起来
- 用联合类型表达成功与失败两种结果
- 用判别字段帮助调用方做类型缩小
- 用工具类型和映射类型减少重复
- 用运行时校验处理外部不可信数据

这已经不是“我会不会写 TS”层面的问题，而是“我会不会设计系统边界”的问题。

## 一个常见误区：把复杂度堆进类型，而不是整理关系

很多人看到优秀库的类型很强，就误以为核心在于写出复杂泛型。其实真正的关键往往不是复杂，而是关系清晰。

如果你的 API 设计本身混乱：

- 路径不稳定
- 参数语义模糊
- 返回结构不统一
- 错误处理方式不一致

那再多高级类型也救不了这个系统。类型系统最擅长放大清晰关系，不擅长拯救混乱设计。

## 最后的判断标准

什么叫好的类型安全 API 设计？我通常会用这几个问题判断：

- 调用方是不是几乎不用额外思考类型
- 正确用法是不是被自然引导
- 错误用法是不是足够难写出来
- 约束是不是和业务真实边界一致
- 后续增加新接口时，模式是否仍然统一
- 运行时风险有没有被考虑进来

如果这些问题大多数都能回答“是”，那你的类型设计通常就是有效的。

## 本文小结

TypeScript 的终点，不是把所有语法都背熟，而是把类型系统转化成工程设计能力。一个好的 API 类型设计，会把系统里真实存在的关系显式表达出来，再用类型把这些关系自动带到调用方身边，让正确用法更自然，让错误用法更困难。

这就是 TypeScript 最值得投入的地方。它不只是帮你写代码，更在帮你设计代码。

## 练习

1. 给 `request` 增加第二个参数 `params`，并让不同路径拥有不同参数类型。
2. 尝试为一个前端表单提交函数设计输入类型、成功结果和失败结果，并使用判别字段帮助调用方缩小类型。
3. 思考：哪些地方必须依赖运行时校验，而不能只靠 TypeScript？请举出你项目里的一个真实例子。
