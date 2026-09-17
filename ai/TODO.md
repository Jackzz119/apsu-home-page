# TODO

> 未完成任务的唯一清单；规则与口供见 [PROJECT.md](PROJECT.md)，分领域规范见 PROJECT §3.2 索引的 feature 文档。
> 最后更新：2026-09-17。`[ ]` 待办 · `[~]` 进行中 · `[!]` 依赖外部 · `[x]` 阶段内已完成（阶段收口后清掉，不累积历史）。
> 结构：阶段 P0 → P8 顺序推进，每阶段有「完成判据」。步骤后括号里的 `XXX ST-n` 指对应 feature 文档的 subtask，实现细节在那边，这里只写做什么、做完算什么。

## 总览

```
P0 工程收口 ──┐
              ├─→ P2 数据契约 ─┐
P1 设计读取 ──┤               ├─→ P4 组件库原语 ─→ P5 首页区块 ─→ P6 响应式门禁 ─→ P7 验收测试与 CI ─→ P8 交付收尾
              └─→ P3 设计 token ┘
```

- P0 与 P1 可并行；P2 要 P1 的区块清单；P3 要 P1 的变量表；P4 要 P3；P5 要 P2 + P4；P6 随 P5 每区块跑；P7 要 P5 全部；P8 最后。
- 每个阶段收口时：feature 文档的 ST 打勾、进度百分比更新、PROJECT §9 门禁对应行过、本文该阶段 `[x]` 清掉并在「当前状态」写一行。

## Epics & Milestones

- [~] P0 · 工程收口
- [~] P1 · 设计读取（Figma，P1.1 已完成）
- [ ] P2 · 数据契约
- [ ] P3 · 设计 token
- [ ] P4 · 组件库原语（`components/ui/`）
- [ ] P5 · 首页区块（`components/sections/`）+ 页面组装
- [ ] P6 · 响应式门禁
- [ ] P7 · 验收测试与 CI
- [ ] P8 · 交付收尾

---

## P0 · 工程收口

目标：干净 clone 上考官四条命令 + `typecheck` `lint` `format:check` `test` `build-storybook` 全绿，目录骨架就位，脚手架痕迹清零。

- [x] P0.1 目录骨架 + 清脚手架占位（STRUCTURE ST-1）：目录与空出口就位；五个脚手架 SVG 已删，首页仅渲染 `<main />`；改动文件格式检查及 typecheck / lint / build 通过（2026-09-17）
- [x] P0.2 scripts 补齐（STRUCTURE ST-2）：`test` 运行 Vitest，`check:responsive` 占位报「not implemented」并返回 1；两个入口均已实测（2026-09-17）
- [x] P0.3 vitest 配置 + 一个冒烟测试（SELFCHECK ST-2）：Node 环境，只扫 `tests/`、`content/` 的 `*.test.ts(x)`；首页服务端渲染冒烟测试通过，已实测排除 Storybook 与 `*.spec.ts`（2026-09-17）
- [x] P0.4 格式化与 lint 收口（STRUCTURE ST-3）：全量 format 无额外改动；项目 `no-console` 规则及共享技能 CLI 例外已落地并实测，format:check / typecheck / lint / test 全绿（2026-09-17）
- [x] P0.5 `.env.example`（SELFCHECK §二 #8）：仅含 `NEXT_PUBLIC_API_URL=` 与英文注释；解析与 Git 忽略规则均已验证，README 已说明当前尚未接入数据层（2026-09-17）
- [ ] P0.6 README 骨架：按 PROJECT §10 十个标题占位（英文），Node 版本段落已有
- [ ] P0.7 `next dev` 写回 `AGENTS.md` 的 `nextjs-agent-rules` 块怎么处理：接受并推货架 / 每次手删 / 关掉生成，定一个

完成判据：`npm ci && npm run format:check && npm run typecheck && npm run lint && npm run build && npm test && npm run build-storybook` 全绿；`git status` 干净；STRUCTURE §三 目录树里每个目录都存在。

## P1 · 设计读取（Figma，MCP 配额预算 ≤ 9 次，剩余额度见 PROJECT §0.1）

目标：拿到 token 真值、整板底图、14 区块清单与缺陷候选；建起 `ai/design_system/`。

