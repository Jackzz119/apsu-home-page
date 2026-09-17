# MOTION — 交互态与动效

> **feature 文档 · 规范类 + 功能开发**。
> **管理 scope**：全站交互状态、动效 token、工具选择、Emil 实施 / 动效审查 / 视觉复核工作流与 D 类自设计状态。改任何过渡、动画、状态样式先读这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 原 PROJECT §5.5 已迁入本文；决策入口为 PROJECT §3.1。P1.8 已完成技能与规范准备，运行时实现仍归 P3–P5。
> 主要依据：四个 Emil 技能及固定版本见 [JASKILL](../JASKILL.md)。具体默认值是项目对上游预算的选择，不声称全是上游唯一值。

## 一、目标与边界

甲方 §4D 要求可交互元素有 hover / focus / pressed 状态与过渡，一致与克制优先。每个拟加动效先用 `animate` 判断频率和目的，允许不加动画；键盘触发和高频操作即时响应，状态仍必须清楚。不要让进入动画延迟焦点、阅读或可点击时机。

用户已批准以 Emil 为主要规范、保留 motion 并由实现者选择使用范围；具体偏离稿件的默认态与 D 类交互方案，仍按 TODO 候选确认后先登记 `docs/deviations.md` 再实现。本轮不提前批准抽屉拖拽、首屏 stagger 或新增暂停按钮。

## 二、统一 token 与状态

P3 在 `styles/tokens.css` 与 `lib/motion.ts` 落地同一套值；JS 时间单位按 API 换算，禁止另一套近似曲线。

| token | 项目采用值 | 用途 / 上游依据 |
|---|---|---|
| `--dur-fast` | 160ms | 按压进入、轻量反馈；按钮预算 100–160ms |
| `--dur-release` | 100ms | 按压释放，比进入快；同属按钮预算 |
| `--dur-base` | 200ms | 状态切换、手风琴上限；RECIPES 的 accordion 为 200ms |
| `--dur-slow` | 250ms | 菜单进入；在 drawer 200–500ms 范围内，并保持常规 UI <300ms |
| `--dur-stagger` | 50ms | 仅在获批且有目的的首次组入场中使用；上游间隔 30–80ms |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | 常规进入 / 退出 / 按压 |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | 屏内移动 / 形态变化 |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | 抽屉专用曲线 |

颜色 hover 使用 `ease`，持续跑马灯使用 `linear`；移除旧 `--ease-in`，不再统一采用「退出 = 进入 × 0.75」。常规 UI 必须 <300ms；循环周期不属于该上限，spring / 解释性动画若超出要给明确理由与实测证据。

**状态规则（实现时登记 deviations D 类）**

1. hover：仅在 `@media (hover: hover) and (pointer: fine)` 内生效。高频反馈以颜色为主；箭头最多右移 2px，可操作卡最多上移 2px，纯信息卡不动。阴影若切换，不直接动画 box-shadow；确有需要时用伪元素 opacity，保持默认稿一致。
2. focus-visible：立即出现的 2px 强调色外环 + 2px offset；不延迟焦点、不用位移动画装饰键盘导航。
3. pressed：指针按压 `scale(0.97)`，进入 160ms、释放 100ms，使用 `--ease-out`；键盘激活不缩放，减动效下移除缩放。
4. disabled：`opacity: .5` + `cursor: not-allowed`，不可触发且退出 Tab；不能只做灰色外观。
5. 轮播手动非循环，边界箭头 disabled；跑马灯 hover / focus-within 暂停，持续暂停与触控入口按候选 #11 决定。
6. reduced-motion：移除位移、缩放、高度过渡、stagger 延迟与自动滚动；允许有助理解的短 opacity / 颜色变化，必要时即时切换。内容始终可读，不能停在透明或关闭起始态。Motion 分支用 `useReducedMotion`，CSS 分支用媒体查询。
7. 性能与打断：列明 transition 属性，禁 `transition: all`；主要用 transform / opacity。快速开关从当前视觉状态反向，不排队、不用每次归零的 keyframes；禁 scale(0)、视差与无意义 bounce。Motion 的定时 transform 动画写完整 `transform` 字符串，不照抄 x/y/scale 简写；手势数值路径另做负载实测，不宣称换写法就保证合成加速。

## 三、工具选择与项目适配

按 `animate` 的顺序选最便宜且满足需求的工具：CSS transition → `@starting-style` → CSS animation → WAAPI → Motion。已有依赖不是全站使用理由，也不预先把 Motion 限死在唯一组件；有 spring、layout、exit 或手势需求才考虑，并在 README 说明实际使用处。

