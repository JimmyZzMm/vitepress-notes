# 谈谈 JavaScript 中的类型转换机制

**1. 隐式类型转换**：在隐式类型转换中，JS 引擎自动地将一种数据类型转换为另一种类型，通常发生在运算或比较的过程中。这种转换是隐式的，开发者不需要明确地进行操作，而是由 JS 引擎在必要的时候自动完成。

**2. 显式类型转换**：显式类型转换是由开发者明确指定的类型转换，通过调用相应的转换函数或使用一些特定的语法进行。这种转换是开发者有意识地进行的，用于确保数据在特定上下文中具有期望的类型。

## 布尔值

- `false`、`0`、`''`、`null`、`undefined`以及`NaN`转换为`false`
- 其他所有值转换为`true`

## 数字

- 如果是数字字符串，则转换为对应的数字，空字符串为0。
- 如果是非数字字符串或无法解析为数字的字符串，则转换为 `NaN`。
- 布尔值 `true` 被转换为 `1`，`false` 被转换为 `0`。
- `null` 被转换为 `0`。
- `undefined` 被转换为 `NaN`。

## 字符串

空值或没有提供参数时，返回空字符串。

数字转字符串：直接将数字转换为对应的字符串形式。

`NaN` 被转换为字符串 `'NaN'`。

布尔值转字符串：`true` 转换为 `"true"`，`false` 转换为 `"false"`。

`null` 转换为字符串 `"null"`。

`undefined` 转换为 `"undefined"`。

## 对象

- 转换为bool时：永远为true
- 转换为number时：会先调用ToPrimitive(obj, Number)，然后转换为Number
- 转换为String时：会先调用ToPrimitive(obj, String)，然后转换为String



## ToPrimitive(obj, Number)的执行步骤（如果是String则先调用toString）：

1. **如果 `obj` 是基本类型：**
   - 如果 `obj` 已经是基本类型（例如数字、字符串、布尔值等），那么直接返回 `obj`。
2. **否则，调用 `valueOf` 方法：**
   - 如果 `obj` 不是基本类型，即它是一个对象，首先会尝试调用 `valueOf` 方法。
   - 如果 `valueOf` 方法存在并返回一个原始值，那么返回这个原始值。
3. **否则，调用 `toString` 方法：**
   - 如果 `valueOf` 方法不存在，或者它返回的仍然是一个对象，那么接下来会调用 `toString` 方法。
   - 如果 `toString` 方法存在并返回一个原始值，那么返回这个原始值。
4. **否则，报错：**
   - 如果 `toString` 方法也不存在，或者它返回的仍然是一个对象，那么就无法将对象转换为原始值，此时会抛出一个错误。

## 隐式转换

### 一元运算 `+ a`：

相当于Number(a)

### 二元运算 `a + b`:

lprim + rprim == ToPrimitive(v1) + ToPrimitive(v2)

1. 当 + 两边有一个是字符串，则按字符串进行拼接
2. 否则，转到 number 进行计算

## 参考文献

https://juejin.cn/post/7307857937699405862?searchId=20240219171917F03CA0C0F5F4DD0B021E#heading-1

https://zhuanlan.zhihu.com/p/21650547