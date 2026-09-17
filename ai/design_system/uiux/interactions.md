# 控件与交互草案

> 2026-09-17 · P1 方案，尚未实现。返回 [UI 总览](overview.md) / [设计系统](../design-system.md)。
> 以下将现有 [MOTION](../../features/MOTION.md)、[A11Y](../../features/A11Y.md)、[STORYBOOK](../../features/STORYBOOK.md) 规则落到具体使用场景。新增或修正默认态需用户确认，再登记 deviations；本文不是修正授权，也不提前分配 D 编号。

## 统一状态与动效

| 对象 | 默认来源 | 必备状态 / 拟定反馈 | 状态 story |
|---|---|---|---|
| Button / IconButton / 导航链接 | 稿件深绿、白色、描边 CTA | Hover 背景一级变化 / 箭头右移 2px；Focus 2px accent 外环 + 2px offset；Pressed scale .97（指针；键盘 / 减动效不缩放）；Disabled opacity .5、不可触发且退出 Tab | Default / Hover / Focus / Pressed / Disabled |
| Card | 对应源色与阴影 | 可操作卡才 Hover 上移至多 2px（hover/fine 门控）；不直接动画阴影；纯信息卡不伪装点击；卡内 CTA 独立交互 | Default / InteractiveHover（如使用） |
| Chip | 原稿语言标签含高亮底 | 原语可支持 default / selected / interactive 状态；语言带当前只证明展示，选择后的产品行为待候选 #11 确认 | Default / Selected；交互变体补 Hover / Focus / Pressed / Disabled |
| Accordion | FAQ 首项开、其余闭 | summary 原生点击 / Enter / Space；focus 环；展开内容与箭头同步，收起后内容退出可达树 | Collapsed / Expanded / Focus / Hover / Pressed |
| Carousel | OnlineCare 两个方向箭头 | 非循环、手动前后切换；首末 disabled；可触摸横滑，切换后焦点留在触发按钮 | Default / FirstSlide / LastSlide / Keyboard / ReducedMotion |
| Marquee | 语言双行、信任条单行 | hover / focus-within 暂停；复制轨道 aria-hidden；减动效静态展示，所有真实条目仍可读 | Default / Paused / ReducedMotion |
| NumberField | BMI 高 / 重输入 | Focus / Invalid / Disabled；标签与单位独立可读，错误关联字段 | Default / Focus / Invalid / Disabled |
| RadioGroup | BMI Sex | 原生 radio、同组 name、fieldset/legend；方向键切换、Space 选中 | Default / Focus / Checked / Disabled |
| SegmentedControl | BMI 英制 / 公制 | 互斥选项使用原生 radio，不伪造 tab 面板；focus、选中与禁用可辨 | Default / Hover / Focus / Selected / Disabled |
| Rating | 证言星星 | 只读评分；有文本说明，不做可点打分 | Default |

2026-09-17 P1.8 已采用 Emil 规范；唯一数值表见 [MOTION §二](../../features/MOTION.md)，不在本文维护第二套 token。hover 统一 `(hover: hover) and (pointer: fine)` 门控，键盘即时反馈；快速重复触发从当前状态反向。减动效去位移 / 缩放 / 高度动画 / 延迟，静态展示轨道，保留有助理解的短透明度与颜色过渡；任何状态都不能隐藏实际内容。

跑马灯是持续循环，不把一个完整循环误设为 300ms；<300ms 预算针对普通 UI 状态过渡。连续滚动的速度、暂停入口与触控方案留在 D 类实施前确认（候选 #11），P1 不擅自加一颗设计稿没有的控制按钮。

## 移动菜单

来源：[menu.png](../figma/menu.png)。拟实现为覆盖式 modal navigation：背景不可操作、禁止背景滚动，菜单自身在矮屏可滚。打开时 focus 到关闭按钮；Tab / Shift+Tab 留在层内，Escape / 关闭按钮关闭并回焦点；产品锚点跳转的焦点处理见总览。跨到桌面断点时清理锁滚和焦点限制，不能留下透明遮罩。

