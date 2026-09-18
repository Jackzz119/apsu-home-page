# STORYBOOK — Storybook 与状态走查

> **feature 文档 · 规范类 + 功能开发**。
> **管理 scope**：Storybook 配置（`.storybook/`）、story 编写规则（一态一 story、命名、数据来源）、viewport 预设、pseudo-states 与 a11y addon 策略、`npm run storybook` / `build-storybook` 的可复现性。加 story 规则或改 Storybook 配置先改这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §5.6「Storybook 规范」 迁出。PROJECT.md 只保留 §3.4 索引与 §3.3 口供；本文与口供冲突时先改口供。

---

## 一、目标

甲方 §4E：每个有状态组件每个状态一个 story，考官逐个点。`npm run storybook` 是四条考官命令之一，必须在干净 clone 上直接起。

## 二、Storybook 规范

1. 每个 `ui/` 原语与每个 client 区块必有 `*.stories.tsx`，与组件同目录。
2. **一态一 story，story 名 = 状态名**：`Default` / `Hover` / `Focus` / `Pressed` / `Disabled` / `Loading`…；hover/focus/active 用 `pseudo-states` 固化，不靠鼠标。
3. 数据从 `content/mocks` 取，不在 story 里再造一份文案。
4. 全局 viewport 预设两块板：`mobile-375`、`desktop-1440`。
5. `a11y` addon 违规 = 阻塞，不允许 disable 规则。

## 三、当前配置（2026-09-16 脚手架状态）

- 版本：`storybook` `@storybook/nextjs-vite` `@storybook/addon-a11y` `storybook-addon-pseudo-states` 四包 10.6.0，`vite` 8.3.0（版本真源 STRUCTURE.md §二）
- `.storybook/main.ts`：stories 只扫 `components/**` 与 `app/**` 的 `*.stories.@(ts|tsx)`，无独立 `stories/` 目录；addons 只有 a11y 与 pseudo-states；`staticDirs: ["../public"]`
- `.storybook/preview.tsx`：引入 `app/globals.css`；viewport 预设 `mobile-375`（375×812）与 `desktop-1440`（1440×900）；`a11y.test = "error"`
- `storybook init` 默认塞的 chromatic / addon-vitest / addon-docs / addon-mcp / 示例 stories 已移除（理由见 STRUCTURE.md §二 实际初始化记录）
- 零 story 时 `build-storybook` 仍通过（2026-09-16 实测）

## 四、待实现 / 已知问题

- 现有 80 stories：Foundations 1 + P4 原语 79（含 Overview）；逐组件数量见 COMPONENTS.md 测试记录。六个 client 区块仍待 P5。
- Hover / Focus / Pressed 使用 pseudo-states 固化；真实键盘 / 点击 / 反向测试由 `tests/primitives.spec.ts` 负责。
- 是否需要 `addon-docs` 生成组件文档页：暂不加，考官走的是状态不是文档

## 实现计划

进度：1 / 3 subtasks 完成（33%）；ST-2 的原语部分与 ST-3 的 P4 a11y 部分完成，区块 / CI 未完成

- [x] ST-1: 第一个原语 Button 的 `Button.stories.tsx` 走通：Default / Hover / Focus / Pressed / Disabled 五态 + 两块板 viewport
- [ ] ST-2: 其余 ui/ 原语与 6 个 client 区块的 stories（随 COMPONENTS 的 ST-2 / ST-3 同步）
- [ ] ST-3: a11y 零违规复核 + `build-storybook` 进 SELFCHECK 的 CI 链

## 测试记录

- 2026-09-16：`npm run build-storybook` 通过（零 story）

- 2026-09-17：80 stories 的开发 / 静态构建均可运行；79 原语 stories × 375 / 1440 使用 axe-core 4.13.0 全规则扫描，零违规、无横溢出。addon 继续 `test: "error"`，没有禁用规则。独立扫描临时隔离自己的 axe 实例并恢复 addon 全局实例，避免两次并发扫描的 “Axe is already running”；不跳过任何状态。`npm run test:ui` 为 18 项浏览器测试。
