# COMPONENTS — 组件库管理

> **feature 文档 · 规范类**（不是单个功能的实施文档）。
> **管理 scope**：组件库的形态与边界、`components/` 统一导出规则、原语（`ui/`）与区块（`sections/`）的组件规范、client 组件白名单、新增组件的登记流程。加组件、改导出、改组件约束先改这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §5.1「组件规范」 迁出。PROJECT.md 只保留索引、scope 与「项目决策口供」（§3.1）；本文与口供冲突时，先改口供再改这里。

---

## 一、目标

甲方原文：「Implement the design (desktop + mobile) as a **React component library + page**」。交付物是**一个组件库**加一个用它拼出来的页面，不是一堆页面私有组件。判据：把 `components/` 整个目录拷到另一个 Next 项目里，`import { Button } from "@/components"` 就能用。

## 二、组件库形态（2026-09-17 用户设立，PROJECT §3.1 口供「组件库形态」行）

1. **统一出口**：`components/index.ts` 是唯一对外入口，re-export `ui/` 与 `sections/` 下的全部组件及其 props 类型。消费者只写 `import { Button, Hero } from "@/components"`，不写 `@/components/ui/Button`。
2. **通用可复用**：组件不依赖页面上下文——不 import `content/mocks`、不读全局状态、不假设自己在首页哪个位置；所有文字、链接、图片走 props（类型来自 `content/schema.ts`，见 DATACONTRACT.md）。
3. **自足**：每个组件目录含 `X.tsx` + `X.stories.tsx`，导出 `X` 与 `XProps`；样式只用 `@theme` token（TOKENS.md），不带页面级布局假设（不设外边距、不设固定宽度，由父级容器决定）。
4. **页面只是消费者**：`app/page.tsx` 也只从 `@/components` import，用 `getHomePage()` 的数据把区块拼起来，证明库可独立使用。
5. **别人 import 就能用**：不要求安装额外 provider 或 context；需要客户端交互的组件自己带 `"use client"`，消费者无感。

## 三、组件规范

1. **区块组件默认是 Server Component**。只有 6 个交互岛加 `"use client"`：Header（含移动端抽屉）、LanguageMarquee、TrustMarquee、BmiCalculator、Carousel、Faq。新增 client 组件要在 PR/commit 说明里给理由。
2. **组件里不许出现文案与图片路径的硬编码**。所有文字、链接、图片从 props 进来，props 的类型来自 `content/schema.ts`。
3. 原语组件 (`ui/`) 不知道业务：`Button` 不知道自己是 "See plans"。
4. 每个原语导出一个 `variant` / `size` 的有限集合，用 `cva` 或对象映射，不在调用处拼 class 串。
5. 所有可交互元素必须是原生可聚焦元素（`button` / `a` / `input`），禁止 `div onClick`。
6. 图标一律 `aria-hidden`，含义由旁边文本或 `aria-label` 承担。
7. 每个原语 / 区块依 [MOTION §四](MOTION.md) 执行 Emil 工作流：animate 决策与实施 → review-animations（有动效时显式调用）→ emil-design-eng 实景视觉检测 → UI Tailor 交互验证 / Monet 视觉复核。Block 未消除不能标完成；无动效记 N/A 与理由。测试记录保留技能版本、story / 截图、视口、正常 / 减动效、打断与未测限制。

## 四、组件清单（登记点：加组件先在此登记一行）

### ui/（无业务原语）

