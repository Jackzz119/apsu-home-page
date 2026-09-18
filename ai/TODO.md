# TODO

> 未完成任务的唯一清单；规则与口供见 [PROJECT.md](PROJECT.md)，分领域规范见 PROJECT §3.2 索引的 feature 文档。
> 最后更新：2026-09-18。`[ ]` 待办 · `[~]` 进行中 · `[!]` 依赖外部 · `[x]` 阶段内已完成（阶段收口后清掉，不累积历史）。
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
- [x] P4 · 组件库原语（`components/ui/`）
- [x] P5 · 首页区块（`components/sections/`）+ 页面组装
- [x] P6 · 响应式门禁
- [x] P7 · 验收测试与 CI（2026-09-18：七条验收测试落地，GitHub Actions 两 job 绿）
- [x] P8 · 交付收尾（2026-09-18；用户 audit 之后还要再做一次 `logs(ai-logs): final sync`）

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

- [x] P5.1 Header + 移动抽屉 Menu（client）→ 顺手实测 `lg` 阈值回写 RESPONSIVE（RESPONSIVE ST-2）
- [x] P5.2 Hero + LanguageMarquee（client）+ ServiceCards（三类服务入口，Server）
- [x] P5.3 信任条 TrustMarquee（client）
- [x] P5.4 How it works
- [x] P5.5 WeightLoss（介绍 + 套餐）与 BmiCalculator（`lib/bmi.ts` 纯函数）：按已敲定 C-01/C-04 实现：移动可见介绍 + 紧凑双套餐 + 可折叠 BMI；有效输入后才计算，分类与 C-05 标签一致
- [x] P5.6 BirthControl / Sleep（含静态 Profile 卡）
- [x] P5.7 OnlineCare（Completely online，含 Carousel client 原语与静态聊天示意）
- [x] P5.8 SuccessStories（Server，桌面三列 / 移动堆叠）；社交图标按 PROJECT §11 #1 纯装饰
- [x] P5.9 FAQ Accordion（client Faq，原生 `<details>`）
- [x] P5.10 Footer / Final CTA
- [x] P5.11 `app/page.tsx` 组装：`getHomePage()` 分发 + 导航锚点（PROJECT §11 #2）+ 一页一个 `h1`

- [x] P5.12 全页 `find-animation-opportunities` 只读审计（MOTION ST-4）：建议与真实拒绝理由进决策记录；建议不自动实施，完成全页正常 / 减动效 / 键盘 / 触控复核

每区块 DoD（PROJECT §9）：Emil 动效审查与实际画面视觉复核（MOTION §四，Block 修完重审）· 375 / 1440 逐项对照 Figma · story 存在 · 键盘走通 · `check:responsive` 绿 · deviations 登记 · 真图换入 `public/images/`。

## P6 · 响应式门禁

- [x] P6.1 `scripts/check-responsive.ts`（SELFCHECK ST-1）：11 宽度三断言 + `docs/responsive-report.md`
- [x] P6.2 全页 320–1920 扫描修复；README「Responsive strategy」三句：策略 / 表 / 图（RESPONSIVE ST-3）

完成判据：11 宽度全绿；报告表进 README。

## P7 · 验收测试与 CI

- [x] P7.1 SELFCHECK §四 七条验收测试逐条落地（SELFCHECK ST-3）：`tests/acceptance/` 四份 Node 测试 + `states.spec.ts` 浏览器扫描 + schema 单一类型源断言；Node 110 / 浏览器 44 全绿
- [x] P7.2 CI 决定与 workflow（SELFCHECK ST-4）：`.github/workflows/ci.yml` 两 job（quality / browser），徽章贴 README；前两跑 browser job 因节流手风琴用例在慢 runner 上采样过晚而红，改为页内逐帧采样（SELFCHECK §五 首跑记录）；最终结果以 README 徽章 / 最新 run 为准

完成判据：`npm test` 全绿；CI 徽章绿并贴 README。

