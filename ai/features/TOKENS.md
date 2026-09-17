# TOKENS — 设计 token 与样式规则

> **feature 文档 · 规范类 + 功能开发**。
> **管理 scope**：`styles/tokens.css` 的 `@theme` 变量（颜色、字体、字号阶梯、圆角、阴影、容器宽）、语义命名规则、魔法值禁令、`min-w-0` 使用边界、不引第三方 UI 库的约束、字体接入方式。改任何颜色 / 字号 / 间距的来源先改这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §5.3「样式规范」 迁出。PROJECT.md 只保留 §3.2 索引与 §3.1 口供；本文与口供冲突时先改口供。

---

## 一、目标

甲方把 design tokens 交给我们自决（§1）。口供（PROJECT §3.1）定的是：Tailwind v4 `@theme` CSS 变量，**语义命名**，禁止按色值命名。本文是这条口供的落地规则；token 真值来自 Figma 变量表与 `get_design_context`（PROJECT §0.1），由 `monet` 在 `ai/design_system/design-system.md` 维护色板与字体，这里只管「怎么写进代码」。

## 二、样式规范

1. 颜色、字号、间距、圆角、阴影只能引用 `@theme` token；出现魔法值（`#1f3a2a`、`text-[17px]`）视为缺陷。
2. 断点只允许三个语义名（见 RESPONSIVE.md），禁止散落的任意 `min-[900px]`。
3. `min-w-0` 是泄压阀不是默认值：只在被压穿的 flex 子项上加，并注释为什么。
4. 不引 UI 组件库（shadcn/Radix 亦不引）——原语是评分对象，要自己写；手风琴用原生 `<details>`。

## 三、token 文件约定

- 唯一文件：`styles/tokens.css`，由 `app/globals.css` `@import`；`@theme` 块内按 颜色 → 字体 → 字号 → 间距 → 圆角 → 阴影 → 容器 分组，每组一行注释（英文）
- 命名：`--color-<role>[-<variant>]`（`--color-brand`、`--color-surface-mint`、`--color-text-muted`）；`--font-<role>`；`--text-<step>` 字号用 `clamp()`，两端锚点 = 375 稿值 / 1440 稿值（RESPONSIVE.md）
- 字体：`next/font/google`，字体名从 Figma Dev Mode 读（SELFCHECK.md §二 #3 已接受离线构建风险）
- 动效 token 不在本文，见 MOTION.md

## 四、待实现 / 已知问题

- Figma 变量表尚未拉取（TODO P1.1）；字体名、色板、字号阶梯待读稿
- 「无魔法值」需要一个机检手段（grep `#[0-9a-f]{3,6}` / `\[\d+px\]` 或 ESLint 规则），归 SELFCHECK

## 实现计划

进度：0 / 3 subtasks 完成（0%）

- [ ] ST-1: 拉 Figma 变量表与 4 个复合节点的 design context，由 monet 写 `design-system.md` 色板 / 字体 / 字号阶梯
- [ ] ST-2: `styles/tokens.css` 落地 + `globals.css` 引入 + `next/font/google` 接入
- [ ] ST-3: 魔法值机检脚本或 lint 规则（与 SELFCHECK 协同）

## 测试记录

（空）
