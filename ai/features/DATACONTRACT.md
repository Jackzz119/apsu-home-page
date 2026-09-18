# DATACONTRACT — 数据契约管理

> **feature 文档 · 规范类**（不是单个功能的实施文档）。
> **管理 scope**：`content/schema.ts` 的 zod 契约与类型推导规则、mock 数据约束、`getHomePage()` 唯一取数入口、Route Handler 假后端、`NEXT_PUBLIC_API_URL` 切真后端的方式、字段级 JSDoc 要求。改数据形状先改这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §5.2「数据契约规范」 迁出。PROJECT.md 只保留索引、scope 与「项目决策口供」（§3.1）；本文与口供冲突时，先改口供再改这里。

---

## 一、目标

甲方原文：「You design the data shapes for all dynamic content — they are the future API contract — and provide mock data conforming to them. **We read the types first.**」本文保证考官打开 `content/schema.ts` 就能读懂整个首页的数据形状，且 mock、页面、假后端三者说的是同一份契约。

## 二、数据契约规范

1. `content/schema.ts` 是**唯一**的数据形状真源；TS 类型只允许 `z.infer` 得到，禁止手写重复 interface。
2. 每个 schema 与字段带 JSDoc，说明业务含义与来源，写给后端看。
3. 金额是结构不是字符串：`{ amount: 2000, currency: "USD", interval: "month", prefix: "From" }`。
4. 图片是结构：`{ src, alt, width, height }`。
5. 同类不同形态用 `z.discriminatedUnion("kind", ...)`，禁止用可选字段堆出"可能有图可能没图"。
6. id 一律 `z.string()` 并在 JSDoc 注明"后端稳定 id"，前端不生成。
7. `HomePage` 是根类型，字段顺序 = 页面区块顺序。
8. mock 用 `satisfies HomePage` 约束；另有 vitest 用例 `HomePage.parse(homeMock)` 必须通过。
9. `getHomePage()` 是页面**唯一**取数入口，进门先 `parse`，失败抛错不吞。

## 三、数据层链路

### P2.1 契约决策（2026-09-17）

- 根字段按 COMPONENTS 的 14 区块排序；每个区块有独立 schema / `z.infer` 类型，通用的 Action、ImageAsset、Price、Heading、FeatureItem 复用。
- 金额为 USD 整数美分，图片为本地 `/images/` 素材路径与正整数尺寸；alt 可为空以表达纯装饰。P2 mock 先保留占位素材尺寸，P5 导出真图，不能把 Figma 临时 URL 写进契约实例。
- Action 以 `kind` 区分 `anchor` / `external` / `demo`；anchor 只允许登记目标，external 只接受 HTTP(S)。2026-09-17 用户已敲定 D-02：Login、Contact、咨询等无目的地控件仅展示设计。`demo` 严格拒绝 href / target；P5 渲染原生 type="button"，保留视觉反馈，不导航、不请求、不编造表单或成功状态。真实产品锚点正常工作；不默认禁用或灰化 demo。
- SuccessStories 区分 quote / photo，OnlineCare 区分 chat / image；不能用缺失 quote / image 猜卡片形态。聊天与 Profile 是静态示意数据，不建立真实诊疗会话。
- Heading 保存有序 plain / accent 文本片段；桌面与移动确有文案差异时分别保存 paragraphs，不在数据里放 Tailwind class。语言标签的 highlighted 只表示源稿外观，不代表功能性语言选择；D-01 已敲定仅展示。
- BMI 契约保留标题、字段 / 单位 / 结果标签与范围文字，新增 `sourcePreview` 显式保留源稿零输入、Female / imperial 选中与演示分数 56；这些是稿件字符串，不是服务端计算结果。C-05 区间标签已改为 18.5–<25 / 25–<30；C-04 的计算与状态仍待 P5。
- 对象采用 strictObject 拒绝拼错字段与混合卡片形态；schema 不截断、不强转文案或金额。id 是后端稳定字符串，mock 预置，不运行时生成。

