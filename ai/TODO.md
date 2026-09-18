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

- [x] P0 · 工程收口（工程门禁通过；P0.7 暂缓；已提交推送）
- [x] P1 · 设计读取与动效准备（P1.1–P1.8 已完成）
- [x] P2 · 数据契约
- [x] P3 · 设计 token
- [ ] P4 · 组件库原语（`components/ui/`）
- [ ] P5 · 首页区块（`components/sections/`）+ 页面组装
- [ ] P6 · 响应式门禁
- [ ] P7 · 验收测试与 CI
- [ ] P8 · 交付收尾

---

## P0 · 工程收口

目标：干净 clone 上考官四条命令 + `typecheck` `lint` `format:check` `test` `build-storybook` 全绿，目录骨架就位，脚手架痕迹清零。

2026-09-17 已完成 P0.1–P0.6：目录 / 工具 / 环境示例 / README 骨架就位，完整工程命令链已通过。P0.7 依用户决定暂缓，见「待澄清想法」。验证记录见 STRUCTURE；P0/P1 已提交并推送 `cb818c2` / `344814a`；P1.8 已推送 `bd7e435` / `0f7384d`；P2.1 与扫描修复已推送 `9a7b5ac` / `51174cf` / `3e41a7c`，P2/P3 后续实现已推送至 `0ca4e3c`。

完成判据：`npm ci && npm run format:check && npm run typecheck && npm run lint && npm run build && npm test && npm run build-storybook` 全绿；`git status` 干净；STRUCTURE §三 目录树里每个目录都存在。

## P1 · 设计读取与动效准备（已完成，预算内 9 次设计读取）

2026-09-17 完成 P1.1–P1.7：75 项变量、3 张原尺寸底图、4 份桌面 context + 1 份移动全页补读；[设计系统](design_system/design-system.md)、[UI 总览](design_system/uiux/overview.md)、[交互草案](design_system/uiux/interactions.md) 三份常驻文档齐全；14 区块 / 11 原语已登记 COMPONENTS。TOKENS ST-1 完成。实际修正和运行时实现仍归 P2–P5，不把交互草案当作已获批 deviations。

原任务标签修正：`2002:3307` 含 Weight Loss / 套餐 / BMI；`2002:3439` 为 Birth Control / Sleep / Profile；`2002:3667` 只有 FAQ。移动整板补读用于确认移动字号、Footer 与聊天插画的 Syne，预算总计 9 次。账号当月余额未知，不等同于项目剩余预算。

新增 **P1.8 · Emil 动效开发准备**（2026-09-17 完成，MOTION ST-1）：安装四技能并固定来源 / 许可证，登记 JASKILL，统一 token 采用规则，把动效审查与 Emil 视觉检测接入 P3–P5。只完成准备，运行时动画仍待实施。

完成依据：三份常驻文档互链；核心 token 均有来源并提供可实施映射；区块对应节点 / 板外位置明确；偏差盘点见下方；预算用量见 PROJECT §0.1。

---

## P2 · 数据契约

目标：考官打开 `content/schema.ts` 就能读懂整页数据；mock、页面、假后端说同一份契约。

- [x] P2.1 `content/schema.ts`（DATACONTRACT ST-1）：`HomePage` 根 + 每区块子 schema，字段顺序 = 区块顺序，JSDoc 英文一句话；金额 / 图片 / 多形态按 DATACONTRACT §二 3–5 条
- [x] P2.2 `content/mocks/home.ts` + vitest（DATACONTRACT ST-2）：文案逐字从 Figma 抄（含已知错字，修正走 deviations）；图片先用占位尺寸，P5 换真图
- [x] P2.3 `lib/api/home.ts` 双分支 + `app/api/home/route.ts`（DATACONTRACT ST-3）

完成判据：`npm test` 通过 `HomePage.parse(homeMock)`；`npm run build` 不发首页取数 HTTP（next/font 下载按已接受风险执行）；`curl localhost:3000/api/home` 返回同一份 mock。

## P3 · 设计 token

前置：读 `emil-design-eng` 与 MOTION §二–四；Emil 是动效与 UI polish 主要标准，默认稿仍以 Figma 为准。

- [x] P3.1 `styles/tokens.css` `@theme`（TOKENS ST-2）：颜色 / 字体 / 字号 `clamp()` / 圆角 / 阴影 / 容器宽；`next/font/google` 接入
- [x] P3.2 `lib/motion.ts` + CSS 动效 token（MOTION ST-2）：按 Emil 曲线与预算落地，校验单位、hover 门控与减动效
- [x] P3.3 断点 `sm` / `lg` / `xl` 与容器规则落地（RESPONSIVE ST-1）
- [x] P3.4 魔法值机检手段定下（TOKENS ST-3）

完成判据：`globals.css` 只 `@import` token 文件；Storybook 起来能看到字体加载；`npm run check:tokens` 在 token 文件外查不到违规字面值。

## P4 · 组件库原语（`components/ui/`）

- [x] P4.1 Button 走通全链路（COMPONENTS ST-1 + STORYBOOK ST-1 + MOTION ST-3 首例）：组件 → `index.ts` 导出 → 五态 story → `app/page.tsx` 从 `@/components` import 渲染一颗按钮 → D-01 / D-02 登记
- [x] P4.2 其余原语逐个（COMPONENTS ST-2 / STORYBOOK ST-2）：Chip · Card · Accordion · Carousel · Marquee · NumberField · RadioGroup · SegmentedControl · Rating · IconButton，原语 / story / 验收完成；用户本轮决定保留原先建议的 14 条提交，本次源稿修正另加第 15 条，story 同 commit
- [x] P4.3 a11y addon 零违规（A11Y ST-1）