| 组件 | 使用位置 | 状态集（P1 草案，实施时登记 D 类） | 状态 |
|---|---|---|---|
| Button | Header、Hero、产品、BMI、FinalCta | Default / Hover / Focus / Pressed / Disabled；primary / secondary / outline | 完成（P4 库与 stories） |
| Chip | Hero 语言标签 | Default / Selected；交互变体的 Hover / Focus / Pressed / Disabled 待候选 #11 确认 | 完成（P4 库与 stories） |
| Card | 服务入口、套餐、职责、Profile、证言 | Default；可操作卡才有 InteractiveHover | 完成（P4 库与 stories） |
| Accordion（原生 `<details>`） | FAQ | Collapsed / Expanded / Focus / Hover / Pressed | 完成（P4 库与 stories） |
| Carousel | OnlineCare，**不在 SuccessStories** | Default / FirstSlide / LastSlide / Keyboard / ReducedMotion | 完成（P4 库与 stories） |
| Marquee | LanguageMarquee / TrustMarquee | Default / Paused / ReducedMotion | 完成（P4 库与 stories） |
| NumberField | BMI 身高 / 体重 | Default / Focus / Invalid / Disabled | 完成（P4 库与 stories） |
| RadioGroup | BMI Sex | Default / Focus / Checked / Disabled | 完成（P4 库与 stories） |
| SegmentedControl | BMI 单位 | Default / Hover / Focus / Selected / Disabled | 完成（P4 库与 stories） |
| Rating | 文本证言 | Default（只读） | 完成（P4 库与 stories） |
| IconButton | 移动菜单 / OnlineCare 箭头 | Default / Hover / Focus / Pressed / Disabled | 完成（P4 库与 stories） |

### sections/（首页区块）

P1 已按两板确认 14 个页面组合单元；精确桌面 / 移动节点、截图、布局和锚点以 [UI 总览](../design_system/uiux/overview.md) 为真源，状态以 [交互草案](../design_system/uiux/interactions.md) 为准。下表登记组件边界，14 区块均已完成 P5 实施和本地验收。

| 顺序 | 组件 | 边界 / 组合 | 状态 |
|---|---|---|---|
| 1 | Header | Client，含移动菜单 | 完成（P5） |
| 2 | Hero | Server，内含 Client LanguageMarquee | 完成（P5） |
| 3 | ServiceCards | Server，三类服务入口 | 完成（P5） |
| 4 | TrustMarquee | Client，两板均存在 | 完成（P5） |
| 5 | HowItWorks | Server，两张职责卡 | 完成（P5） |
| 6 | WeightLoss | Server，介绍与套餐；C-01 移动紧凑双卡已实现 | 完成（P5） |
| 7 | BmiCalculator | Client，紧随 WeightLoss；不是 Sleep 的 Profile | 完成（P5） |
| 8 | BirthControl | Server | 完成（P5） |
| 9 | Sleep | Server，含静态 Profile 卡 | 完成（P5） |
| 10 | OnlineCare | Server 外壳 + Client Carousel | 完成（P5） |
| 11 | SuccessStories | Server，桌面三列 / 移动堆叠 | 完成（P5） |
| 12 | Faq | Client，Accordion；首项默认开 | 完成（P5） |
| 13 | FinalCta | Server，从桌面 Footer 复合实例抽出 | 完成（P5） |
| 14 | Footer | Server，原生 footer 地标 | 完成（P5） |

LanguageMarquee 为 Hero 子组件，Carousel 为 ui 原语，不重复计为根区块。P1 没有新增 client 岛；白名单仍为 Header、LanguageMarquee、TrustMarquee、BmiCalculator、Carousel、Faq。

## 五、待实现 / 已知问题

- P4 已完成 11 原语、props / item 类型统一导出、79 个原语 stories（含 Overview）与页面 Button 消费示例。所有原语只吃 props；Storybook 的 mock 仅由 stories / storyFixtures 引入。
- P1.7 已完成 §四 的 14 区块与 11 原语登记；P5 完成区块 ST-3；原批准偏差全部验收，Semaglutide 素材缺口另见 C-12 Pending。

## 实现计划

进度：3 / 3 subtasks 完成（100%）

- [x] ST-1: 建 `components/ui/`、`components/sections/`、`components/index.ts`，先放 Button 一个原语走通「组件 + story + 从 `@/components` import」链路
- [x] ST-2: 其余 ui/ 原语逐个落地，原语实现与 stories 完成；用户本轮决定保留原先建议的 14 条提交，本次源稿修正另加第 15 条
- [x] ST-3: sections/ 按设计文档逐区块落地，只吃 props

## 测试记录

- 2026-09-17：P1 对照三张原尺寸截图、XML 和五份 context 完成组件边界盘点。确认 OnlineCare 使用 Carousel，SuccessStories 移动堆叠；不是运行时测试。

