# TOKENS — 设计 token 与样式规则

> **feature 文档 · 规范类 + 功能开发**。
> **管理 scope**：`styles/tokens.css` 的 `@theme` 变量（颜色、字体、字号阶梯、圆角、阴影、容器宽）、语义命名规则、魔法值禁令、`min-w-0` 使用边界、不引第三方 UI 库的约束、字体接入方式。改任何颜色 / 字号 / 间距的来源先改这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §5.3「样式规范」 迁出。PROJECT.md 只保留 §3.2 索引与 §3.1 口供；本文与口供冲突时先改口供。

---

## 一、目标

甲方把 design tokens 交给我们自决（§1）。口供（PROJECT §3.1）定的是：Tailwind v4 `@theme` CSS 变量，**语义命名**，禁止按色值命名。本文是这条口供的落地规则；token 真值来自 Figma 变量表与 `get_design_context`（PROJECT §0.1），由 `monet` 在 `ai/design_system/design-system.md` 维护色板与字体，这里只管「怎么写进代码」。

## 二、样式规范

P4 补充控件语义角色：48/56px 按钮、52px 输入框、32/40px 内嵌图标圈、24px glyph、20px radio、32px 控件横内距、12px chip 纵内距、6px segmented 纵内距、16/14px 控件文字、FAQ 16→24px 内距与 4px 分隔、SegmentedControl 0.5px 边框 / 4.5px 内衬 / 4px 间距 / 42px 选项高 / 83px 最小宽；均集中到 tokens.css。`--border-width` / `--disabled-opacity` 表达统一状态，`--dur-marquee: 30s` 为可选持续循环周期，不属于普通 UI 的 300ms 上限。运行时测得的 accordion 高度与 marquee 轨道宽度不是新设计 token。

1. 颜色、字号、间距、圆角、阴影只能引用 `@theme` token；出现魔法值（`#1f3a2a`、`text-[17px]`）视为缺陷。
2. 断点只允许三个语义名（见 RESPONSIVE.md），禁止散落的任意 `min-[900px]`。
3. `min-w-0` 是泄压阀不是默认值：只在被压穿的 flex 子项上加，并注释为什么。
4. 不引 UI 组件库（shadcn/Radix 亦不引）——原语是评分对象，要自己写；手风琴用原生 `<details>`。

## 三、token 文件约定

- 唯一文件：`styles/tokens.css`，由 `app/globals.css` `@import`；`@theme` 块内按 颜色 → 字体 → 字号 → 间距 → 圆角 → 阴影 → 容器 分组，每组一行注释（英文）
- 命名：`--color-<role>[-<variant>]`（`--color-brand`、`--color-surface-mint`、`--color-text-muted`）；`--font-<role>`；`--text-<step>` 字号用 `clamp()`，两端锚点 = 375 稿值 / 1440 稿值（RESPONSIVE.md）
- 字体：`next/font/google`，字体名从 Figma Dev Mode 读（SELFCHECK.md §二 #3 已接受离线构建风险）
- 动效 token 不在本文，见 MOTION.md
- Tailwind 扫描范围：`app/globals.css` 用 `source(none)` 关闭全仓自动扫描，仅登记 `app/`、`components/` 与 `.storybook/`。设计快照、技能、日志与文档中的 class 示例不是页面源码；以后新增 UI 源目录时必须补 `@source`。P3 引入 tokens.css 时保留这些扫描指令。

## 四、待实现 / 已知问题

- P1 读稿已完成：[design-system.md](../design_system/design-system.md) 维护 75 项原始定义的语义映射、主要字号两端值、间距 / 圆角 / 阴影与来源。主字体为 Work Sans 400/500，Syne 仅用于聊天示意；样式名 Bold/Semibold 不代表实际字重。C-10 已敲定：新增 `--color-text-benefit: var(--color-accent)`，保留亮绿装饰色；P5 Hero 使用后再验收，当前不标完成。
- 未精读的桌面实例局部值（如 FinalCta 字号）明确标注 P5 核值，不伪装已测参数；核心 token 表可供 P3 落地。
- `npm run check:tokens` 已落地：扫描 app/components/lib/styles/.storybook，仅 tokens.css 允许字面颜色；检查色值、颜色函数、任意长度 utility、非 sm/lg/xl 断点和非语义常见色类。忽略注释和 JSX href/src，设计快照不扫描。它不是全部 CSS 语义的静态证明，布局与视觉仍需人工验收。

## 实现计划

进度：3 / 3 subtasks 完成（100%）

- [x] ST-1: 已保存变量表、4 个桌面复合节点 context、额外移动全页 context 与 3 张底图；Monet 的 `design-system.md` 与 UI 总览 / 交互草案已建立（2026-09-17）
- [x] ST-2: `styles/tokens.css` 落地 + `globals.css` 引入 + `next/font/google` 接入
- [x] ST-3: 魔法值机检脚本或 lint 规则（与 SELFCHECK 协同）

## 测试记录

- 2026-09-17：P1 对照节点属性与截图，核实 Work Sans 400/500、聊天示意 Syne、Hero 36→72px、产品 / FAQ 标题 32→52px；5 条 clamp 公式以 375 / 1440 锚点核验。源色对比度计算发现 Hero 亮绿小字 2.87:1，登记候选 #10；不是运行时 a11y 通过。

- 2026-09-17：P2.1 构建发现 BUG #14（设计快照 / 日志污染 Tailwind 扫描）。`source(none)` + 三个 UI 目录修复后生产 / Storybook 构建通过，21 条 CSS 解析警告消失；生产 CSS 43,535 → 7,967 bytes，实测 antialiased 保留、Figma 1320px 类与转义变量不再进入产物。此修复不代表 TOKENS ST-2 已完成。

- 2026-09-17：ST-2/3 完成。`globals.css` 仅保留 Tailwind/token import 与 UI 源扫描；Work Sans 400/500、Syne 400/500 在 next/font 与 Storybook 共用配置。移除脚手架暗色与 Arial 默认，保留源稿亮绿 C-10。`check:tokens` 零违规，含拒绝魔法值 / 允许语义值的测试。Chromium Foundations story 实测 375/1440 的 Hero 36/72、Section 32/52、Service 20/24、Body 16/20、FAQ 16/18px；字体实际加载、页边距 20/60px，1920 容器 1440px。375/1440 截图同 agent 自审通过，非全页像素验收。