- [x] P1.1 `get_variable_defs` 打桌面根 `2002:3098`（1 次）→ 75 项原始返回已存 `ai/design_system/figma/variables.json`（2026-09-17，Codex 连接验证时完成）
- [ ] P1.2 `get_screenshot` 桌面 `2002:3098`、移动 `2002:3679`、Menu `2002:4211`（3 次，`maxDimension` 拉满）→ `ai/design_system/figma/*.png`
- [ ] P1.3 `get_design_context` 4 个样式最密的复合节点（4 次）：Navbar+Hero `2002:3099`、套餐卡 `2002:3307`、Profile/BMI `2002:3439`、FAQ+Footer `2002:3667` → 返回码原样存 `ai/design_system/figma/context-<id>.md`，只当参考不直接用
- [ ] P1.4 触发 `monet` 建 `ai/design_system/design-system.md`：色板、字体、字号阶梯、圆角、阴影、间距 → 语义 token 名（TOKENS ST-1）
- [ ] P1.5 触发 `ui-tailor` 建 `ai/design_system/uiux/`：14 区块清单（桌面 / 移动节点 ID、server / client 判定、所用原语）、导航锚点映射、交互态方案草案（对应 MOTION §二 规则）
- [ ] P1.6 缺陷候选盘点：逐区块对照桌面 / 移动，补入下方「缺陷 / 偏差候选」
- [ ] P1.7 回填 COMPONENTS §四 sections 表与 ui 表（原语增减以清单为准）

完成判据：`design_system/` 三份文档齐；token 表可直接抄进 `tokens.css`；区块清单能一一对应 Figma 节点；配额用量记进 PROJECT §0.1。

## P2 · 数据契约

目标：考官打开 `content/schema.ts` 就能读懂整页数据；mock、页面、假后端说同一份契约。

- [ ] P2.1 `content/schema.ts`（DATACONTRACT ST-1）：`HomePage` 根 + 每区块子 schema，字段顺序 = 区块顺序，JSDoc 英文一句话；金额 / 图片 / 多形态按 DATACONTRACT §二 3–5 条
- [ ] P2.2 `content/mocks/home.ts` + vitest（DATACONTRACT ST-2）：文案逐字从 Figma 抄（含已知错字，修正走 deviations）；图片先用占位尺寸，P5 换真图
- [ ] P2.3 `lib/api/home.ts` 双分支 + `app/api/home/route.ts`（DATACONTRACT ST-3）

完成判据：`npm test` 通过 `HomePage.parse(homeMock)`；`npm run build` 不发 HTTP；`curl localhost:3000/api/home` 返回同一份 mock。

## P3 · 设计 token

- [ ] P3.1 `styles/tokens.css` `@theme`（TOKENS ST-2）：颜色 / 字体 / 字号 `clamp()` / 圆角 / 阴影 / 容器宽；`next/font/google` 接入
- [ ] P3.2 `lib/motion.ts` 动效 token（MOTION ST-2）
- [ ] P3.3 断点 `sm` / `lg` / `xl` 与容器规则落地（RESPONSIVE ST-1）
- [ ] P3.4 魔法值机检手段定下（TOKENS ST-3）

完成判据：`globals.css` 只 `@import` token 文件；Storybook 起来能看到字体加载；grep 不到十六进制色值。

## P4 · 组件库原语（`components/ui/`）

- [ ] P4.1 Button 走通全链路（COMPONENTS ST-1 + STORYBOOK ST-1 + MOTION ST-3 首例）：组件 → `index.ts` 导出 → 五态 story → `app/page.tsx` 从 `@/components` import 渲染一颗按钮 → D-01 / D-02 登记
- [ ] P4.2 其余原语逐个（COMPONENTS ST-2 / STORYBOOK ST-2）：Chip · Card · Accordion · Carousel · Marquee · NumberField · RadioGroup · SegmentedControl · Rating · IconButton，每个一条 `feat(ui)` commit，story 同 commit
- [ ] P4.3 a11y addon 零违规（A11Y ST-1）

完成判据：COMPONENTS §四 ui 表全「完成」；`npm run storybook` 逐态可点；`import { Button, … } from "@/components"` 在 page 里可用。

## P5 · 首页区块（`components/sections/`）+ 页面组装

按 Figma 桌面顶层帧预排，最终拆分以 P1.5 清单为准。client 组件只限白名单（COMPONENTS §三 第 1 条）。

