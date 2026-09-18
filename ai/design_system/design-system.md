# Apsu 设计系统

> 更新：2026-09-17 · P1 读稿基线。Monet 与 UI Tailor 由同一 agent 分职责复核。
> 本文记录设计真值与语义映射；运行时 `styles/tokens.css` 已在 P3 落地，字体 / 核心尺寸在 Foundations story 实测。偏差候选未经用户确认不替换原稿；P4 原语库与候选态已实装，产品区块仍待 P5。

## 当前方向与入口

医疗服务首页：暖白底、深森林绿标题与胶囊 CTA，薄荷 / 浅紫 / 浅青区分三条产品线；真人照片突出服务对象，圆角卡片与克制阴影保持柔和层级。正文信息优先，聊天和健康面板是示意内容，不是假装可用的诊疗功能。

- [首页结构与导航](uiux/overview.md)：14 个区块、两板节点映射、server/client 边界。
- [控件与交互草案](uiux/interactions.md)：状态、键盘、抽屉、轮播、BMI 与减动效。
- [组件登记](../features/COMPONENTS.md)、[token 实施规则](../features/TOKENS.md)、[偏差执行索引](../TODO.md)。

## 来源与素材

| 来源 | 文件 / 节点 | 范围与限制 |
|---|---|---|
| 桌面原始整板 | [desktop.png](figma/desktop.png) · `2002:3098` | 1440 × 10183，原尺寸 PNG |
| 移动原始整板 | [mobile.png](figma/mobile.png) · `2002:3679` | 375 × 9583，原尺寸 PNG |
| 移动菜单 | [menu.png](figma/menu.png) · `2002:4211` | 375 × 824，原尺寸 PNG |
| 节点结构 | [page-0-1.xml](figma/page-0-1.xml) | 图层名与局部几何；图层名不等于文案，旋转帧的 x 不能直接当页面 left |
| 变量 / 样式 | [variables.json](figma/variables.json) | 75 项原始定义；命名不一定与实际字重一致 |
| Header / Hero / 产品入口 | [context-2002-3099.md](figma/context-2002-3099.md) | 包括两行语言标签和三张入口卡 |
| Weight Loss / 套餐 / BMI | [context-2002-3307.md](figma/context-2002-3307.md) | BMI 在这个节点内 |
| Birth Control / Sleep / Profile | [context-2002-3439.md](figma/context-2002-3439.md) | Profile 是 Sleep 内的两张浮层卡 |
| FAQ | [context-2002-3667.md](figma/context-2002-3667.md) | 不含 Footer；保留组件 props，含折叠答案的错误复用 |
| 移动全页补读 | [context-2002-3679.md](figma/context-2002-3679.md) | 补移动字号、Footer 内容及 Syne 的真实使用位置 |
| 运行时素材目录 | [public/images/](../../public/images/) | 已下载原始 Button / NumberField SVG；其余产品素材待 P5 导出，不能把整板截图当页面图片 |

2026-09-17 用户复核后增加 3 次定点 MCP context 读取，素材原样下载：`arrow-right-circle.svg`（40×40，`2002:3137`）、`arrow-right-circle-small.svg`（32×32，`2002:3197`）、`number-sort.svg`（24×24，`2002:3379`）。Button 不再另画满框圆底；NumberField 使用 `--radius-pill` 和原稿 sort 图标。素材通过 props 传入，临时 Figma URL 不进入运行时代码。

本轮 3 次截图 + 5 次 context = 8 次设计读取；加已有 P1.1 变量读取共 9 次，P1 预算用满。未重拉 metadata。五份 context 按返回 text block 顺序以空行连接，保留原文，不将生成代码直接粘进应用。它们含 7 天有效的素材地址，只供来源追踪；P5 使用前须下载 / 必要时刷新并核验素材，不得把临时地址放进运行时代码。context 的附带图片用于本轮审图，三张原始整板另行保存。

![桌面设计原稿](figma/desktop.png)

## 颜色 → 语义 token

下表是源值映射，大小写归一化不改变颜色；同值、同用途的变量合并。语义名是本项目命名，不宣称来自 Figma。原值含透明度时保留，不能先在白底合成成新色。