完成判据：每个原语按 MOTION §四走 animate → review-animations → Emil 实景视觉复核（无动效说明 N/A），Block 修完重审；COMPONENTS §四 ui 表全「完成」；`npm run storybook` 逐态可点；`import { Button, … } from "@/components"` 在 page 里可用。

## P5 · 首页区块（`components/sections/`）+ 页面组装

按 Figma 桌面顶层帧预排，最终拆分以 P1.5 清单为准。client 组件只限白名单（COMPONENTS §三 第 1 条）。

- [ ] P5.1 Header + 移动抽屉 Menu（client）→ 顺手实测 `lg` 阈值回写 RESPONSIVE（RESPONSIVE ST-2）
- [ ] P5.2 Hero + LanguageMarquee（client）+ ServiceCards（三类服务入口，Server）
- [ ] P5.3 信任条 TrustMarquee（client）
- [ ] P5.4 How it works
- [ ] P5.5 WeightLoss（介绍 + 套餐）与 BmiCalculator（`lib/bmi.ts` 纯函数）：按候选 #1 / #5 确认移动缺块和初始结果后实施并登记 C 类
- [ ] P5.6 BirthControl / Sleep（含静态 Profile 卡）
- [ ] P5.7 OnlineCare（Completely online，含 Carousel client 原语与静态聊天示意）
- [ ] P5.8 SuccessStories（Server，桌面三列 / 移动堆叠）；社交图标按 PROJECT §11 #1 纯装饰
- [ ] P5.9 FAQ Accordion（client Faq，原生 `<details>`）
- [ ] P5.10 Footer / Final CTA
- [ ] P5.11 `app/page.tsx` 组装：`getHomePage()` 分发 + 导航锚点（PROJECT §11 #2）+ 一页一个 `h1`

- [ ] P5.12 全页 `find-animation-opportunities` 只读审计（MOTION ST-4）：建议与真实拒绝理由进决策记录；建议不自动实施，完成全页正常 / 减动效 / 键盘 / 触控复核

每区块 DoD（PROJECT §9）：Emil 动效审查与实际画面视觉复核（MOTION §四，Block 修完重审）· 375 / 1440 逐项对照 Figma · story 存在 · 键盘走通 · `check:responsive` 绿 · deviations 登记 · 真图换入 `public/images/`。

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

## 缺陷 / 偏差 review 队列

2026-09-17 用户要求先实现源稿，全部修正方案已集中到 [docs/deviations.md](../docs/deviations.md)。以下仅是 TODO 索引；先整体 review，再开始修改，不按 P2/P3 逐项确认。

- [ ] C-01：移动 WeightLoss / BMI 缺块（原 #1）
- [ ] C-02 / C-03：Trust / Footer 拼写（原 #4）
- [ ] C-04 / C-05：BMI 示例初始值与范围文案（原 #5）
- [ ] C-06：WeightLoss 标题（原 #6）
- [ ] C-07：俄语 / 阿拉伯语合并标签（原 #7）
- [ ] C-08：OnlineCare 标题语法（原 #8）
- [ ] C-09：产品图类别与文字重叠（原 #9）
- [ ] C-10：Hero 亮绿小字对比度（原 #10）
- [ ] C-11：FAQ 重复绑定答案（原 #13）
- [ ] D-01：语言展示与持续动画暂停（原 #11）
- [ ] D-02：缺失的 CTA / 社交目的地（原 #12）
- [ ] D-03：原语 / 区块自设计交互态

已排除 #2（过时图层名不覆盖实际文案）与 #3（移动 Trust 并未缺失），判据保留在 deviations 的 Source interpretation。

## Bugs

- [x] [BUG] #14 Tailwind 误扫设计快照 / AI 日志已修复：显式限制 UI 源目录，21 条 CSS 解析警告消失；生产 / Storybook 构建通过，CSS 由 43,535 降至 7,967 bytes，实际布局 utility 保留（2026-09-17）。

## 待澄清想法

- P0.7 暂缓（2026-09-17 用户决定）：本地 AGENTS 的 Next.js 自动规则块与是否同步 shelf 以后再说，不阻塞 P0/P1；协议自动规则与上架仍暂缓；P1.8 的 Emil 本地安装和登记为另行授权。

## 当前状态

- 2026-09-17：P0.1–P0.6 与 P1–P4 完成，P0.7 按用户决定暂缓。已审计前轮原始记录：可见 turn_context 均为 gpt-6-astra，没有 Luna；最后一次 interrupted 发生在开场白后、工具工作前，没有 credit 耗尽导致缺码的证据。P2/P3 四条提交 4adae67 / 97a905b / 4863536 / 0ca4e3c 已推送 main。P4 11 原语、统一导出、79 原语 stories（总计 80）、页面消费标本与 a11y / motion / 375/1440 同 agent 视觉复核完成；48 Node + 18 浏览器测试、format/typecheck/lint/token guard、生产和 Storybook build 通过。COMPONENTS 2/3、STORYBOOK 1/3（原语部分完成）、A11Y 1/2；P4 经用户复核修正 Button / NumberField（见 COMPONENTS），按用户决定保留原先建议的 14 条提交，本次源稿修正另加第 15 条，下一步 P5。源稿缺陷和产品 D 类仍待整体 review；原稿控件 SVG 已下载，其余产品图片仍为 P5 待替换的透明占位。

## 封存