```
content/schema.ts        zod schema + z.infer 类型（契约真源）
        ↓ satisfies
content/mocks/home.ts    mock 数据
        ↓ import（默认） / fetch（NEXT_PUBLIC_API_URL 设了才走）
lib/api/home.ts          getHomePage()：唯一取数入口，进门先 HomePage.parse
        ↓
app/page.tsx             薄壳，把 HomePage 各字段分发给区块组件
app/api/home/route.ts    假后端：返回同一份 mock，形状 = HomePage
```

- `getHomePage()` 双分支（SELFCHECK.md §二 #4）：无 `NEXT_PUBLIC_API_URL` → 直接 import mock，构建期不发 HTTP；有 → ``fetch(`${url}/api/home`)`` 后 parse。
- 切真后端只改一处：`.env` 里的 `NEXT_PUBLIC_API_URL`；README「Data layer」节要写这句。

## 四、当前实现 / 已知问题

- P2 三步完成：14 区块严格契约、逐字 mock、取数入口与 Route Handler。mock 使用 `satisfies HomePage` 并通过整页 parse。
- 2026-09-17 整体 review 完成：C-02/03/05/07/08/11 的共享数据修正落地；C-06 标题与 FAQ 首答按用户要求保留，原始重复答案留在源快照和 deviations。BMI sourcePreview 与两板正文差异仍保留。D-02 由未决目标改为已决 demo 契约；P5 页面尚未组装。
- 默认分支直接 import + parse，不发首页 HTTP；设置 API base URL 后请求其 `/api/home`，校验 HTTP 状态与响应 schema，10 秒超时，失败抛出而不回退。URL 不允许凭据、query 或 fragment。Route Handler 始终返回相同本地 mock。
- `app/page.tsx` 已通过唯一入口取数并提供 main 的源文案标签；区块组装仍归 P5。图片为本地 1×1 透明 SVG，P5 换源稿导出与真实尺寸。

## 实现计划

进度：3 / 3 subtasks 完成（100%）

- [x] ST-1: `content/schema.ts` 定 `HomePage` 根类型与各区块子 schema，字段带 JSDoc；20 条契约边界测试通过（2026-09-17）
- [x] ST-2: `content/mocks/home.ts`（`satisfies HomePage`）+ vitest `HomePage.parse(homeMock)`
- [x] ST-3: `lib/api/home.ts` 双分支 + `app/api/home/route.ts`

## 测试记录

- 2026-09-17：P2.1 typecheck / lint / Vitest 通过，2 个文件共 21 条测试（20 条契约测试 + 1 条页面 smoke）。测试包含整数美分 / 非有限值 / 错拼字段、临时图片 URL / 非法尺寸、危险协议 / 假锚点、未解析 CTA 混入 href、quote/photo 与 chat/image 混形、英公制字段约束、嵌套错误路径。完整 `HomePage.parse(homeMock)` 留待 P2.2，不用边界测试代替整页 fixture 验收。

- 2026-09-17：生产构建通过；期间发现并修复 Tailwind 源扫描 BUG #14（见 TOKENS），修复后生产与 Storybook 构建均通过。未新增依赖或 HTTP 请求。

- 2026-09-17：P2/P3 合计 48 条测试通过；新增完整 mock、源文案保留、稳定 id / 本地素材、无 HTTP 默认分支、远端正常 / 失败 / 非法响应与 route 一致性测试。生产 build 的首页静态生成成功，实际 `curl http://127.0.0.1:3030/api/home` 与完整 mock 深相等。无首页取数 HTTP 不代表字体构建完全离线；next/font/google 下载风险已接受。

- 2026-09-17 review 后 49 条 Node 测试通过：demo 严格拒绝 href/target/旧 unresolved，mock 保持真实产品锚点；保留 C-06 标题、FAQ 首答、BMI 源示意，已批副本文案与独立语言 ID 通过校验。
