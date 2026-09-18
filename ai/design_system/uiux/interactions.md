# 控件与交互草案

> 2026-09-17 · 产品方案已整体敲定；P4 原语库与 P5 产品集成已验收。返回 [UI 总览](overview.md) / [设计系统](../design-system.md)。
> 以下将现有 [MOTION](../../features/MOTION.md)、[A11Y](../../features/A11Y.md)、[STORYBOOK](../../features/STORYBOOK.md) 规则落到具体使用场景。本轮已批改动按 deviations 执行；新的偏差仍先登记 Pending 并待用户确认。

## 统一状态与动效

| 对象 | 默认来源 | 必备状态 / 拟定反馈 | 状态 story |
|---|---|---|---|
| Button / IconButton / 导航链接 | 稿件深绿、白色、描边 CTA | Hover 背景一级变化，不加箭头装饰位移；Focus 2px accent 外环 + 2px offset；Pressed scale .97（指针；键盘 / 减动效不缩放）；Disabled opacity .5、不可触发且退出 Tab | Default / Hover / Focus / Pressed / Disabled |
| Card | 对应源色与阴影 | 可操作卡采用已审颜色/按压反馈（hover/fine 门控）；不增加装饰位移或阴影动画；纯信息卡不伪装点击；卡内 CTA 独立交互 | Default / InteractiveHover（如使用） |
| Chip | 原稿语言标签含高亮底 | 原语可支持 default / selected / interactive 状态；D-01 已批语言带仅作展示，不触发 locale 切换 | Default / Selected；交互变体补 Hover / Focus / Pressed / Disabled |
| Accordion | FAQ 首项开、其余闭 | summary 原生点击 / Enter / Space；focus 环；展开内容与箭头同步，收起后内容退出可达树 | Collapsed / Expanded / Focus / Hover / Pressed |
| Carousel | OnlineCare 两个方向箭头 | 非循环、手动前后切换；首末 disabled；可触摸横滑，切换后焦点留在触发按钮 | Default / FirstSlide / LastSlide / Keyboard / ReducedMotion |
| Marquee | 语言双行、信任条单行 | 持久 Pause / Resume + hover / focus-within 暂停；复制轨道 aria-hidden；减动效静态展示，所有真实条目仍可读 | Default / Paused / ReducedMotion |
| NumberField | BMI 高 / 重输入 | Focus / Invalid / Disabled；标签与单位独立可读，错误关联字段 | Default / Focus / Invalid / Disabled |
| RadioGroup | BMI Sex | 原生 radio、同组 name、fieldset/legend；方向键切换、Space 选中 | Default / Focus / Checked / Disabled |
| SegmentedControl | BMI 英制 / 公制 | 互斥选项使用原生 radio，不伪造 tab 面板；focus、选中与禁用可辨 | Default / Hover / Focus / Selected / Disabled |
| Rating | 证言星星 | 只读评分；有文本说明，不做可点打分 | Default |

2026-09-17 P1.8 已采用 Emil 规范；唯一数值表见 [MOTION §二](../../features/MOTION.md)，不在本文维护第二套 token。hover 统一 `(hover: hover) and (pointer: fine)` 门控，键盘即时反馈；快速重复触发从当前状态反向。减动效去位移 / 缩放 / 高度动画 / 延迟，静态展示轨道，保留有助理解的短透明度与颜色过渡；任何状态都不能隐藏实际内容。

跑马灯是持续循环，不把一个完整循环误设为 300ms；<300ms 预算针对普通 UI 状态过渡。D-01 已批：持续运动配持久 Pause / Resume，hover / focus 额外暂停；P5 接入并验证触控。

## 移动菜单

来源：[menu.png](../figma/menu.png)。拟实现为覆盖式 modal navigation：背景不可操作、禁止背景滚动，菜单自身在矮屏可滚。打开时 focus 到关闭按钮；Tab / Shift+Tab 留在层内，Escape / 关闭按钮关闭并回焦点；产品锚点跳转的焦点处理见总览。跨到桌面断点时清理锁滚和焦点限制，不能留下透明遮罩。