## P4 实施边界（2026-09-17）

用户已授权完成全部 11 原语与逐态 stories。先实现可独立复用的库与 Storybook 候选态，D-01 / D-03 的产品采用已获整体 review 批准，待 P5 接入；已批 C 类共享文案已修正，其余见执行表。Button 的 page 消费证明使用明确标注的开发标本，禁用态只用于无目标 CTA 的隔离展示，不代表产品 demo 的禁用策略；D-02 已敲定产品保留视觉反馈、无业务效果。原语需要回调、测量或原生控件 ID 时可使用 client 边界，不增加新的首页业务岛；静态 Card / Rating 保持无状态。


### P4 验收（2026-09-17）

Emil 四技能版本 `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`；同一 agent 依次执行 animate / review-animations / emil-design-eng / UI Tailor / Monet 自审，没有独立第二人。Chromium 375×812 / 1440×900；79 原语 stories × 2 视口 = 158 次 axe / 横溢出检查，零违规。18 项浏览器测试、48 项 Node 测试通过；生产与 Storybook build、format / typecheck / lint / token guard 通过。

| 组件 | 动效判断 / review | 验证证据与限制 |
|---|---|---|
| Button | Approve：指针 scale .97，160ms 进 / 100ms 退；颜色 ease；键盘即时 | 10 stories；原生 disabled、禁用链接无 href / 回调、Tab、键盘无缩放、指针反向、OS reduce 与 coarse-touch 模拟 |
| Chip | Approve：只有交互变体有共享按压反馈；展示态 N/A | 9 stories；默认不是 button，交互版真实切换 aria-pressed；保留源稿混合语言 |
| Card | 静态 N/A；链接变体共享轻量反馈 Approve | 9 stories；四种源色、focus / hover / pressed；不在静态卡上假装可点击 |
| Accordion | Approve：原生 details；量高度 + opacity 200ms 是 recipe 的明确例外 | 8 stories；原稿 12px 圆角、16→24px 内距、白色正文、4px 分隔和虚线；快速反向、键盘即时、reduce、4 倍慢放 + 4 倍 CPU 节流通过 |
| Carousel | Approve：手动 scroll-snap，指针 smooth、键盘 / reduce instant | 7 stories；首末边界、空数据、屏外 inert、Home / End / arrows、resize；没有自动播放或自定义触摸物理 |
| Marquee | Approve：默认静态；显式 autoPlay 后 CSS linear 30s | 5 stories；用户 / hover / focus 暂停，复制轨道隐藏且 inert；等宽循环、后台 visibility 处理、实时 reduce 换行；Pause / Resume 为普通动作按钮，不混用改名与 aria-pressed |
| NumberField | N/A：原生数字编辑与即时焦点，不加动画 | 6 stories；关联 label / unit / error、原稿绿色 SVG 双箭头 / 原生 ArrowUp、受控 / 非受控、小数步长、上下限、空值、readOnly / step=any / disabled；禁用输入变淡，单位保留对比度 |
| RadioGroup | N/A：高频互斥选择即时 | 6 stories；fieldset / legend、原生方向键、组禁用 / 单项禁用；没有自写 roving tabindex |
| SegmentedControl | Approve：共享 radio 语义，指针轻反馈、键盘即时 | 7 stories；源稿 0.5px 外圈、4.5px 内衬、4px 间距；无移动指示器 |
| Rating | N/A：只读信息不动画 | 4 stories；单一可访问名称，完整 / 半星 / 空分数，星形隐藏于读屏 |
| IconButton | Approve：共享 Button 按压和媒体门控 | 7 stories；必填 label，图标 aria-hidden，原生 disabled |

视觉证据：[375](../../docs/primitive-review-375.png) / [1440](../../docs/primitive-review-1440.png)，可运行入口 `Primitives/Overview → Default`。这是原语库验收，不是 14 区块像素验收。未测实体手机、Safari / Firefox、读屏软件实听和 P6 全页 11 宽度；CPU 节流测试不等于所有硬件稳定帧率保证。Motion 依赖保留，本阶段没有 runtime import。

