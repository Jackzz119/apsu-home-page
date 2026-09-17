# MOTION — 交互态与动效

> **feature 文档 · 规范类 + 功能开发**。
> **管理 scope**：全站交互状态（hover / focus-visible / pressed / disabled）的统一规则、动效 token（时长、easing、reduced-motion）、`motion` 库的使用边界、D 类自设计状态的清单来源。改任何过渡、动画、状态样式先改这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §5.5「交互态与动效规范」 迁出。PROJECT.md 只保留 §3.4 索引与 §3.3 口供；本文与口供冲突时先改口供。
> 开发方式：作为独立功能开发，届时拉入 `emil-design-eng` 技能（参照仓 hyber-operator-portal `ai/jaSkill/emil-design-eng/`，或货架上架后 `shelf pull`）对整站 motion 统一设计与审校。

---

## 一、目标

甲方 §4D：每个可交互元素都要有 hover / focus / pressed 状态与过渡动画；稿子没画 hover，由我们设计；**一致与克制比数量重要**；自设计状态要列进 README。本文是那份清单的规则来源，`docs/deviations.md` 的 D 类条目逐条引用这里的规则号。

## 二、交互态与动效规范

**token（`lib/motion.ts` + `tokens.css`）**

| token | 值 | 用途 |
|---|---|---|
| `--dur-fast` | 150ms | 颜色、透明度、小位移 |
| `--dur-base` | 200ms | 抬起、缩放、箭头位移 |
| `--dur-slow` | 300ms | 高度展开、抽屉、轮播 |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | 所有进场与状态切换 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 离场，且离场时长取进场的 0.75 |

**状态规则（每条都要在 deviations D 类里登记）**

1. hover：按钮背景加深/提亮一级，右箭头 `translateX(2px)`；卡片 `translateY(-2px)` + 阴影升一级；chip 底色切薄荷。
2. focus-visible：全站统一 2px 强调色外环 + 2px offset，禁止 `outline: none` 不配替代。
3. active/pressed：`scale(0.98)`，`--dur-fast`。
4. disabled：`opacity .5` + `cursor-not-allowed`，且保留在 tab 序列外。
5. 首/末位轮播箭头 disabled；跑马灯 hover 暂停。
6. `prefers-reduced-motion: reduce` 时所有 transition/animation 归零，`motion` 组件走 `useReducedMotion`。
7. **禁止**：弹跳、overshoot、超过 300ms 的过渡、进场 scale 起点小于 0.96、视差。

## 三、与其他文档的关系

- token 落地文件：`lib/motion.ts`（JS 侧时长 / easing / `useReducedMotion`）与 `styles/tokens.css`（CSS 变量），文件位置见 STRUCTURE.md §三
- 每条状态规则实现后在 `docs/deviations.md` 登记 D-xx，README「Interaction states & motion」节链接过去（PROJECT §6、§10）
- Storybook 用 `pseudo-states` 固化 hover / focus / active 供考官逐态走查，见 STORYBOOK.md

## 四、待实现 / 已知问题

- `emil-design-eng` 技能尚未拉入 `ai/jaSkills/`
- token 尚未落地；Figma 稿无 hover 设计，全部状态为 D 类自设计

## 实现计划

进度：0 / 4 subtasks 完成（0%）

- [ ] ST-1: 拉入 `emil-design-eng` 技能并在 `ai/JASKILL.md` 登记
- [ ] ST-2: `lib/motion.ts` + `tokens.css` 动效 token 落地（§二 token 表）
- [ ] ST-3: 原语组件逐个套用状态规则 1–7，每个组件一条 `style(motion)` commit，同步登记 D-xx
- [ ] ST-4: `prefers-reduced-motion` 全站验证 + 跑马灯 / 轮播 / 抽屉三处 `motion` 组件复核

## 测试记录

（空）