状态：Closed → Opening → Open → Closing → Closed。普通指针开合 250ms 进场、200ms 退出，用 MOTION 的 drawer 曲线，重复触发可反向；键盘开合即时响应，减动效移除位移。原生 dialog 关闭时机与退出动画协调；CSS 离散过渡不支持时即时安全降级。不要把底层 page 放进被错误包含 dialog 的 aria-hidden 容器。拟用原生 `<dialog>` 避免新增 UI 库，实际实现仍需键盘验证。

这些焦点与背景规则依据 [W3C APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)，不是截图可证明的行为。

## OnlineCare 轮播

4 张内容卡，首屏桌面多卡、移动一张带下一张边缘；容器限制溢出，页面无横滚。前后按钮按当前可见范围移动，resize 后重算最大位置；末尾不足一整卡时也必须能看全。按钮不自动移动焦点，不自动播放，不把 SuccessStories 改成轮播。

原生 scroll-snap + scrollTo 优先，指针可 smooth；键盘 / reduced-motion 切换即时滚动。键盘 Tab 到方向按钮、Enter / Space 切换；滑动不抢页面纵向手势。读屏可获当前范围（如 “1–3 of 4”），不可见卡中的控件不应凭空进入 Tab；本项目卡内聊天 UI 本来是静态示意。状态与按钮行为参考 [W3C APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)。

## BMI 表单与结果（C-04 已实施）

源稿英制选中、Female 选中、输入均为 0，却给出 56 的结果；这不是可用的真实初始状态。C-04 已批以未计算态开始，提交有效输入后显示结果。

拟定状态：Idle → Invalid 或 Calculated；切单位保留物理量，不能把 180cm 直接显示成 180ft。空值、非数值、非有限值与非正身高 / 体重显示字段错误；编辑后结果标为过期或清除，不能把旧值当作新输入计算结果。结果为本地纯函数输出，不模拟网络 loading / 保存成功；不根据 BMI 自动承诺用药资格。

Sex 在源稿里存在，作为资料选项保留；计算公式与单位换算归 `lib/bmi.ts` 的 P5 实施规范，不应凭空把性别编成分数权重。结果文本与分类边界须逐条测试，C-05 已修正文案为 18.5–<25 / 25–<30，P5 按未四舍五入的值分类，边界测试须防止显示值与分类造成误解。错误提示 `aria-describedby` / `aria-invalid`；提交错误聚焦首个无效项，有效结果可用 polite status 通知，不强制把键盘焦点跳走。

RadioGroup / SegmentedControl 的互斥与键盘语义参考 [W3C APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)，采用原生输入优先。

## FAQ 与静态展示

FAQ 每项独立原生 `<details><summary>`，默认第一项打开；没有证据要求互斥折叠。采用 JS 量高度的 ≤200ms height / opacity 过渡（Emil recipe 明确例外），不向 auto 插值；键盘 / 减动效即时开合。动画不能先移除内容再量高度，打开 / 关闭 / 快速反向都要测。C-11 已批并修正后三题答案，保留第一条州覆盖原答；原始重复答案保存在 deviations 与源快照。答案简短且来自已有页面信息 / FDA 释义。

Profile 两张分数卡、OnlineCare 聊天示意、证言星级和证言社交图标均为静态展示。只读评分提供可理解文本；示意图的 alt 表达用途，不让读屏遍历装饰性聊天按钮。Footer 社交按 D-02 为 demo 控件；证言社交仍是不可交互装饰。

## 后续验收路径

1. 键盘从 logo / 主导航 → Hero CTA → 产品入口 → WeightLoss / BMI → 两个产品 CTA → OnlineCare 前后按钮 → FAQ → Final CTA → Footer，不进入纯装饰元素。
2. 移动菜单覆盖打开 / Escape / 产品跳转 / 重复开闭 / 矮屏滚动 / 切桌面；每次关闭都恢复页面可操作性。
3. BMI 空值 / 零 / 负值 / 英公制往返 / 重算；Carousel 两端 / 触摸 / resize；FAQ 展开 / 收起 / 快速反向。
4. hover、focus-visible、pressed、disabled、reduced-motion 单独 story；运行时检查保真、焦点与遮挡。这里只建立验收清单，没有声称测试已执行。
5. 每个完成件按 [MOTION §四](../../features/MOTION.md) 做 review-animations 与 Emil 真实画面视觉检测，Block 修完重审；P5 全页追加只读机会 / 拒绝清单。正常速度、慢放、触控与减动效的实测证据不能被静态 story 代替。


