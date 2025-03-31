# LeetCode 160: 相交链表 - 可视化教程

## 在线演示

🚀 **[在线查看演示](https://fuck-algorithm.github.io/leetcode-160-intersection-of-two-linked-lists/)**

这个交互式可视化工具可以帮助你理解 LeetCode 第 160 题 "相交链表" 的解题思路和实现过程。

![相交链表示例图](https://assets.leetcode.com/uploads/2021/03/05/160_statement.png)

## 📖 问题描述

给你两个单链表的头节点 `headA` 和 `headB`，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null`。

题目数据保证整个链式结构中不存在环。

## 🔍 解题思路

本可视化工具展示了解决此问题的"双指针"方法：

### 双指针解法 (O(m+n) 时间, O(1) 空间)

这是一种优雅的解法，无需额外空间：

1. 创建两个指针 `pA` 和 `pB`，分别指向链表 A 和链表 B 的头节点
2. 同时遍历两个链表，当一个指针到达链表末尾时，将其重定向到另一个链表的头部
3. 如果两个链表相交，两个指针最终会在相交点相遇
4. 如果两个链表不相交，两个指针最终都会变为 `null`

### 数学原理

- 如果两个链表有相交，设链表 A 相交前长度为 a，链表 B 相交前长度为 b，相交部分长度为 c
- 指针 pA 走完路径: a + c + b
- 指针 pB 走完路径: b + c + a
- 由于两个路径长度相同，且都会经过相交点，两指针必会相遇

## ✨ 应用功能

- **交互式可视化**：通过动画直观展示算法的执行过程
- **步骤控制**：
  - 单步执行（前进/后退）
  - 连续自动执行
  - 执行速度/延迟调整
- **键盘快捷键**：
  - ← 上一步
  - → 下一步
  - 空格键 暂停/连续执行
- **自定义示例**：创建自己的链表示例以测试算法
- **多标签页**：
  - 算法可视化
  - 题目详细描述
  - 解题代码展示

## 🚀 本地开发

```bash
# 克隆仓库
git clone https://github.com/fuck-algorithm/leetcode-160-intersection-of-two-linked-lists.git
cd leetcode-160-intersection-of-two-linked-lists

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 🔧 部署到 GitHub Pages

```bash
npm run deploy
```

## 🛠️ 技术栈

- React + TypeScript
- D3.js (可视化)
- CSS3 (动画和样式)
- GitHub Pages (部署)

## 📚 学习资源

- [LeetCode 原题](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/)
- [相关文章和讲解]() - 待添加

## 📝 贡献指南

欢迎提交 Issues 和 Pull Requests 来改进这个项目！

## 📄 许可证

MIT 