| token | 值 | Figma 依据 / 用途 |
|---|---|---|
| `--color-brand` | `#102b1c` | Primary/Brand 800、Heading text 1；主 CTA、标题、Footer |
| `--color-brand-soft` | `#173a26` | Brand/800；套餐标题与 Footer 图标底 |
| `--color-accent` | `#00774d` | Highlighted text、Label text、Secondary_Mint/600 |
| `--color-accent-bright` | `#21ac88` | Secondary_Mint/400；保留装饰色，C-10 将 Hero 小字映射为 accent |
| `--color-accent-mid` | `#009269` | Secondary_Mint/500；部分勾选与仪表 |
| `--color-text` | `#111111` | Heading text 2、Secondary_Charcol/Brand 900 |
| `--color-text-secondary` | `#2a2a2a` | Neutral/800；入口卡和关闭的 FAQ 标题 |
| `--color-text-body` | `#3b3b3c` | sub heading text |
| `--color-text-muted` | `#585d5a` | Foundation /Neutral/Dark；语言标签 |
| `--color-text-selected` | `#292b2a` | Foundation /Neutral/Darker |
| `--color-text-disabled` | `#6c6c6c` | Disable text |
| `--color-text-unit` | `#6f6f6f` | Neutral/500；BMI 单位 |
| `--color-surface` | `#ffffff` | Base_white、Background/White、Button text、W；反色文字另用同值 `--color-text-inverse` |
| `--color-page` | `#faf9f4` | Background/Off White、Base_off white |
| `--color-surface-mint` | `#bcffe6cc` | Card Mint；保留 80% alpha |
| `--color-surface-purple` | `#ffdeff` | Card Purple |
| `--color-surface-cyan` | `#d0fffd` | Card Blue |
| `--color-surface-selected` | `#b8d9c6` | Foundation /Green/Light :active；语言标签选中底 |
| `--color-surface-input` | `#f6f8fa` | Background/Normal [25] |
| `--color-surface-faq` | `#f0f6f3` | FAQ context 的展开外壳 |
| `--color-surface-chat` | `#eaf7ee` | 移动聊天插画容器 |
| `--color-surface-story` | `#eafff3` | 移动证言照片底 |
| `--color-surface-plan` | `#f7faf8` | 桌面套餐组底 |
| `--color-faq-expanded` | `#587362` | Primary/500；FAQ 展开标题背景 |
| `--color-border` | `#cddcd3` | Border Mint |
| `--color-border-strong` | `#b8d9c6` | 语言标签描边 |
| `--color-border-mint` | `#bcffe6` | Secondary_Mint/Brand 100；BMI 面板 |
| `--color-border-purple` | `#ffc0ff` | Birth Control 价格分隔线 |
| `--color-border-cyan` | `#83f2ec` | Border blue；Sleep 分隔线 |
| `--color-scale-low` | `#3b82f6` | BMI / Profile 进度渐变起点 |
| `--color-scale-normal` | `#1a8a79` | 同渐变 33.333% |
| `--color-scale-elevated` | `#f59e0b` | 同渐变 66.667% |
| `--color-scale-high` | `#ef4444` | 同渐变终点；不能只靠颜色表达分组 |
| `--color-cta-end` | `#d8efe4` | 移动 Final CTA 渐变终点 |

Footer / Final CTA 的渐变属于局部视觉，不能拿它们当语义状态色。未使用的原始变量（如 `surface/blue`）仍保留在变量快照中，P3 不需要盲目全部注册。

### 对比度发现（不等于已修复）

按 sRGB 相对亮度公式计算，白底上 `#21ac88` 为 2.87:1，`#00774d` 为 5.61:1，`#102b1c` 为 15.17:1；白字在 `#587362` 上为 5.19:1。Hero 的 14px / 移动 12px 提示字不满足普通文本 4.5:1，C-10 已获用户批准：小字改为 accent，装饰色保留；`--color-text-benefit` 已备好，待 P5 Hero 接入。依据：[WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)。这些是源色对计算，不冒充运行时全页 a11y 验收。

## 字体、字号与行高