## P8 · 交付收尾

- [x] P8.1 `docs/deviations.md` 定稿：16 项全部 Approved — Completed，D-03 补记 logo / 步进按钮反馈；README「Deviation log」链接在
- [x] P8.2 README §10 十项逐条勾（`tests/acceptance/readme.test.ts` 机检十节 + 四条命令 + 链接可达）；新增 CI 与 Acceptance tests 小节、三个 Claude 会话行、干净 clone 结论
- [x] P8.3 ai-logs：`sync:ai-logs` + `readable:ai-logs`（新脚本 `scripts/export-readable-logs.mjs`）+ 索引补齐；本轮以 `logs(ai-logs): final sync` 收尾。**audit 结束后要再跑一次同步并再提交一条 final sync**
- [x] P8.4 `check:responsive --composite` 拍一次 11 宽度拼图 `docs/responsive-report.png`（RESPONSIVE ST-4；随 P6 提前完成）
- [x] P8.5 干净 clone（Node 22.23.1 / npm 10.9.8）四条命令全过：install 5s、build 成功、dev 首页与 `/api/home` 200、Storybook 111 stories；CI Linux 绿。顺带发现并修掉 lockfile 缩进被 `npm install` 重写的问题（`ed4edea`）

完成判据：PROJECT §1 交付物清单七项全勾。

---

## 已敲定偏差执行索引

2026-09-17 用户完成全部现有条目的 review。状态唯一真源为 [docs/deviations.md](../docs/deviations.md) 后半执行表：Pending / Approved — Not implemented / Approved — Completed；当前 0 / 0 / 16（含 C-12 展示图复用与 D-04 BMI 数字反馈）。前半面向甲方说明发现的问题、具体改动及理由。

- [x] C-01：P5.5 移动紧凑双套餐 + BMI 默认折叠、保留输入；不采用整块隐藏或互斥 tabs
- [x] C-02 / C-03：Trust / Footer 拼写已修正
- [x] C-04：P5.5 BMI 真正计算、单位转换、输入校验与未计算态；sourcePreview 仅留档
- [x] C-05：BMI 范围文字已修正；运行时边界验收归 C-04
- [x] C-06：按用户决定保留 `Loss Weight In Your Way.`，不改标题
- [x] C-07：俄语 / 阿拉伯语分拆，稳定 ID 与局部 LTR / RTL
- [x] C-08：OnlineCare 标题改为 `Easy Treatment Management`
- [x] C-09：P5.2/P5.5 匹配真图、真实尺寸和文字安全区
- [x] C-10：文字色 token 已备好，P5.2 Hero 使用并验证对比度后完成
- [x] C-11：保留第一条原答，为另外三题写简短答案，原版重复答案留档
- [x] D-01：语言本地选中展示交互、双行共享暂停与信任条 Resume 修复完成；键盘/触控/减动效验证通过
- [x] D-02：demo 数据契约已落地；P5 验证无业务作用、真实产品锚点可用
- [x] D-03：原语态已验收；P5 按 Emil 接入并审查全页交互

- [x] D-04：BMI 指针计算 250ms 数字递增，键盘 / 减动效即时；布局稳定与中断行为已验证

C-06 的完成表示已决定保留源稿；其他已批准条目均已完成 P5 集成验收；C-12 已批准：缺匹配图时复用 Tirzepatide 展示图并登记标签不符原因。新增偏差继续先记 Pending。

- [x] C-12（敲定已经做完）：Semaglutide 复用 Tirzepatide 展示图，两板图片验收通过；标签不符与素材限制已登记。

## Bugs

- [x] [BUG] #17 BMI 提示撑高输入框、英寸初始为 0、结果出现抖动：分组预留提示空间、所有测量初始为空、固定结果空间，11 宽三态几何与数字动画回归通过（2026-09-17）。