## P4 已实现的库级边界

11 原语与全部状态 stories 已完成，详见 [COMPONENTS 测试记录](../../features/COMPONENTS.md)。库层采用颜色 hover，不增加箭头 / 卡片装饰位移；只有可操作 Chip / 链接 Card 有按压反馈。RadioGroup 与 SegmentedControl 共用原生 radio 语义；NumberField 保留原生数字键盘编辑，以原稿绿色双箭头覆盖浏览器 spinner，错误文本关联字段。默认 `<details>` 可在没有 JS 时工作；指针 measured height / opacity 200ms，键盘 / reduce 即时。

## C-01 移动端长页方案（2026-09-17，已敲定未做）

- 用户已接受以下推荐；C-01 为 Approved — Completed，P5.5 已按此实现并验收。
- 源 XML：板外组 `2002:4113` 高 2305px，介绍 `2002:4114` 高 678px，两款套餐 `2002:4136` 高 920px，BMI 空壳 `2002:4155` 高 587px。直接加入 9583px 移动主板约增加 24%；这是稿面几何估算；P5 实测 375px 默认介绍 + 套餐 + 折叠 BMI 含间距共 1407.7px，完整验收见下述 P5 记录。
- 研究依据：[NN/g 移动手风琴](https://www.nngroup.com/articles/mobile-accordions/) 支持以可见标题组织可选内容，但提醒展开过长与滚动跳转会造成迷失；[GOV.UK Tabs](https://design-system.service.gov.uk/components/tabs/) 不建议将需比较或顺序阅读的内容分藏不同 tab；[Baymard 产品页研究](https://baymard.com/research-articles/avoid-horizontal-tabs) 建议移动长页考虑纵向折叠，而非隐藏主内容的横向 tabs。这些通用研究不是 Apsu 的用户测试结果。
- 已采用：介绍保持可见；两款套餐改成上下紧凑卡，名称、价格、CTA 同时可发现，产品图缩成缩略图；BMI 标题与说明可见，整套计算器默认折叠、原地展开，收起保留输入，不把表单拆成多个折叠步骤。移动默认态约 1100–1400px 仅作草图预算，需原型验证。桌面布局保留。
- 考虑但未采用：保留完整套餐卡，用手动横向 scroll-snap 展示并露出下一张，配明确控制；BMI 同样按需展开。代价是第二款套餐发现率与来回比较负担，需要验证。全量纵向堆叠加锚点最接近板外稿，但只改善跳转，不能缩短页面。
- 不推荐将「介绍 / 套餐 / BMI」全部放入互斥 tab，或将整个减重区默认隐藏；核心产品信息应可见。BMI 初始结果和文案已分别按 C-04 / C-05 敲定；默认不显示结果，区间文案已修正，计算逻辑及分类边界测试已通过。

Carousel 手动且非循环，轨道首尾位置扣除 focus 留白并同步 scroll-padding；完全屏外卡 inert，正在获得焦点的内容离屏时回到轨道。Marquee 默认静态；显式 autoPlay 的隔离候选才出现 Pause / Resume，用户暂停、hover / focus、后台 visibility 分别控制暂停；reduce 展开所有原始条目，重复轨道 aria-hidden + inert。按钮名称随动作变化，因此不使用 aria-pressed；与固定名称的 Chip toggle 区分。

这些 P4 库行为已按 D-01/D-03 在真实页面验收；P5 原生 dialog 菜单、BMI 计算、导航锚点与焦点链已实施。无目标业务控件按 D-02 展示，不模拟业务效果。正常 / reduce / 键盘 / 触控模拟与快速反向结果见 docs/p5-review.md。
