# 条件类型与 `infer`

如果说泛型让 TypeScript 拥有了“参数化类型”的能力，那么条件类型则让它开始真正具备“按条件计算类型”的能力。到了这一篇，你已经进入 TypeScript 的高级区，但这不意味着内容会只是炫技。恰恰相反，条件类型和 `infer` 真正有价值的地方，是它们能把很多原本只能靠重复、重载或手工维护的类型关系自动化。

它们解决的核心问题可以概括成一句话：**当输入类型不同，结果类型也应该随条件变化时，如何把这种变化规则写出来。**

## 条件类型的基本形式

```ts
type IsString<T> = T extends string ? true : false;
```

这段写法看起来像 JavaScript 的三元表达式，因为它本质上就是类型系统里的条件判断：

- 如果 `T` 可以赋值给 `string`
- 那结果就是 `true`
- 否则结果就是 `false`

它的意义不在于这个例子本身，而在于你要开始接受一个事实：**类型系统也可以“计算”。**

## 条件类型为什么重要

因为真实项目里，大量类型关系都不是静态的。比如：

- 如果传入函数类型，就取它的返回值类型
- 如果传入 Promise，就取其 resolve 后的值类型
- 如果一个对象里有某个字段，就提取那个字段类型
- 如果一个联合类型里的成员满足条件，就只保留那些成员

这些都不是单纯的“写一个接口”能解决的问题。它们需要类型系统自己根据输入做推导。

## 一个更实用的例子：提取对象某字段类型

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
```

这段类型表示：

- 如果 `T` 里存在 `message` 字段
- 那就提取 `message` 的类型
- 否则返回 `never`

例如：

```ts
type A = MessageOf<{ message: string }>;
type B = MessageOf<{ id: number }>;
```

结果分别是：

- `A` 为 `string`
- `B` 为 `never`

这类模式在处理复杂响应结构、事件对象、第三方类型封装时非常常见。

## 分布式条件类型是理解高级类型的关键拐点

这通常是初学者第一次真正“懵”的地方。看一个经典例子：

```ts
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>;
```

很多人第一反应会以为 `Result` 是 `(string | number)[]`，但实际结果是：

```ts
string[] | number[]
```

为什么？因为条件类型在遇到联合类型时，默认会对联合中的每个成员分别计算，然后再把结果联合起来。这个行为就叫分布式条件类型。

你可以把它理解成：

```ts
ToArray<string> | ToArray<number>
```

也就是：

```ts
string[] | number[]
```

这不是一个冷知识，而是理解很多工具类型源码的前提。

## 如何阻止分布式行为

有时候你不想让条件类型分发，而是想整体判断。这时可以把类型包在元组里：

```ts
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
```

这时：

```ts
type Result = ToArrayNonDist<string | number>;
```

结果会更接近：

```ts
(string | number)[]
```

你不一定现在就要熟练使用这个技巧，但至少要知道：分布式是默认行为，不是唯一行为。

## `infer` 是什么

如果条件类型解决的是“按条件选结果”，那么 `infer` 解决的就是“从一个已有类型结构里，把某部分类型信息提取出来”。

最经典的例子是提取函数返回值：

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

这里的 `infer R` 可以理解成：

- 如果 `T` 是一个函数类型
- 那请你把它的返回值类型推导出来
- 并把这个结果临时命名为 `R`

于是：

```ts
type A = MyReturnType<() => string>;
```

结果就是 `string`。

## `infer` 的本质，是在匹配过程中“拆结构”

这层理解非常重要。`infer` 不是某种特殊魔法，它就是一种模式匹配式的提取能力。

再看一个例子，提取函数第一个参数类型：

```ts
type FirstArg<T> = T extends (arg: infer A, ...rest: any[]) => any ? A : never;
```

又比如提取数组元素类型：

```ts
type ElementType<T> = T extends (infer U)[] ? U : never;
```

提取 Promise resolve 后的值：

```ts
type PromiseValue<T> = T extends Promise<infer U> ? U : T;
```

你会发现，很多高级类型操作本质上都在做同一件事：**把一个大结构拆开，拿出其中最关心的那一部分。**

## 为什么 `infer` 在库源码里出现频率很高

因为库设计里经常需要“从用户传入的类型中自动推导信息”。例如：

- 从函数中提取参数和返回值
- 从 Promise 中提取异步结果
- 从 React 组件中提取 props
- 从事件处理函数中提取事件对象类型

如果没有 `infer`，很多这类能力就只能靠手写重载或人工指定，体验会差很多。

## 一个更接近工程使用的例子

假设你有一个请求函数返回 Promise：

```ts
async function fetchUser() {
  return {
    id: 1,
    name: "Alice"
  };
}
```

现在你想写一个工具类型，拿到这个函数最终解析后的数据结构：

```ts
type AsyncReturn<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

type User = AsyncReturn<typeof fetchUser>;
```

现在 `User` 就会自动变成：

```ts
{
  id: number;
  name: string;
}
```

这类写法在接口层、数据层、Hooks 封装里都非常实用。

## 条件类型不只是“提取”，也能做“筛选”

例如：

```ts
type OnlyString<T> = T extends string ? T : never;
type Result = OnlyString<string | number | boolean>;
```

最终 `Result` 会是：

```ts
string
```

这说明条件类型不仅能做分支判断，还能对联合类型做筛选。TypeScript 内置的一些工具类型，比如 `Exclude`、`Extract`，本质上就建立在这个思路上。

## 为什么很多人会在这一篇开始走偏

因为条件类型和 `infer` 确实很强，也很容易让人产生一种“我终于接触到真正高级内容了”的兴奋感。问题是，一旦把这种能力当成表演工具，就很容易进入类型体操的陷阱。

现实中的标准应该始终是：

- 这段类型有没有减少重复
- 有没有让调用方获得更准确提示
- 有没有让业务约束表达得更清楚
- 后续维护的人能不能读懂

如果答案都是否定，那这段高级类型大概率只是炫技。

## 一个更成熟的学习态度

你不需要在刚学完这一篇时，就能手写一堆复杂类型工具。更现实的目标是：

- 看懂基本条件类型语法
- 理解分布式行为
- 会用 `infer` 提取常见结构
- 读懂常见内置工具类型的定义思路

这已经足够让你迈入高级 TypeScript 的门槛。

## 本文小结

条件类型让 TypeScript 具备了“根据输入条件计算结果类型”的能力，`infer` 则让它能够在复杂类型结构中提取关键信息。两者结合之后，类型系统就不再只是静态标签，而开始具备真正的推导、拆解和派生能力。

很多你以前觉得“库怎么可能自动知道这个类型”的地方，背后往往就是这些机制在工作。你不一定需要天天手写它们，但你必须理解它们，这样你才真正开始读得懂那些高质量的 TypeScript 代码。

## 练习

1. 写一个类型，提取数组元素类型，并分别测试 `string[]`、`number[]` 和对象数组。
2. 写一个类型，提取 Promise 最终解析出的值类型，再比较它和 `Awaited` 的语义。
3. 阅读一次 TypeScript 内置的 `ReturnType` 定义，尝试自己解释其中 `infer` 的作用。
