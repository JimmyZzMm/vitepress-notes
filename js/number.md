JavaScript 中的浮点数遵循 IEEE 754 标准，使用 64 位双精度格式。在这种格式中，最大的安全整数是 2^53 - 1，即 9007199254740991。这个值被定义为 Number.MAX_SAFE_INTEGER。

在 JavaScript 中，数字使用 IEEE 754 双精度浮点格式表示，这意味着每个数字占用 64 位。这 64 位分成三个部分：1 位符号位（用于表示正负），11 位指数位（用于表示数字的范围），以及 52 位小数位（或称为尾数位，用于表示数字的精度）。