# RESPONSIVE — 响应式策略

> **feature 文档 · 规范类 + 功能开发**。
> **管理 scope**：保真线（375 / 1440 两板）与完整性线（320–1920）的达标定义、流式 + 三断点策略、断点语义名与阈值、容器规则、320–375 保底方式；扫描脚本的实现归 SELFCHECK.md §三。改断点、容器宽、`clamp()` 锚点先改这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §5.4「响应式规范」 迁出。PROJECT.md 只保留 §3.2 索引与 §3.1 口供；本文与口供冲突时先改口供。

---

## 一、目标

甲方 §4A 保真只看两板，§4B 完整性看 320–1920 每个宽度（不横滚、导航不换行、不重叠不裁切），Bonus 是板间与板外的优雅适配，答辩会问「怎么做到的」。本文定策略，README「Responsive strategy」节是它的英文版。

## 二、响应式规范

**两条线分开达标**：

- **保真线**：375 与 1440 两块板逐区块对照 Figma，默认态。
- **完整性线**：320–1920 任意宽度：`scrollWidth <= innerWidth`、导航项同一行、无重叠无裁切。

**策略：流式为主，形态断点为辅**

1. 字号与大间距用 `clamp()`，两端锚点 = 375 稿值与 1440 稿值，中间自动插值。
2. 只在布局**换形态**处设断点，命名固定为：`sm`（≥640，卡片 1→2 列）、`lg`（≥1024，导航展开 / 特写左右排）、`xl`（≥1280，内容容器到满宽）。具体阈值以 Header 不换行的实测为准，可调但要写进 deviations。
3. 容器 `max-width: 1440px` 居中，背景铺满；>1440 不放大内容。
4. 320–375 区间靠自动换行与 `min-w-0` 保底，不另做设计。
5. **门禁**：`npm run check:responsive` 在 320 / 360 / 375 / 414 / 640 / 768 / 1024 / 1280 / 1440 / 1600 / 1920 截图并断言以上三条；结果表写入 `docs/responsive-report.md`，README 引用。

## 三、与其他文档的关系

- 扫描脚本、11 个宽度、三条断言、`docs/responsive-report.md`：SELFCHECK.md §三
- `clamp()` 字号与间距 token：TOKENS.md §三
- 导航不换行的实测阈值一旦改动 `lg`，写进 `docs/deviations.md`（PROJECT §6）并回改本文 §二 第 2 条

## 五、Bonus 证据形式（2026-09-17 拍板）

| 产物 | 何时生成 | 入库 |
|---|---|---|
| `docs/responsive-report.md` | `npm run check:responsive` 每次运行重生成 | 是，随区块 commit 提交 |
| `docs/responsive-shots/<width>.png` | 每次运行重生成的原始整页截图 | 否，`.gitignore` |
| `docs/responsive-report.png` | P6 收口跑 `--composite`；后续布局变化再刷新，11 宽度缩成一张横向拼图 | 是，随 P6 提交 |

README「Responsive strategy」节三句话：策略是 `clamp()` 流式 + 三个形态断点 + 容器封顶；证据是这张表；画面是这张图。

## 四、待实现 / 已知问题

- Header 在 1024px 已实测导航单行且无相邻操作重叠，保留 sm/lg/xl = 640/1024/1280。
- ~~板间适配的「证据」形式待定~~ → 2026-09-17 拍板（PROJECT §11 #5）：表每次跑都重生成并提交，拼图首次交付随本轮 P6 收口，后续布局变化再刷新，见 §五

## 实现计划

进度：4 / 4 subtasks 完成（100%）；用户要求本轮完成 P6，拼图由 P8.4 提前交付

- [x] ST-1: 容器与断点在 `tokens.css` / Tailwind 配置落地（随 TOKENS ST-2）
- [x] ST-2: Header 实做时确定 `lg` 阈值并回写
- [x] ST-3: 全页 320–1920 扫描通过后，README「Responsive strategy」写三句：策略（clamp 流式 + 三形态断点 + 容器封顶）、证据（`docs/responsive-report.md` 表）、画面（`docs/responsive-report.png` 拼图）
- [x] ST-4: P6 收口拍摄 11 宽度整页截图，拼成一张横向 PNG 放 `docs/responsive-report.png`（脚本产出，SELFCHECK ST-1 的 `--composite` 模式）

## 测试记录

- 2026-09-17：ST-1 完成，sm/lg/xl = 640/1024/1280，移除 Tailwind 其他默认断点；container-page 封顶 1440。Chromium 的 Foundations story 在 375/1440/1920 均无横向溢出，边距 20/60/60px，容器 375/1440/1440px。Header 阈值、11 宽全页扫描与最终拼图仍归 ST-2–4，不用基础页测试替代。

- 2026-09-17 P5：生产页 320/360/375/414/640/768/1024/1280/1440/1600/1920 三项断言全部通过，见 [结果表](../../docs/responsive-report.md)。BMI 展开额外覆盖 320/640/768/1024/1280，无横溢出。375/1440 全页实景在 [P5 review](../../docs/p5-review.md)；最终 11 宽拼图留 P8，未提前宣称已生成。

- 2026-09-17 P6：从已提交代码 `9a26050` 独立导出，在 Node 22.23.1 下 npm ci / build 后启动生产服务，11 宽三断言全过，拼图与表已接入 README。BMI 默认 / 错误 / 结果 / 编辑清除几何另有 11 宽回归；375/1440 实景由同 agent UI Tailor / Monet 复核。后续布局变化需刷新证据，不将 P7/P8 整体标记完成。
