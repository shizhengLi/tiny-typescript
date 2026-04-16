# `keyof`、`typeof`、索引访问类型

到了这一篇，TypeScript 会开始呈现出它真正“像一门类型编程语言”的味道。前面你主要是在手写类型结构，而这一篇开始，你会发现：类型信息不一定都靠手写，它还可以从已有值中提取、从已有类型中索引、再继续组合推导。

这一步非常关键。因为现代 TypeScript 工程写法里，大量高质量类型设计都建立在一个思路上：**尽量减少重复，让值和类型之间保持同步。**

而 `keyof`、`typeof`、索引访问类型，正是这套思路的核心工具。

## `keyof`：拿到一个对象类型的键集合

先看一个最基础的例子：

```ts
interface User {
  id: number;
  name: string;
  active: boolean;
}

type UserKey = keyof User;
```

此时 `UserKey` 的结果是：

```ts
"id" | "name" | "active"
```

也就是说，`keyof` 会把一个对象类型的键，提取成联合类型。

这件事看似简单，但实际非常有价值。因为你终于能表达“这里只允许传对象中真实存在的字段名”，而不是一个宽泛的 `string`。

## 一个典型用途：限制键名输入

```ts
function getValue(user: User, key: keyof User) {
  return user[key];
}
```

现在调用时：

```ts
getValue(user, "name");
```

是合法的，但：

```ts
getValue(user, "email");
```

就会直接报错。

这类约束在表单字段读取、排序字段选择、配置键名传递、表格列定义里都很常见。你能明显感受到，`keyof` 不是为了让语法更复杂，而是为了把“合法键”这件事真正交给类型系统检查。

## `typeof`：从值反推出类型

在 JavaScript 里，`typeof` 是运行时运算符；在 TypeScript 的类型上下文里，`typeof` 可以把一个已有值的类型提取出来。

```ts
const config = {
  apiBase: "/api",
  timeout: 5000
};

type Config = typeof config;
```

这里的 `Config` 等价于：

```ts
{
  apiBase: string;
  timeout: number;
}
```

这个能力非常实用，尤其在这些场景里：

- 配置对象
- 常量映射表
- 路由定义
- 权限字典
- 状态常量

它能避免你一边写运行时值，一边手写一份重复类型。

## 从“手写两份”到“值和类型共享一份来源”

这是 `typeof` 最值得学的地方。很多初学者一开始会这样写：

```ts
type Config = {
  apiBase: string;
  timeout: number;
};

const config: Config = {
  apiBase: "/api",
  timeout: 5000
};
```

这当然没错。但如果很多场景里值本身已经是事实来源，那么反过来从值推导类型，往往更省重复：

```ts
const config = {
  apiBase: "/api",
  timeout: 5000
};

type Config = typeof config;
```

这种思路在大型代码库里很有价值，因为它减少了“改了值，却忘了同步改类型”的机会。

## 索引访问类型：从一个类型里拿出局部信息

```ts
type UserName = User["name"];
```

这里 `UserName` 会得到 `string`。这就叫索引访问类型。你可以把它理解成“在类型层面做属性访问”。

它不止能取单个属性：

```ts
type UserValue = User[keyof User];
```

这表示 `User` 所有属性值类型的联合，也就是：

```ts
number | string | boolean
```

到了这里，你应该开始感受到一个重要变化：TypeScript 类型系统正在变得更像一种可组合、可推导的语言，而不是简单注解。

## 三者组合起来，才是最有威力的地方

单独看 `keyof`、`typeof`、索引访问类型，都不算难。真正让它们变强的是组合。

看一个经典工具函数：

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

这段代码同时用到了：

- `T`：对象类型
- `K extends keyof T`：键必须来自对象真实键集合
- `T[K]`：返回值自动对应当前键的属性类型

调用时：

```ts
const user = { id: 1, name: "Alice" };
const name = pick(user, "name");
```

此时 `name` 会被推断成 `string`，而不是 `any`，也不是 `string | number`。

这类写法，是你后面看很多工具库源码时的基础。

## `as const` 会让这套能力更精确

看下面这个例子：

```ts
const STATUS = {
  PENDING: "pending",
  DONE: "done"
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
```

为什么这里要加 `as const`？因为如果不加，TypeScript 可能会把值推宽成 `string`；加上之后，值会被锁定为字面量类型 `"pending"` 和 `"done"`。

于是 `Status` 最终得到的不是普通 `string`，而是：

```ts
"pending" | "done"
```

这正是现代 TypeScript 中“对象常量 + 字面量联合”这种模式的基础。

## 一个特别实用的工程模式

假设你有一组表单字段定义：

```ts
const fields = {
  username: "用户名",
  email: "邮箱",
  phone: "手机号"
} as const;

type FieldName = keyof typeof fields;
```

现在 `FieldName` 自动变成：

```ts
"username" | "email" | "phone"
```

你后面无论写表单校验器、错误对象、字段权限配置，都可以直接围绕这一份定义衍生，而不用手写第二份字段联合类型。

## 为什么这一步会让你感觉 TypeScript 突然变强了

因为你开始进入一种新的写法：不再机械地手写所有类型，而是让类型系统从已有结构中“拿信息”“做推导”“自动保持同步”。

这背后的思路非常重要：

- 用值定义事实
- 用 `typeof` 从事实中提取类型
- 用 `keyof` 获取合法键集合
- 用索引访问类型提取局部类型

一旦你习惯这套思路，后面的映射类型、工具类型、条件类型都会顺很多。

## 常见误区

### 误区一：`keyof` 只是拿个键名，感觉没什么用

单独看确实简单，但一旦和泛型、索引访问类型结合，它就能让工具函数变得非常精确。

### 误区二：`typeof` 只会拿到宽泛类型

如果你配合 `as const` 使用，`typeof` 的结果会精确很多，尤其适合常量映射表。

### 误区三：值和类型各写一套

这在小项目里问题不大，但在长期维护中很容易不同步。能共用来源时，尽量别手写两份事实。

## 本文小结

`keyof` 让你获得对象的合法键集合，`typeof` 让你从已有值中提取类型，索引访问类型则让你可以进一步从类型中拿出局部结构。它们组合起来，构成了 TypeScript 中非常核心的一种写法：让值和类型互相联动，减少重复，提升精确度。

你如果能真正掌握这一层，后面再看 `Partial`、`Pick`、`Record`、条件类型这些工具，就不会觉得它们是凭空出现的魔法，而会知道它们其实都建立在同样的推导思路之上。

## 练习

1. 定义一个 `Settings` 接口，用 `keyof` 拿到所有键，并将它用于一个只允许传合法配置项名称的函数。
2. 定义一个配置对象，用 `typeof` 推导它的类型，再尝试修改值结构并观察类型如何同步变化。
3. 写一个泛型函数，只允许读取对象中存在的键，并让返回值类型自动跟随键变化。