- [x] [BUG] #16 导航硬跳：指针导航改为原生平滑滚动；键盘 / 减动效即时，移动菜单焦点与连续改目标通过（2026-09-17）。

- [x] [BUG] #15 跑马灯 Resume 后鼠标离开仍暂停：改为实际输入方式 + focus-visible 判定，保留键盘保护，不 blur 控件；375/1440 及混合输入回归通过（2026-09-17）。

- [x] [BUG] #14 Tailwind 误扫设计快照 / AI 日志已修复：显式限制 UI 源目录，21 条 CSS 解析警告消失；生产 / Storybook 构建通过，CSS 由 43,535 降至 7,967 bytes，实际布局 utility 保留（2026-09-17）。

## 待澄清想法

- P0.7 暂缓（2026-09-17 用户决定）：本地 AGENTS 的 Next.js 自动规则块与是否同步 shelf 以后再说，不阻塞 P0/P1；协议自动规则与上架仍暂缓；P1.8 的 Emil 本地安装和登记为另行授权。
  - 2026-09-18 补充事实：干净 clone 里由 Claude 会话跑 `npm run dev`，Next 16 的 `ensureAgentRulesForDev` 检测到 AI agent 环境就把 `<!-- BEGIN:nextjs-agent-rules -->` 块追加进 `AGENTS.md`（人类终端不触发，考官不受影响）。退出开关是 `next.config.ts` 的 `agentRules: false`，或把块提交进 AGENTS.md。两条都动到协议文件 / 配置，等用户拍板，本轮未动。

## 当前状态

- 2026-09-18：P7 / P8 收口。`tests/acceptance/` 五份验收测试 + schema 单一类型源断言，Node 110、浏览器 44（states 扫描 1440 量 65 个控件 / 375 含菜单 69 个）；D-03 补齐 logo 链接与 NumberField 步进按钮的 hover / pressed / 过渡，stories 111。`.github/workflows/ci.yml` quality + browser 两 job 并贴徽章（前两跑的红与修法见 SELFCHECK §五）。干净 clone 四条命令全过；lockfile 缩进归一化；`readable:ai-logs` 派生可读日志。README 十节机检通过，deviations 16/16 完成。首页与 Storybook 已部署 Vercel（push `main` 自动重发）。下一步：用户 audit；audit 后再跑一次 `sync:ai-logs` + `readable:ai-logs` 并提交最后一条 `logs(ai-logs): final sync`。

- 2026-09-17：P6.1–P6.2 完成，RESPONSIVE 4/4；P8.4 拼图提前交付并接入 README。92 Node / 42 浏览器 / 28 定向 story 检查通过，隔离生产构建 11 宽三断言全部通过；BMI 错误 / 结果均不改变布局，D-04 已完成，偏差总数 16。后续进入 P7，P8 其余任务保留。

- 2026-09-17 后续人工验收：导航平滑滚动、C-12 展示药瓶复用与 C-09 药瓶尺寸调整完成；91 Node、8 项定向浏览器、8 次 story 双板检查、11 宽生产扫描通过。当前偏差共 15 项全部敲定完成；P7/P8 仍按下列历史阶段记录与待办推进。

- 2026-09-17：P5.1–P5.12 完成。14 区块、真实本地资源、15 份 section stories（23 态）、6 个既定交互岛全部接通；首页唯一 h1/main 和服务锚点通过。91 Node、32 浏览器用例、104 stories ×2 检查、11 宽生产扫描通过；生产/Storybook build 与 type/lint/token/format 门禁通过。P6.1 提前完成以满足 P5 DoD；P6.2 扫描与 README 表完成，最终拼图仍留 P8。原批准偏差 14 完成，新增 C-12 Pending。P7 CI、七条最终验收与 P8 交付未冒报完成。用户已授权拆分推送；P5 批次按 23 条提交组织，起点 8032602，含 14 条区块提交和末尾日志同步。下一步依未完成的 P6/P7/P8 清单推进。

## 封存