- [ ] P5.1 Header + 移动抽屉 Menu（client）→ 顺手实测 `lg` 阈值回写 RESPONSIVE（RESPONSIVE ST-2）
- [ ] P5.2 Hero + LanguageMarquee（client）
- [ ] P5.3 信任条 TrustMarquee（client）
- [ ] P5.4 How it works
- [ ] P5.5 Weight Loss 套餐卡：桌面照稿，移动板按候选 #1 补做并登记 C 类
- [ ] P5.6 Birth control / Sleep / Your profile + BmiCalculator（client，`lib/bmi.ts` 纯函数）
- [ ] P5.7 Completely online（聊天示意）
- [ ] P5.8 Success Stories + Carousel（client）；社交图标按 PROJECT §11 #1 纯装饰
- [ ] P5.9 FAQ Accordion（client Faq，原生 `<details>`）
- [ ] P5.10 Footer / Final CTA
- [ ] P5.11 `app/page.tsx` 组装：`getHomePage()` 分发 + 导航锚点（PROJECT §11 #2）+ 一页一个 `h1`

每区块 DoD（PROJECT §9）：375 / 1440 逐项对照 Figma · story 存在 · 键盘走通 · `check:responsive` 绿 · deviations 登记 · 真图换入 `public/images/`。

## P6 · 响应式门禁

- [ ] P6.1 `scripts/check-responsive.ts`（SELFCHECK ST-1）：11 宽度三断言 + `docs/responsive-report.md`
- [ ] P6.2 全页 320–1920 扫描修复；README「Responsive strategy」三句：策略 / 表 / 图（RESPONSIVE ST-3）

完成判据：11 宽度全绿；报告表进 README。

## P7 · 验收测试与 CI

- [ ] P7.1 SELFCHECK §四 七条验收测试逐条落地（SELFCHECK ST-3）
- [ ] P7.2 CI 决定与 workflow（SELFCHECK ST-4）：`ubuntu-latest` 跑 `npm ci → format:check → typecheck → lint → build → build-storybook → test`，`check:responsive` 单独 job

完成判据：`npm test` 全绿；CI 徽章绿并贴 README。

## P8 · 交付收尾

- [ ] P8.1 `docs/deviations.md` 定稿：C 类 + D 类全，README「Deviation log」链接
- [ ] P8.2 README §10 十项逐条勾：Directory · Data layer · Design decisions（§3.1 口供英文版）· Responsive · Motion · Deviations · Storybook · AI usage（session id 对应）· Known limitations
- [ ] P8.3 ai-logs：最终 `sync:ai-logs` + `readable/` 导出 + `ai-logs/README.md` 索引补齐；`logs(ai-logs): final sync` 为最后一条 commit
- [ ] P8.4 `check:responsive --composite` 拍一次 11 宽度拼图 `docs/responsive-report.png`（RESPONSIVE ST-4）
- [ ] P8.5 干净 clone 走考官四条命令；CI 在 Linux 上绿即视为大小写复核通过

完成判据：PROJECT §1 交付物清单七项全勾。

---

## 缺陷 / 偏差候选（PROJECT §0.0 第 5 条：先记这里，动手修时搬入 `docs/deviations.md` 编号）

- [ ] #1 移动板（`2002:3679`）没有 Weight Loss 区块；其移动版以 335 宽游离组 `2002:4113` 放在画板外，第三块 `2002:4155` 无任何文字。处理：按桌面 `2002:3307` 补进移动板 How it works 之后，登记 C 类。**P5.5 做**
- [ ] #2 文案品牌名前后不一致：多处正文写「Health Harbor provided excep…」，项目是 Apsu，疑为占位文案未替换。处理待定：统一改 Apsu 并登记 C 类，或按原文保留。**P2.2 抄文案时定**
- [ ] #3 桌面信任条（`2002:3214`）在移动板是否存在待核，可能并入移动 Hero `2002:3680`。**P1.6 核**

## Bugs

## 待澄清想法

（空）

## 当前状态

- 2026-09-17：P0.1 已随两条提交推送；P0.2–P0.5 完成，STRUCTURE 进度 3 / 3、SELFCHECK 进度 1 / 4，当前改动尚未提交；P1.1 变量快照已保存。下一步 P0.6，P0 整阶段门禁尚未完成。

## 封存
