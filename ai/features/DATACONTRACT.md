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
- Action 以 `kind` 区分 `anchor` / `external` / `unresolved`；anchor 只允许已登记的页面目标，external 只接受 HTTP(S)。`unresolved` 仅显式保留源稿尚无目的地的 CTA，禁止在组件中变成 `href="#"` 或假成功；P5 交付前必须按候选 #12 解决，不代表已批准 disabled 方案。
- SuccessStories 区分 quote / photo，OnlineCare 区分 chat / image；不能用缺失 quote / image 猜卡片形态。聊天与 Profile 是静态示意数据，不建立真实诊疗会话。
- Heading 保存有序 plain / accent 文本片段；桌面与移动确有文案差异时分别保存 paragraphs，不在数据里放 Tailwind class。语言标签的 highlighted 只表示源稿外观，不代表功能性语言选择已批准。
- BMI 契约只存标题、字段 / 单位 / 结果标签和范围文字，不把稿件的演示分数 56 当服务端结果，也不在本步骤实现计算或修改区间文案。具体修正仍归候选 #5。
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

## 四、待实现 / 已知问题

- P2.1 已实现 `content/schema.ts`：14 个根字段、区块子 schema 与共享类型；`tests/schema.test.ts` 覆盖金额、素材路径 / 尺寸、Action、卡片和单位变体边界。
- P2.2 完整 mock 尚未实现；待确认 TODO #4 / #6 / #7 / #8 的文案修正，FAQ #13 与 CTA #12 仍须明确。图片真实素材归 P5。
- `lib/api/`、`app/api/home/` 目录已由 P0 建立，P2.3 取数函数和 route handler 尚未实现；本阶段没有声称 build 零 HTTP 分支或 curl 验收已完成。

## 实现计划

进度：1 / 3 subtasks 完成（33%）

- [x] ST-1: `content/schema.ts` 定 `HomePage` 根类型与各区块子 schema，字段带 JSDoc；20 条契约边界测试通过（2026-09-17）
- [ ] ST-2: `content/mocks/home.ts`（`satisfies HomePage`）+ vitest `HomePage.parse(homeMock)`
- [ ] ST-3: `lib/api/home.ts` 双分支 + `app/api/home/route.ts`

## 测试记录

- 2026-09-17：P2.1 typecheck / lint / Vitest 通过，2 个文件共 21 条测试（20 条契约测试 + 1 条页面 smoke）。测试包含整数美分 / 非有限值 / 错拼字段、临时图片 URL / 非法尺寸、危险协议 / 假锚点、未解析 CTA 混入 href、quote/photo 与 chat/image 混形、英公制字段约束、嵌套错误路径。完整 `HomePage.parse(homeMock)` 留待 P2.2，不用边界测试代替整页 fixture 验收。

- 2026-09-17：生产构建通过；期间发现并修复 Tailwind 源扫描 BUG #14（见 TOKENS），修复后生产与 Storybook 构建均通过。未新增依赖或 HTTP 请求。
