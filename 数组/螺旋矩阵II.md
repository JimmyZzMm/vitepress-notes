# 59.螺旋矩阵II

[力扣题目链接(opens new window)](https://leetcode.cn/problems/spiral-matrix-ii/)

给定一个正整数 n，生成一个包含 1 到 n^2 所有元素，且元素按顺时针顺序螺旋排列的正方形矩阵。

示例:

输入: 3 输出: [ [ 1, 2, 3 ], [ 8, 9, 4 ], [ 7, 6, 5 ] ]

## 思路

四个指针left，right，top，bottom。依次遍历，注意遍历完上一个，要把下一个的起始位置进行移动

## 代码

```js
/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function (n) {
    let matrix = Array.from({ length: n }, () => Array(n))
    let left = 0
    let right = n - 1
    let top = 0
    let bottom = n - 1
    let number = 1
    while (number <= n * n) {
        for (let i = left; i <= right; i++, number++) {
            matrix[top][i] = number
        }
        top++
        for (let i = top; i <= bottom; i++, number++) {
            matrix[i][right] = number
        }
        right--
        for (let i = right; i >= left; i--, number++) {
            matrix[bottom][i] = number
        }
        bottom--
        for (let i = bottom; i >= top; i--, number++) {
            matrix[i][left] = number
        }
        left++
    }
    return matrix

};
```