| 场景 | 默认实现方向 | 实施检查 |
|---|---|---|
| Button / Chip / Card 状态 | CSS transition | 媒体门控、键盘即时态、具体属性、快速反向 |
| FAQ | 原生 details + JS 量高度，CSS height / opacity，≤200ms | 高度动画是明确例外；不能直接向 auto 插值；关闭完成前不先删内容，保持语义 / 可达树正确 |
| 双跑马灯 | CSS animation linear | 暂停、后台节制、重复轨道 aria-hidden、减动效静态可读 |
| OnlineCare | 原生 scroll-snap + scrollTo | 指针可 smooth；键盘 / 减动效即时滚动；焦点与位置边界正确 |
| 首屏组入场（若采用） | CSS animation，50ms stagger | 先过目的与频率门禁；不阻塞 LCP / 阅读 / 点击，无 JS 也显示内容 |
| 移动菜单 | 原生 dialog + CSS 开合优先 | 实测 `@starting-style`、`allow-discrete`、display / overlay 的退出时机；不支持时即时安全降级，不能卡住焦点或背景锁滚 |
| 拖拽关闭（尚未决定） | Motion spring / velocity | 原生菜单语义不变；pointer capture、多指保护、边界阻尼、反向、取消；真机测试，速度单位不能直接套错 |

上游与项目冲突按 [JASKILL 项目适配](../JASKILL.md) 执行：不调用 pick-ui-library、不安装 UI 库、使用 `motion/react`、不假设 Base UI 变量存在。

审查时显式解释上游规则的例外：RECIPES 允许手风琴 height，不能因审查总则的布局属性禁令一票误杀；reduced-motion / backdrop 的纯 opacity 也是有意例外，不因审查中的 pure-fade 提示反而补位移。上游 drawer recipe 的 500ms 不直接照搬，本项目普通开合采用 250ms / 200ms。颜色反馈允许短过渡，但不得把 CSS / WAAPI 或 transform 字符串当作已通过性能测试的证据。

## 四、正式 UI 开发工作流（P3–P5）

1. **P3 开工**：完整读 `emil-design-eng`，对照本文建立 CSS / JS token；校验单位、曲线和减动效策略，无运行时实现前不打通过。
2. **每个交互施工**：调用 `animate`，读对应 RECIPES，依次记录「该不该动 → 目的 → 工具 → 属性 → 曲线 / 时长 → 打断 / 退出 → 可访问性」。不提供无判断的选项菜单。
3. **每个原语 / 区块动效完成**：按用户本轮明确要求，显式调用 `review-animations` + STANDARDS，输出带 file:line 的 Before / After / Why 表及 Block / Approve。Block 修完重审；无动效记 N/A 与不动的理由，不假造 findings。
4. **Emil 视觉检测**：用 `emil-design-eng` Review Checklist 检查真实 375 / 1440 画面与状态，覆盖层级、字体 / 对齐、圆角 / 阴影、控件反馈与全页一致性；UI Tailor 做流程验证，Monet 复核实际截图 / 动画。代码通过不等于视觉通过；同一 agent 自审须标明。默认稿差异仍走 deviations。
5. **浏览器感受与性能复核**：正常速度及 2–5 倍慢放 / 逐帧看进入退出、焦点、反向与连续输入；测 hover/fine 与 touch/coarse、键盘和 reduced-motion；有 JS 动画时加忙主线程 / CPU 节流观察。无真机条件就记录限制，不宣称真机已通过。
6. **P5 全页收口**：只读运行 `find-animation-opportunities`，最多 5–7 个建议、2–5 个真实拒绝项（不足时按实际数量说明，不凑数），带位置与理由。建议不自动实施；进入 TODO 候选，获批后才登记 D 类并实现。拒绝理由作为 README / D 类决策说明素材，不将未采用建议写成已交付状态。

每个完成件在 COMPONENTS 测试记录中写「组件 / 日期 / 技能版本 / review 结论 / 浏览器与视口 / 正常及减动效 / 视觉结论 / 未测限制」，证据链接到现有 story 或实际截图。review 的表在当前 session 输出；长期决定回本文或交互文档，不另建逐轮报告。Storybook 的静态 pseudo-state 不替代运行中开合与打断验证。

## 五、待实现 / 已知问题

- 四个技能及参考文档已安装、登记、固定版本；token 与组件动效尚未实现。
- D 类行为与 TODO #11 等未定交互仍需方案确认；本轮只完成准备，不是 UI 动效验收。

## 实现计划

进度：1 / 4 subtasks 完成（25%）

- [x] ST-1: P1.8 安装四个 Emil 技能、记录来源 / 许可证、登记 JASKILL、对齐规范并接入 P3–P5 检测流程（2026-09-17）
- [ ] ST-2: P3.2 落地 `lib/motion.ts` + `styles/tokens.css` 动效 token（§二）
- [ ] ST-3: P4/P5 逐组件实现状态规则，登记 D-xx，动效审查与 Emil 视觉检测通过（§四）；commit 时机与切分仍由用户决定
- [ ] ST-4: P5 全页机会 / 拒绝清单 + reduced-motion / 键盘 / 触控 / 性能复核，README 写明实际 Motion 使用边界

## 测试记录

- 2026-09-17：准备阶段核验 4 个技能的 6 份 Markdown 与固定上游 commit 逐字节一致；各目录附上游 MIT LICENSE。两个 agent 链接均可读取，shelf adopt 登记 4 项。未执行组件动效、视觉或真机验收，因 UI 尚未实现。
