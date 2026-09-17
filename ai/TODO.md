# TODO

> 未完成任务的唯一清单；当前架构与规则见 [PROJECT.md](PROJECT.md)，实施细节见对应 feature。
> 最后更新：2026-09-17。`[ ]` 待办 · `[~]` 进行中 / 封存 · `[!]` 依赖外部。已完成交付历史不在此累积。

## Epics & Milestones

- [~] M0 · 工程初始化：脚手架、依赖锁版、Storybook、lint / typecheck 三绿（2026-09-16 完成骨架；剩余项见下）
- [ ] M1 · 数据契约：`content/schema.ts` + `content/mocks/home.ts` + `lib/api/home.ts` + `app/api/home/route.ts`（PROJECT §5.2）
- [ ] M2 · 原语组件 `components/ui/` + 每态一 story（PROJECT §5.1 / §5.6）
- [ ] M3 · 14 个首页区块 `components/sections/`，375 / 1440 逐区块对照 Figma（PROJECT §5.4 保真线）
- [ ] M4 · 响应式门禁 `check:responsive` 11 宽度扫描 + `docs/responsive-report.md`
- [ ] M5 · 验收测试：把甲方 Assignment 的每条可机检要求写成自动化测试（Playwright 为主，vitest 补 schema），代码层面证明通过——§1 lockfile 已提交、§4B 320–1920 无横滚 / 导航不换行 / 无重叠裁切、§4D 每个交互元素有 hover / focus / pressed、§4E 每个有状态组件的每个状态有 story、§5 README 含 AI 工具与 deviation 两节、§6 `ai-logs/` 存在且非空。是否进 CI 到时由 Claude 定（倾向进，作为「考官环境能跑」的证据）
- [ ] M6 · README §10 清单全勾、`docs/deviations.md`、`ai-logs/` final sync

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

## 缺陷 / 偏差候选（PROJECT §0.0 第 5 条：先记这里，动手修时搬入 `docs/deviations.md` 编号）

- [ ] 移动板（`2002:3679`）没有 Weight Loss 区块；其移动版以 335 宽游离组 `2002:4113` 放在画板外，第三块 `2002:4155` 无任何文字。处理：按桌面 `2002:3307` 的内容补进移动板对应位置（How it works 之后），登记 C 类。**放到开发后期做**
- [ ] 文案品牌名前后不一致：多处正文写「Health Harbor provided excep…」，项目是 Apsu，疑为占位文案未替换。处理待定：统一改 Apsu 并登记 C 类，或按原文保留
- [ ] 桌面信任条（`2002:3214`：50 States / Discreet Shipping / 24/7 AI Care…）在移动板是否存在待核，可能并入了移动 Hero `2002:3680`

## Bugs

## 待澄清想法

- PROJECT §11 四条待拍板：证言卡社交图标、导航产品项目标、本文档语言、`docs/plan.md`
- `next dev` 会把 `nextjs-agent-rules` 标记块写回根 `AGENTS.md`，而 `AGENTS.md` 由货架托管（`shelf sync` 会报"本地领先"）。要决定：接受该块并推上货架 / 每次手删 / 让 Next 不生成

## 封存
