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

- `content/` `lib/api/` `app/api/home/` 均未创建
- `HomePage` 根类型的字段顺序 = 页面区块顺序，需等区块拆分（COMPONENTS.md §四）定稿后定
- 金额、图片、discriminatedUnion 的具体 schema 形状待读稿后设计

## 实现计划

进度：0 / 3 subtasks 完成（0%）

- [ ] ST-1: `content/schema.ts` 定 `HomePage` 根类型与各区块子 schema，字段带 JSDoc
- [ ] ST-2: `content/mocks/home.ts`（`satisfies HomePage`）+ vitest `HomePage.parse(homeMock)`
- [ ] ST-3: `lib/api/home.ts` 双分支 + `app/api/home/route.ts`

## 测试记录

（空）