### P4 用户复核修正（2026-09-17）

- MCP 重新读取 `2002:3135`、`2002:3197`、`2002:3375`，附带截图确认水平箭头、40 / 32px 图标框内的实际圆形留白，以及 52px 高的胶囊输入框与 24px 绿色圆润 sort 图标。前次用 ArrowUpRight / 满框白圆 / 12px 输入圆角 / 浏览器 spinner 是实现误差，本轮修正不属于修改甲方设计。
- Button 的 `trailingIcon` 接收完整源稿圆箭头；NumberField 新增 `stepperIcon`、`incrementLabel`、`decrementLabel` props。素材路径和标签由调用者传入，组件内不写页面素材路径。原稿 sort SVG 保持完整，由两个 24×24 原生 button 覆盖上下操作区。
- 步进调用原生 `stepUp`，尊重 min / max / step 并派发 input 通知 React 受控值；readOnly、disabled 和 step=any 禁用步进。WithHint 使用受控小数示例，不新增 story 数量。NumberField 高频编辑不加动画，Button 已验收动效保持原样。
- 用户授权按原建议拆分 P4 基线 14 条 commit，再追加这两处修正 1 条 commit，一共 15 条并推送；当时产品 C / D 类等待整体 review；本轮用户已敲定，后续状态见 deviations。

- 2026-09-17 deviations 整体 review 收口：49 Node 测试通过；新增 AllAnswers，当前 80 原语 stories + 1 Foundations。18 浏览器用例通过，375/1440 共 160 次 axe/横溢出零违规；两项首跑因导航 ERR_ABORTED 中断，构建结束后定向重跑通过，未放宽断言。FAQ 全展开与语言标签截图由同一 agent 以 UI Tailor/Monet 职责复核，俄语 LTR、阿拉伯语 RTL，文案无裁切；未新增动效，沿用 P4 已审实现。生产/Storybook 构建与 format/typecheck/lint/token guard 通过。P5 全页验收仍未做。

## P5 区块验收（2026-09-17）

14 个根区块 + LanguageMarquee 子组件全部只吃 content / ui props；page 在 Server 端只调一次 getHomePage，统一从 @/components 导入。六个既定交互岛不扩张。15 个 colocated story 文件提供 23 个区块状态；加原语 / Foundations 共 104 stories。

源稿真图与尺寸见 [assets](../../docs/assets.md)；Semaglutide 缺匹配瓶图，以 null 明示并记录 C-12，不冒用 Tirzepatide。Mobile C-01 总高 1407.7px（375 宽，含区块间距）；无固定高度压字，折叠保留表单。BMI 纯函数覆盖边界、非法值及公英制往返；用户输入后提交才计算。

91 Node、18 原语 + 14 区块浏览器用例通过；104 stories × 两板 = 208 次 axe / 溢出检查通过。生产与 Storybook 构建通过。11 宽完整性检查、源稿逐段同 agent UI Tailor / Monet 视觉复核及 Emil 审查见 [P5 evidence](../../docs/p5-review.md)。新增动效限 CSS 菜单与共享暂停编排；按钮/FAQ/轮播沿用已审原语，静态区块 N/A。正常 / reduce / 键盘 / 模拟触控 / 慢放反向通过；未做真机、跨浏览器与读屏实听。

### 语言交互复核（2026-09-17）

用户新增 PROJECT §5.0a 展示交互规则。LanguageMarquee 使用 Chip 的真实 toggle，保留源稿初始高亮；新增 Toggled/Keyboard stories。Marquee 支持显式 pointer-only duplicateContent，Chip 透传 tabIndex；键盘静态换行只暴露原始列表。useInputModality 与 :focus-visible 联合判断暂停，修复两个条带 Resume 残留焦点问题；原有测试去掉 Resume 后的人工 blur，并覆盖键盘→鼠标切换、动画时间继续、复制项选中同步和静态键盘访问。Emil review Approve：反馈沿用既定 CSS 预算，触控/减动效/快速切换及 375/1440 通过。当前总计 106 stories，新增行为细节与证据见 uiux/interactions.md。
