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

## 四、组件清单（登记点：加组件先在此登记一行）

### ui/（无业务原语）

| 组件 | 状态集 | 状态 |
|---|---|---|
| Button | Default / Hover / Focus / Pressed / Disabled；variant primary / secondary / outline | 待做 |
| Chip | Default / Hover / Selected | 待做 |
| Card | Default / Hover | 待做 |
| Accordion（原生 `<details>`） | Collapsed / Expanded / Focus | 待做 |
| Carousel | Default / FirstSlide / LastSlide（首末箭头 disabled） | 待做 |
| Marquee | Default / Hover（暂停） / ReducedMotion | 待做 |
| NumberField | Default / Focus / Invalid / Disabled | 待做 |
| RadioGroup | Default / Focus / Checked | 待做 |
| SegmentedControl | Default / Hover / Selected | 待做 |
| Rating | Default | 待做 |
| IconButton | Default / Hover / Focus / Pressed / Disabled | 待做 |

### sections/（首页区块，节点 ID 见 PROJECT §0.1 与 `design_system/figma/page-0-1.xml`）

按桌面板顶层顺序登记，14 个区块的拆分待读稿后确定；client 组件仅限白名单：Header（含移动抽屉）、LanguageMarquee、TrustMarquee、BmiCalculator、Carousel、Faq。

## 五、待实现 / 已知问题

- `components/` 目录与 `index.ts` 尚未创建
- 14 个区块的最终拆分与命名待设计读稿（monet / ui-tailor）后回填 §四

## 实现计划

进度：0 / 3 subtasks 完成（0%）

- [ ] ST-1: 建 `components/ui/`、`components/sections/`、`components/index.ts`，先放 Button 一个原语走通「组件 + story + 从 `@/components` import」链路
- [ ] ST-2: 其余 ui/ 原语逐个落地，每个一条 commit（PROJECT §7.3）
- [ ] ST-3: sections/ 按设计文档逐区块落地，只吃 props

## 测试记录

（空）