**主字体 Work Sans，实际使用 400 / 500。** 名为 Bold / Semibold 的多条 Figma 样式，实际 `Font(... weight: 500)`；以属性为准，不能按样式名加载 600 / 700。`font/family/title = Syne` 与 `font/family/body = Syne` 只用于 OnlineCare 聊天示意中的医生名 / Online（移动 context 为 8.213px / 7.04px），不覆盖全站 Work Sans。品牌 Apsu 为原始 logo 素材，不用系统字体重排。

语义字体名：`--font-heading` 与 `--font-body` 对应 Work Sans，`--font-illustration` 对应聊天示意的 Syne；均保留 sans-serif 后备。非拉丁语言标签的字形回退需 P5 实机确认，不凭 Work Sans 的声明推断全部语言已覆盖。

| 角色 / token | 375 稿 | 1440 稿 | weight / line-height | 证据 |
|---|---|---|---|---|
| `--text-hero` | 36px | 72px | 500；1.24 → 1.10 | `2002:3702` / `2002:3133` |
| `--text-section` | 32px | 52px | 500；1.24 | Birth `2002:3877` / `2002:3445`，FAQ `2002:4092` / `2002:3671` |
| `--text-service-title` | 20px | 24px | 500；1.16 | 入口卡 `2002:3762` / `2002:3193` |
| `--text-body` | 16px | 20px | 400；1.60 | Hero `2002:3703` / `2002:3134` |
| `--text-faq-question` | 20px | 24px | 500；1.16 | 两份 FAQ context |
| `--text-faq-answer` | 16px | 18px | 400；1.60 | 两份 FAQ context |
| `--text-button` | 16px（产品）/ 18px（Hero） | 18px | 500；1.24 / 1.32 | 不把所有 CTA 强制成同一种移动字号 |
| `--text-service-label` | 14px | 18px | 400；1.32；tracking 2px | 入口卡类别 |
| `--text-eyebrow` | 16px | 16px | 400；1.32；tracking 2px | How it works / Weight Loss 标签 |
| `--text-benefit` | 12px | 14px | 两板均 500；1.60 | Hero 三个服务提示 |
| `--text-price` | 52px | 52px | 500；1.24 | Birth / Sleep 的 $20；From、/mo 32px / 1.16 |
| `--text-caption` | 12px | 16px | 400；1.00 | Profile 说明字（数字另设） |
| Final CTA | 48px | 暂以变量 48px 作为实施起点，桌面实例子层未展开核值 | 500；1.24 | 移动 `2002:4104` 已精确；桌面截图用于 P5 核对，不宣称桌面已测值 |

可直接带入 P3 的流式字号（默认根字号 16px；锚点 375 / 1440，板外 clamp 保底；角色的行高另设）：

```css
--text-hero: clamp(2.25rem, 1.457746rem + 3.380282vw, 4.5rem);
--text-section: clamp(2rem, 1.559859rem + 1.877934vw, 3.25rem);
--text-service-title: clamp(1.25rem, 1.161972rem + 0.375587vw, 1.5rem);
--text-body: clamp(1rem, 0.911972rem + 0.375587vw, 1.25rem);
--text-faq-answer: clamp(1rem, 0.955986rem + 0.187793vw, 1.125rem);
```

以上 5 条系源值插值得出，不改变两端稿值。未在这五个精读节点覆盖的桌面局部样式，P5 结合已有变量、截图和 Dev Mode 核值，不把截图推断写成源值。

## 空间、容器与圆角

