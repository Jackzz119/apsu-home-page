# TODO

> 未完成任务的唯一清单；当前架构与规则见 [PROJECT.md](PROJECT.md)，实施细节见对应 feature。
> 最后更新：2026-09-16。`[ ]` 待办 · `[~]` 进行中 / 封存 · `[!]` 依赖外部。已完成交付历史不在此累积。

## Epics & Milestones

- [~] M0 · 工程初始化：脚手架、依赖锁版、Storybook、lint / typecheck 三绿（2026-09-16 完成骨架；剩余项见下）
- [ ] M1 · 数据契约：`content/schema.ts` + `content/mocks/home.ts` + `lib/api/home.ts` + `app/api/home/route.ts`（PROJECT §5.2）
- [ ] M2 · 原语组件 `components/ui/` + 每态一 story（PROJECT §5.1 / §5.6）
- [ ] M3 · 14 个首页区块 `components/sections/`，375 / 1440 逐区块对照 Figma（PROJECT §5.4 保真线）
- [ ] M4 · 响应式门禁 `check:responsive` 11 宽度扫描 + `docs/responsive-report.md`
- [ ] M5 · README §10 清单全勾、`docs/deviations.md`、`ai-logs/` final sync

## 当前待办

- [ ] M0 剩余：`package.json#scripts` 补 `test` `check:responsive` `sync:ai-logs`（PROJECT §9）
- [ ] M0 剩余：`scripts/sync-ai-logs.sh`（PROJECT §8.4）与 `ai-logs/README.md` 索引
- [ ] M0 剩余：GitHub Actions `ubuntu-latest` 跑 `npm ci && build && lint && build-storybook`（PROJECT §3.2 #6）
- [ ] M0 剩余：`.prettierrc`（含 `prettier-plugin-tailwindcss`）与 ESLint `no-console` 规则（PROJECT §5.8）
- [ ] M0 剩余：`.env.example`（PROJECT §3.2 #8）
- [ ] 清掉脚手架占位页 `app/page.tsx` 与 `public/*.svg`，换成 `styles/tokens.css` 起步
- [ ] 从 Figma Dev Mode 读字体名、色板、字号阶梯，落 `@theme` token
- [ ] 逐条确认 PROJECT §6 提到的 19 条偏差候选，登记进 `docs/deviations.md`
- [ ] 首次触发 `monet` / `ui-tailor`，建 `ai/design_system/`

## Bugs

## 待澄清想法

- PROJECT §11 四条待拍板：证言卡社交图标、导航产品项目标、本文档语言、`docs/plan.md`
- `next dev` 会把 `nextjs-agent-rules` 标记块写回根 `AGENTS.md`，而 `AGENTS.md` 由货架托管（`shelf sync` 会报"本地领先"）。要决定：接受该块并推上货架 / 每次手删 / 让 Next 不生成

## 封存