状态：Closed → Opening → Open → Closing → Closed。普通指针开合 250ms 进场、200ms 退出，用 MOTION 的 drawer 曲线，重复触发可反向；键盘开合即时响应，减动效移除位移。原生 dialog 关闭时机与退出动画协调；CSS 离散过渡不支持时即时安全降级。不要把底层 page 放进被错误包含 dialog 的 aria-hidden 容器。拟用原生 `<dialog>` 避免新增 UI 库，实际实现仍需键盘验证。

这些焦点与背景规则依据 [W3C APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)，不是截图可证明的行为。

## OnlineCare 轮播

4 张内容卡，首屏桌面多卡、移动一张带下一张边缘；容器限制溢出，页面无横滚。前后按钮按当前可见范围移动，resize 后重算最大位置；末尾不足一整卡时也必须能看全。按钮不自动移动焦点，不自动播放，不把 SuccessStories 改成轮播。

原生 scroll-snap + scrollTo 优先，指针可 smooth；键盘 / reduced-motion 切换即时滚动。键盘 Tab 到方向按钮、Enter / Space 切换；滑动不抢页面纵向手势。读屏可获当前范围（如 “1–3 of 4”），不可见卡中的控件不应凭空进入 Tab；本项目卡内聊天 UI 本来是静态示意。状态与按钮行为参考 [W3C APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)。

## BMI 表单与结果（候选修正方案）

源稿英制选中、Female 选中、输入均为 0，却给出 56 的结果；这不是可用的真实初始状态。候选 #5 建议以未计算态开始，提交有效输入后显示结果；改动前需用户批准。

拟定状态：Idle → Invalid 或 Calculated；切单位保留物理量，不能把 180cm 直接显示成 180ft。空值、非数值、非有限值与非正身高 / 体重显示字段错误；编辑后结果标为过期或清除，不能把旧值当作新输入计算结果。结果为本地纯函数输出，不模拟网络 loading / 保存成功；不根据 BMI 自动承诺用药资格。

Sex 在源稿里存在，作为资料选项保留；计算公式与单位换算归 `lib/bmi.ts` 的 P5 实施规范，不应凭空把性别编成分数权重。结果文本与分类边界须逐条测试，修正错误范围符号走候选 #5。错误提示 `aria-describedby` / `aria-invalid`；提交错误聚焦首个无效项，有效结果可用 polite status 通知，不强制把键盘焦点跳走。

RadioGroup / SegmentedControl 的互斥与键盘语义参考 [W3C APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)，采用原生输入优先。

## FAQ 与静态展示

FAQ 每项独立原生 `<details><summary>`，默认第一项打开；没有证据要求互斥折叠。采用 JS 量高度的 ≤200ms height / opacity 过渡（Emil recipe 明确例外），不向 auto 插值；键盘 / 减动效即时开合。动画不能先移除内容再量高度，打开 / 关闭 / 快速反向都要测。当前另外三题的隐藏答案错误复用了州覆盖回答，候选 #13 未批准前不得当真实内容交付；不能拿组件定义的 membership 默认答案替换它们。

Profile 两张分数卡、OnlineCare 聊天示意、证言星级和证言社交图标均为静态展示。只读评分提供可理解文本；示意图的 alt 表达用途，不让读屏遍历装饰性聊天按钮。Footer 社交是否作为真实链接由真实目标数据决定，与已批准的证言图标约定分开。

## 后续验收路径

1. 键盘从 logo / 主导航 → Hero CTA → 产品入口 → WeightLoss / BMI → 两个产品 CTA → OnlineCare 前后按钮 → FAQ → Final CTA → Footer，不进入纯装饰元素。
2. 移动菜单覆盖打开 / Escape / 产品跳转 / 重复开闭 / 矮屏滚动 / 切桌面；每次关闭都恢复页面可操作性。
3. BMI 空值 / 零 / 负值 / 英公制往返 / 重算；Carousel 两端 / 触摸 / resize；FAQ 展开 / 收起 / 快速反向。
4. hover、focus-visible、pressed、disabled、reduced-motion 单独 story；运行时检查保真、焦点与遮挡。这里只建立验收清单，没有声称测试已执行。
5. 每个完成件按 [MOTION §四](../../features/MOTION.md) 做 review-animations 与 Emil 真实画面视觉检测，Block 修完重审；P5 全页追加只读机会 / 拒绝清单。正常速度、慢放、触控与减动效的实测证据不能被静态 story 代替。