| 语义 | 移动 / 桌面值 | 来源与应用 |
|---|---|---|
| `--container-page` | 最大 1440px | PROJECT 决议；1440 以上内容不继续放大 |
| `--spacing-page-gutter` | 20 / 60px | 主内容宽 335 / 1320；注意 Header 的桌面局部 x=28+28=56，不硬改成 60 |
| `--spacing-shell-gutter` | 12 / 28px | Hero、Success Stories 外壳宽 351 / 1384 |
| `--spacing-section` | 56 / 120px | How / FAQ 的上下留白；不是每一行都套这个值 |
| `--spacing-card-inset` | 12 / 24px | 服务入口卡 |
| `--spacing-panel-inset` | 12 / 32px | Birth / Weight 等大块 |
| `--spacing-card-gap` | 24px | 三张服务入口卡；Weight 套餐组单独 32px |
| `--spacing-label-gap` | 8px | 移动双行语言标签 |
| `--spacing-content-gap` | 16 / 24 / 32px | 标题、正文与 CTA 分组，按节点层级选用 |
| `--radius-panel` | 16 / 32px | 大型产品块与 Hero 外壳 |
| `--radius-card` | 16px | 服务入口 / OnlineCare 卡 |
| `--radius-compact` | 12px | FAQ 与移动 Profile / Stories |
| `--radius-pill` | 9999px | CTA、chips、圆形 icon button；原始 99999 / 33554400 同为胶囊意图 |

不要照抄 generated code 的固定高度、镜像旋转或负 margin 来获得流式布局；它们描述画布的结果。内部保持内容驱动高度，照片可以局部定位，但外层布局用 flex/grid。桌面 Footer / 移动长免责声明必须随内容增长。

## 阴影与局部效果

| token | 来源值 | 对应源 |
|---|---|---|
| `--shadow-nav` | `0 4px 12.25px rgb(0 0 0 / 9%)` | Header 的 CSS drop-shadow |
| `--shadow-chip` | `0 4px 5.15px rgb(0 0 0 / 5%)` | 语言 chips 的 CSS drop-shadow |
| `--shadow-card` | `0 4px 12px rgb(2 31 24 / 6%)` | 服务入口第一卡 / BMI 背景内壳的 box-shadow |
| `--shadow-panel` | `0 4px 21.6px rgb(2 29 23 / 6%)` | 原始 card shadow 2 / 移动 OnlineCare box-shadow |
| `--shadow-faq` | `0 4px 12px rgb(2 34 39 / 8%)` | 展开 FAQ |
| `--shadow-profile` | `1px 1px 2px #0000001a, 2px 3px 4px #00000017, 5px 7px 5px #0000000d, 9px 13px 6px #00000003, 15px 20px 7px #00000000` | variables 的 Card Shadow |

Figma blur 半径和 CSS `filter: drop-shadow()` 标准差并非同一个参数；例如 card shadow 2 的 21.6 在生成 filter 中是 10.8。不能把 filter 字符串原封不动搬成 box-shadow；上表注明了来源类型，P3/P5 按真实形状对图确认。

## 读稿结论与验收边界

- 三张整板已逐段查看；Work Sans / Syne 分工、两端标题值、主要色板 / 间距 / 阴影已建立可追溯映射。
- 成功故事的社交图标沿用已批准的纯装饰决议；Profile 两张卡不是 BMI 输入区，不需要独立全局状态。
- 画板外 Weight Loss 与空的移动 BMI 框、错误 FAQ 绑定、拼写 / 产品图 / 对比度问题统一进入 deviations；2026-09-17 用户已整体敲定，实施状态以执行表为准。
- P1 交付的是读稿与实现依据；UI 尚未实现，不声明像素验收、键盘走查或动效验收通过。P2 可据区块清单设计契约，P3 可据已核 token 开工；2026-09-17 用户改为先逐字实现源稿，缺陷全部进入 deviations，整体 review 后才修正。

- 2026-09-17 P3 复核：Sleep 的大标题是 “Sleep”，两句说明为正文；桌面第二句末尾无句号且分行，移动有句号，mock 分别保留。Work Sans 400/500 与 Syne 400/500 共用 next/font 配置；基础 story 已核字号锚点、容器与字体加载，产品默认稿与动画尚未实施。

- 2026-09-17 P4 复核：11 原语沿用源角色，补齐 FAQ 12px 圆角 / 16→24px 内距 / 4px 分隔 / 白色正文 / 虚线，以及 BMI segmented 的 0.5px 外圈 / 4.5px 内衬 / 4px 间距。运行标本、截图和库级采用边界见 [UI 总览 P4](uiux/overview.md#p4-原语实景与操作入口)。79 原语 stories 在 375/1440 通过 axe 与横溢出检查；同 agent 以 Monet 职责复核字体、层级、对齐、形状和状态，不声称完整首页像素验收。
