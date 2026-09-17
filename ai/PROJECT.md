# Apsu Home Page · PROJECT.md（雏形 v0.5）

> 本文档是新仓库 `apsu-home` 的**项目规范总纲**。它规范三件事：实现规范、commit 规范、日志规范。
> 每一条规范都能追溯到甲方 PDF《Front-end Take-Home — Apsu Home Page》的某一句要求，追溯表见 §2。
> 落点：仓库根目录 `ai/PROJECT.md`，随仓库入库（AI 过程透明本身就是加分项）。
> 语言：内部文档用中文；**进入 README、commit message、代码注释、deviation log 的一切文本用英文**，因为读者是考官。

---

## 🔴 0.0 甲方原始需求登记（严格需求，唯一真源）

| 文件 | 性质 | 用途 |
|---|---|---|
| [Front-End Take-Home Assignment.pdf](Front-End%20Take-Home%20Assignment.pdf) | 甲方英文原件，**逐字不动** | 一切验收判定以它为准 |
| [Front-End Take-Home Assignment.md](Front-End%20Take-Home%20Assignment.md) | 逐句中文译本，编号与原文一一对应 | 随时查验；与 PDF 有出入时以 PDF 为准 |

规则：

1. 本文档任何一条规范都必须能追溯到上面两份文件中的某一句（追溯表见 §2）；追溯不到的是我们的自加要求，要在 §3.3 / §11 里标明"自决"。
2. 甲方文件**只读**：不改名、不改内容、不删。需求理解有变化时改本文档，不改原件。
3. 验收前逐条对照 §4 A–E、§5、§6 打勾；考官只跑的四条命令（`npm install` · `npm run build` · `npm run dev` · `npm run storybook`）必须在干净 clone 上全绿。
4. **全程不回问甲方**（2026-09-17 用户设立）。需求、设计稿的任何歧义与缺陷都由我们自行判断、自行修正并登记，不向甲方求证；「问甲方」不作为任何待拍板项的选项。
5. **发现的缺陷先进 TODO**：开发中看出的设计缺陷、文案问题、稿件缺漏，一律先记到 [TODO.md](TODO.md)「缺陷 / 偏差候选」区，动手修时再按 §6 搬入 `docs/deviations.md` 并编 C/D 号。

## 0.1 设计稿真源（Figma）

| 项 | 值 |
|---|---|
| 工作文件 | 甲方原稿的**副本**，在我们自己的 workspace：`https://www.figma.com/design/v6NCYwJXmYtHWKT6Ck5HkD/`（原稿 `DmTQCqCODfpqMmdsZUFCnj` 只有查看权，MCP 读不了） |
| 桌面板 1440 | 节点 `2002:3098`，高 10183，9 个顶层区块 |
| 移动板 375 | 节点 `2002:3679`，高 9583，7 个顶层区块（缺 Weight Loss，见 TODO 候选） |
| 移动端 Menu 抽屉 | 节点 `2002:4211` |
| 游离移动区块组 | 节点 `2002:4113`（Weight Loss 的移动版，335 宽，画板外） |
| 结构快照 | [design_system/figma/page-0-1.xml](design_system/figma/page-0-1.xml)：整页每个节点的 ID / 名字 / 坐标 / 宽高，2026-09-17 由 MCP `get_metadata` 导出，几何尺寸以它为准，不再花配额重拉 |
| MCP 配额 | 账号是 Figma Starter，读取类调用 **20 次 / 月**；只用于变量表、整板截图与少数复合节点的 `get_design_context`，其余靠 XML + 手动 Dev Mode 抄值 |
| 接入方式 | 项目级 `.mcp.json`（HTTP，`https://mcp.figma.com/mcp`），OAuth 令牌在本机，不入库 |


---

## 0. 阅读顺序与角色

| 角色 | 开工前必读 |
|---|---|
| 人（Cheng） | 本文 §2 追溯表、§7 commit、§8 日志，其余按需 |
| Claude Code / Codex | 本文全文 + `ai/TODO.md` + `docs/deviations.md`；**开工第一动作是跑 `scripts/sync-ai-logs.sh --check`** 确认日志同步链路可用 |

---

## 1. 项目一句话与交付物

**一句话**：把 Figma 稿（桌面 1440 + 移动 375）实现为一个 Next.js 首页 + 一套 React 组件库，附 Storybook、README、完整 commit 历史与完整 AI 会话日志，提交 GitHub 仓库链接。

**交付物清单**（缺一项即不合格）：

- [ ] GitHub 公开仓库，`main` 单分支，线性历史，**未 squash**
- [ ] `npm install && npm run build` 零错误
- [ ] `npm run dev` 首页在 320–1920 任一宽度完整
- [ ] `npm run storybook` 每个有状态组件一态一 story
- [ ] `README.md` 含：目录结构解释、AI 工具使用说明（指向日志文件）、Deviation log
- [ ] `ai-logs/` 含完整、**未编辑**的会话记录
- [ ] `package-lock.json` 已提交

---

## 2. 甲方要求 → 本规范 追溯表

| PDF 条目 | 原文要点 | 落到哪条规范 |
|---|---|---|
| §1 Tech stack | Next.js App Router + React + TS strict + Tailwind；commit the lockfile | §3 技术栈锁定 |
| §1 其余自决 | tokens / 图片图标 / 状态 / 路由 / API 契约 / 数据层 | §3.3 自决项决议 |
| §2 Directory | 结构是评分项，README 解释 | §4 目录结构；§10 README 清单 |
| §3 Data | 无 API 文档，自己设计数据形状 = 未来 API 契约，提供 mock；**考官先读类型** | §5.2 数据契约规范 |
| §4A Fidelity | 375 / 1440 两块板默认态保真（在 C 类修正之后） | §5.4 响应式规范 |
| §4B Floor | 320–1920 每个宽度不横滚、导航不换行、不重叠不裁切 | §5.4 响应式规范 + `check:responsive` 门禁 |
| §4B Bonus | 板间与板外的优雅适配，defense 会问 | §5.4 流式策略，README 贴证据 |
| §4C Flaw fixes | 稿里有真错误；修并逐条记录 | §6 偏差日志规范 |
| §4D States & motion | 每个交互元素 hover/focus/pressed + 过渡；稿没画 hover，自己设计；一致与克制 > 数量；README 列出 | §5.5 交互态与动效规范；§6 偏差日志 D 类 |
| §4E Storybook | 有状态组件一态一 story，考官逐个点 | §5.6 Storybook 规范 |
| §5 README | 用了哪些 AI、写了哪些部分、指向日志；Deviation log | §10 README 清单 |
| §6 Submission | 不 squash；AI 日志完整未编辑放 `ai-logs/`；不可复现的 AI 使用不合格 | §7 commit 规范；§8 日志规范 |

---

## 3. 技术栈与版本锁定

### 3.1 固定项与版本锁定（2026-09-16 查 npm registry 的实际最新版）

| 项 | 包 | 版本 | 备注 |
|---|---|---|---|
| 运行时 | Node | **22 LTS**（本机 22.23.1） | `.nvmrc` = `22`；`engines.node = ">=20.9"`，取 Next 16 的真实下限，**不开** `engine-strict`，避免把考官挡在门外 |
| 包管理 | npm | 10.x（随 Node 22） | 提交 `package-lock.json`（lockfileVersion 3，npm 7+ 都能读）；不写 `packageManager` 字段，不锁 npm 版本，锁文件本身就是版本保证 |
| 框架 | `next` | **16.3.5** | App Router；latest 稳定线 |
| UI | `react` / `react-dom` | **19.3.0** | Next 16 peer 允许 ^19 |
| 语言 | `typescript` | **5.9.3** | `create-next-app` 写的是 `^5`，本来就装不到 7.x；我们只是把 `^5` 改成精确的 `5.9.3` |
| 类型 | `@types/react` `@types/react-dom` | 19.3.x | 跟 react 同大版本 |
| 类型 | `@types/node` | 22.x | 跟 Node 同大版本 |
| 样式 | `tailwindcss` `@tailwindcss/postcss` | **4.3.3** | v4：无 `tailwind.config.js`，token 写在 CSS `@theme` |
| 校验 | `zod` | **4.6.5** | 数据契约的运行时形态，见 §5.2 |
| 动效 | `motion` | **13.4.0** | 只用于抽屉、手风琴、轮播，见 §5.5 |
| 图标 | `lucide-react` | 1.46.0 | 品牌图标自绘 SVG |
| 变体 | `class-variance-authority` | 0.7.1 | 原语组件的 variant 映射 |
| Storybook | `storybook` `@storybook/nextjs-vite` `@storybook/addon-a11y` `storybook-addon-pseudo-states` | **10.6.0** 四包同版本 | peer 已声明支持 Next 16 |
| 单测 | `vitest` | 5.0.1 | schema 与纯函数 |
| E2E | `@playwright/test` | 1.63.0 | 响应式扫描，见 §5.4 |
| Lint | `eslint` `eslint-config-next` | **9.39.5** / 16.3.5 | `eslint-config-next` 跟 next 同版本。原定 `eslint@10.10.0`，实测 `eslint-config-next@16.3.5` 内置的 `eslint-plugin-react@7.37.5`（已是最新）peer 只到 `^9.7`，在 ESLint 10 下 `react/display-name` 规则直接抛 `getFilename is not a function`，`npm run lint` 红；改用 9.x 维护线最新版（2026-09-16 实测） |
| 格式 | `prettier` `prettier-plugin-tailwindcss` | 3.9.7 / 0.8.1 | 一次定死，全程不改 |

**初始化命令**（喂给项目 agent 的第一步；在 `~/Desktop/Files/apsu-home` 的**上一级**目录执行）：

```bash
npx create-next-app@16.3.5 apsu-home \
  --typescript --tailwind --eslint --app --src-dir=false \
  --import-alias "@/*" --use-npm --turbopack
cd apsu-home
npm i -E zod@4.6.5 motion@13.4.0 lucide-react@1.46.0 class-variance-authority@0.7.1
npm i -DE typescript@5.9.3 vitest@5.0.1 @playwright/test@1.63.0 prettier@3.9.7 prettier-plugin-tailwindcss@0.8.1
npx storybook@10.6.0 init --builder vite --no-dev
npm i -DE @storybook/addon-a11y@10.6.0 storybook-addon-pseudo-states@10.6.0
echo 22 > .nvmrc
```

`-E` = `--save-exact`，写进 `package.json` 的是 `5.9.3` 而不是 `^5.9.3`。脚手架自己写的几行（`next` `react` `react-dom` `typescript` `tailwindcss` `eslint` 等）带 `^`，初始化后**手动把 `^` 全部去掉**，让 `package.json` 与 `package-lock.json` 说的是同一句话。


**实际初始化记录（2026-09-16）**：仓库目录名是 `apsu-home-page-init`（非 `apsu-home`），且目录已有 AI 工作流文件，所以脚手架先在临时目录生成再拷入仓库；`package.json#name` 仍为 `apsu-home`。`create-next-app@16.3.5` 已无 `--turbopack` / `--src-dir=false` 参数（Turbopack 默认开启，不加 `--src-dir` 即不建 `src/`）。脚手架默认写的 `react@19.2.8`、`@types/node@^20`、`eslint@^9` 已按上表改为 `19.3.0` / `22.20.3` / `10.10.0`。`storybook init` 会额外塞入 `@chromatic-com/storybook`、`addon-vitest`、`addon-docs`、`addon-mcp`、`vitest.config.ts` 与示例 `stories/`，已全部移除，只保留上表四包 + `vite@8.3.0`（`@storybook/nextjs-vite` 的 peer）。所有依赖无 `^` / `~`。

初始化后自查：`package.json` 里所有依赖无 `^` / `~`；`next` 与 `eslint-config-next` 同版本；storybook 四包同版本；`npm run build && npm run lint && npm run build-storybook` 三绿再做第一次 commit。

### 3.2 "考官跑不起来"的隐患与对策

考官只跑四条命令：`npm install` · `npm run build` · `npm run dev` · `npm run storybook`。下面每条都是"在我们机器上绿、在考官机器上红"的已知成因：

| # | 隐患 | 对策 |
|---|---|---|
| 1 | 考官 Node 版本低于 20.9，Next 16 拒绝启动 | `.nvmrc` + `engines.node` + README 首段写明 "Node 22 LTS (tested on 22.23.1); minimum 20.9" |
| 2 | `package.json` 与 lockfile 不一致，`npm install` 静默改写 lock 装出别的版本 | 两个文件永远同一 commit 提交；每次改依赖后跑一次 `npm ci` 验证 lock 能独立复现 |
| 3 | `next/font/google` 在 build 时联网下载字体，考官完全离线则 build 失败 | **接受此风险**，仍用 `next/font/google`：一行代码、无授权与文件管理成本；考官跑 `npm install` 本来就要联网。字体名从 Figma Dev Mode 读，不猜 |
| 4 | `next build` 会在构建期预渲染 `/`，此时没有任何服务器在监听，页面若 `fetch("http://localhost:3000/api/home")` 会连接被拒，build 直接红 | `getHomePage()` 双分支：`NEXT_PUBLIC_API_URL` 为空 → 直接 `import { homeMock }` 返回，不发 HTTP；设置了 → `fetch(\`${url}/api/home\`)` 并 zod 校验。默认构建走前者，永不依赖运行中的服务 |
| 5 | Playwright 装完不自带浏览器，`check:responsive` 需要 `npx playwright install` | 这条命令**不进**四条考官命令的依赖链；它是我们自己的门禁，README 里单独说明怎么跑 |
| 6 | macOS 文件系统不分大小写，`import "./button"` 引 `Button.tsx` 本机能过、Linux 上 build 红 | 仓库加 GitHub Actions，在 `ubuntu-latest` 上跑 `npm ci && npm run build && npm run lint && npm run build-storybook`；绿徽章贴 README，同时是"考官环境能跑"的证明 |
| 7 | 考官用 Windows，`package.json#scripts` 里的 `rm -rf` / `&&` 链 / bash 语法跑不了 | 四条考官命令只调 `next` / `storybook` 自带 CLI；自研脚本用 Node 写，不用 bash；`sync-ai-logs.sh` 例外，因为它只在我们机器上跑 |
| 8 | build 依赖某个 env 变量而 `.env` 没提交 | 构建零必填 env；`NEXT_PUBLIC_API_URL` 可空；提交 `.env.example` 说明可选项 |
| 9 | `ai-logs/` 里单个 jsonl 超过 GitHub 100MB 硬限 | 每次同步脚本打印文件大小；单 session 逼近 50MB 就结束它开新 session |
| 10 | `postinstall` 钩子在考官网络下失败 | 本项目不添加任何 `postinstall`；依赖里 `sharp` / `lightningcss` 的平台二进制由 lockfile 记录全部平台变体，`npm install` 自动挑 |


### 3.3 "由你决定"项的决议（写进 README 的 Design decisions 节）

| 自决项 | 决议 | 一句话理由 |
|---|---|---|
| Design tokens | Tailwind v4 `@theme` CSS 变量，**语义命名**（`--color-brand`、`--color-surface-mint`），禁止按色值命名 | 换肤与后端主题接入不用改组件 |
| 图片 | `next/image` 静态导入；每张图是 `{ src, alt, width, height }` 数据 | alt 是内容不是代码；宽高防 CLS |
| 状态管理 | 无全局 store；`useState` / `useReducer`；BMI 计算抽纯函数 | 首页只有局部状态，引 store 是过度设计 |
| 路由 | 单路由 `/`；导航项锚点滚动到区块 | 产品页不在范围内（**待拍板**：锚点 vs `/coming-soon` 占位页） |
| API 契约 | zod schema 即契约；`HomePage` 为根类型 | 考官先读类型 |
| 数据层 | Route Handler `app/api/home` 当假后端；`lib/api/home.ts` 唯一取数入口；`NEXT_PUBLIC_API_URL` 切真后端 | 有 HTTP 边界又不多起进程 |

---

## 4. 目录结构（评分项，README 里必须解释）

```
apsu-home/
├── app/                        路由层：只放 layout / page / route handler，页面是薄壳
│   ├── layout.tsx
│   ├── page.tsx                const data = await getHomePage(); 分发给 14 个区块
│   └── api/home/route.ts       假后端：返回 mock，形状 = HomePage schema
├── components/
│   ├── ui/                     无业务原语：Button Chip Card Accordion Carousel Marquee
│   │                           NumberField RadioGroup SegmentedControl Rating IconButton
│   └── sections/               14 个首页区块，只吃 props，不 import mock
├── content/
│   ├── schema.ts               zod schema + z.infer 类型，就是"API 契约"
│   └── mocks/home.ts           mock 数据，satisfies HomePage
├── lib/
│   ├── api/home.ts             getHomePage()：fetch + zod parse
│   ├── motion.ts               动效 token：时长 / easing / reduced-motion
│   └── bmi.ts                  纯函数：换算与分类
├── styles/
│   └── tokens.css              @theme：颜色 字体 字号阶梯 圆角 阴影 容器宽
├── public/images/              Figma 导出 1x/2x
├── scripts/
│   ├── sync-ai-logs.sh         §8：拷会话日志进 ai-logs/
│   └── check-responsive.ts     §5.4：Playwright 11 宽度扫描
├── docs/
│   ├── deviations.md           §6：偏差日志（C 类 + D 类）
│   └── responsive-report.md    check:responsive 的输出表
├── ai/
│   ├── PROJECT.md              本文
│   └── TODO.md                 任务唯一来源
├── ai-logs/                    §8：原始会话记录，未编辑
├── .storybook/
├── README.md
└── package-lock.json
```

命名：目录 kebab-case；组件文件 PascalCase（`Button.tsx` + `Button.stories.tsx` 同目录）；其余 camelCase；文档全小写 kebab-case，`README.md` / `PROJECT.md` / `TODO.md` 例外。

---

## 5. 实现规范

### 5.0 语言与注释规范（全局铁律）

**语言分界**：

| 英文（读者是考官） | 中文（读者只有 Cheng） |
|---|---|
| 代码、标识符、字符串常量 | `ai/PROJECT.md` |
| 代码注释 | `ai/TODO.md` |
| commit 标题与 description | `ai/` 下其他内部文档 |
| `README.md`、`docs/deviations.md`、`docs/responsive-report.md`、`ai-logs/README.md` | |
| Storybook story 名与说明 | |

判据：**会进 GitHub 被考官打开的东西一律英文；只有 `ai/` 目录下的规划文档是中文。**

目录级规则，不留例外：

| 目录 | 读者 | 语言 |
|---|---|---|
| `docs/` | 甲方 / 考官 | 英文 |
| `README.md`、`ai-logs/README.md` | 甲方 / 考官 | 英文 |
| `ai/` | Cheng | 中文 |

**注释规范**：

1. 普通函数、hook、组件：**一句话**说明作用，写在声明上方，用 `/** */` 让编辑器能悬浮显示。
   ```ts
   /** Converts feet + inches to centimeters, rounding to one decimal. */
   export function toCentimeters(feet: number, inches: number): number
   ```
2. 复杂实现（算法、状态机、有非显然取舍）与大型组件模块（区块级、交互岛）：**3–4 句话**，按"做什么 → 为什么这样做 → 注意什么"的顺序。
   ```ts
   /**
    * Infinite marquee built from two copies of the same track.
    * The second copy starts exactly where the first ends so the loop has no seam.
    * Animation runs in CSS to stay off the main thread; hover pauses via `animation-play-state`.
    * Respects `prefers-reduced-motion` by rendering a static, wrapped list instead.
    */
   ```
3. **不写**：复述代码的注释（`// increment i`）、注释掉的代码、`TODO` 不带 `ai/TODO.md` 条目引用。
4. JSDoc 里的 schema 字段说明（§5.2）视为注释，同样英文、一句话。

### 5.1 组件规范

1. **区块组件默认是 Server Component**。只有 6 个交互岛加 `"use client"`：Header（含移动端抽屉）、LanguageMarquee、TrustMarquee、BmiCalculator、Carousel、Faq。新增 client 组件要在 PR/commit 说明里给理由。
2. **组件里不许出现文案与图片路径的硬编码**。所有文字、链接、图片从 props 进来，props 的类型来自 `content/schema.ts`。
3. 原语组件 (`ui/`) 不知道业务：`Button` 不知道自己是 "See plans"。
4. 每个原语导出一个 `variant` / `size` 的有限集合，用 `cva` 或对象映射，不在调用处拼 class 串。
5. 所有可交互元素必须是原生可聚焦元素（`button` / `a` / `input`），禁止 `div onClick`。
6. 图标一律 `aria-hidden`，含义由旁边文本或 `aria-label` 承担。

### 5.2 数据契约规范（考官先读的那份）

1. `content/schema.ts` 是**唯一**的数据形状真源；TS 类型只允许 `z.infer` 得到，禁止手写重复 interface。
2. 每个 schema 与字段带 JSDoc，说明业务含义与来源，写给后端看。
3. 金额是结构不是字符串：`{ amount: 2000, currency: "USD", interval: "month", prefix: "From" }`。
4. 图片是结构：`{ src, alt, width, height }`。
5. 同类不同形态用 `z.discriminatedUnion("kind", ...)`，禁止用可选字段堆出"可能有图可能没图"。
6. id 一律 `z.string()` 并在 JSDoc 注明"后端稳定 id"，前端不生成。
7. `HomePage` 是根类型，字段顺序 = 页面区块顺序。
8. mock 用 `satisfies HomePage` 约束；另有 vitest 用例 `HomePage.parse(homeMock)` 必须通过。
9. `getHomePage()` 是页面**唯一**取数入口，进门先 `parse`，失败抛错不吞。

### 5.3 样式规范

1. 颜色、字号、间距、圆角、阴影只能引用 `@theme` token；出现魔法值（`#1f3a2a`、`text-[17px]`）视为缺陷。
2. 断点只允许三个语义名（见 §5.4），禁止散落的任意 `min-[900px]`。
3. `min-w-0` 是泄压阀不是默认值：只在被压穿的 flex 子项上加，并注释为什么。
4. 不引 UI 组件库（shadcn/Radix 亦不引）——原语是评分对象，要自己写；手风琴用原生 `<details>`。

### 5.4 响应式规范

**两条线分开达标**：

- **保真线**：375 与 1440 两块板逐区块对照 Figma，默认态。
- **完整性线**：320–1920 任意宽度：`scrollWidth <= innerWidth`、导航项同一行、无重叠无裁切。

**策略：流式为主，形态断点为辅**

1. 字号与大间距用 `clamp()`，两端锚点 = 375 稿值与 1440 稿值，中间自动插值。
2. 只在布局**换形态**处设断点，命名固定为：`sm`（≥640，卡片 1→2 列）、`lg`（≥1024，导航展开 / 特写左右排）、`xl`（≥1280，内容容器到满宽）。具体阈值以 Header 不换行的实测为准，可调但要写进 deviations。
3. 容器 `max-width: 1440px` 居中，背景铺满；>1440 不放大内容。
4. 320–375 区间靠自动换行与 `min-w-0` 保底，不另做设计。
5. **门禁**：`npm run check:responsive` 在 320 / 360 / 375 / 414 / 640 / 768 / 1024 / 1280 / 1440 / 1600 / 1920 截图并断言以上三条；结果表写入 `docs/responsive-report.md`，README 引用。

### 5.5 交互态与动效规范（一致与克制 > 数量）

**token（`lib/motion.ts` + `tokens.css`）**

| token | 值 | 用途 |
|---|---|---|
| `--dur-fast` | 150ms | 颜色、透明度、小位移 |
| `--dur-base` | 200ms | 抬起、缩放、箭头位移 |
| `--dur-slow` | 300ms | 高度展开、抽屉、轮播 |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | 所有进场与状态切换 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 离场，且离场时长取进场的 0.75 |

**状态规则（每条都要在 deviations D 类里登记）**

1. hover：按钮背景加深/提亮一级，右箭头 `translateX(2px)`；卡片 `translateY(-2px)` + 阴影升一级；chip 底色切薄荷。
2. focus-visible：全站统一 2px 强调色外环 + 2px offset，禁止 `outline: none` 不配替代。
3. active/pressed：`scale(0.98)`，`--dur-fast`。
4. disabled：`opacity .5` + `cursor-not-allowed`，且保留在 tab 序列外。
5. 首/末位轮播箭头 disabled；跑马灯 hover 暂停。
6. `prefers-reduced-motion: reduce` 时所有 transition/animation 归零，`motion` 组件走 `useReducedMotion`。
7. **禁止**：弹跳、overshoot、超过 300ms 的过渡、进场 scale 起点小于 0.96、视差。

### 5.6 Storybook 规范

1. 每个 `ui/` 原语与每个 client 区块必有 `*.stories.tsx`，与组件同目录。
2. **一态一 story，story 名 = 状态名**：`Default` / `Hover` / `Focus` / `Pressed` / `Disabled` / `Loading`…；hover/focus/active 用 `pseudo-states` 固化，不靠鼠标。
3. 数据从 `content/mocks` 取，不在 story 里再造一份文案。
4. 全局 viewport 预设两块板：`mobile-375`、`desktop-1440`。
5. `a11y` addon 违规 = 阻塞，不允许 disable 规则。

### 5.7 无障碍与语义

- 一页一个 `h1`，区块用 `section` + `aria-labelledby`。
- 颜色对比 AA；图片 alt 来自数据。
- 键盘走通全页：导航、抽屉、手风琴、轮播、BMI 表单。

### 5.8 代码内 log 规范

- 提交代码中禁止 `console.log`；仅允许 `console.error` 出现在 `getHomePage()` 的 parse 失败分支与 error boundary。
- ESLint `no-console: ["error", { allow: ["error"] }]` 强制。
- 调试用 log 在 commit 前必须清干净（这是 §7 的提交前自查项之一）。

---

## 6. 偏差日志规范（`docs/deviations.md`）

两类，同一张表，`type` 列区分：

| id | type | location | figma says | we ship | why |
|---|---|---|---|---|---|
| C-01 | C 设计缺陷 | Footer column title | "Comapny" | "Company" | typo |
| D-01 | D 自设计状态 | All buttons · hover | (not specified) | bg one step darker, arrow +2px | consistent, low-amplitude affordance |

规则：

1. **先登记再改**：发现缺陷先写一行，再动代码；commit message 引用 id（`fix(copy): correct footer column title (C-01)`）。
2. 每条一个理由，一句话，英文。
3. 已知候选清单（方案阶段盘出的 19 条）在 `ai/TODO.md` 里，开工第一天逐条确认后搬入本表。
4. README 的 Deviation log 节直接链接本文件，不复制。

---

## 7. Commit 与分支规范

### 7.1 分支模型

- **单分支 `main`，线性历史。** PDF 只要求"保留完整历史、不 squash"，没有分支数量要求；多分支只增加操作风险，不加分。
- 如需短命分支（例如试一个方案），合回时用 `git merge --no-ff`，保留 merge commit，**永不 squash、永不 rebase 已推送的提交**。
- 每次工作结束 push；push 过的 commit 不 `--amend`、不 `reset`、不 `force-push`。

### 7.2 Conventional Commits

```
<type>(<scope>): <subject>          ← 英文，祈使句，小写开头，≤ 72 字符，不加句号
                                       一眼看出改了什么，不看 body 也能懂

<description>                       ← 3–4 句话，英文：改了什么 · 为什么 · 影响面 / 取舍 · 引用 deviation id
                                       只有"不贴代码说不清"时才附一小段代码或 diff 片段
                                       ai-logs 的 logs 类 commit 例外，见 §8

Co-Authored-By: ...                 ← AI 生成的提交保留此行
```

**description 示例**（一条合格的）：

```
fix(copy): correct footer column title (C-01)

The Figma footer labels the second column "Comapny", which is a typo.
Renamed it to "Company" in the footer mock so the fix lives in data, not markup.
Logged as C-01 in docs/deviations.md.
```

**description 反例**：只写 "fix typo"（说不清为什么与影响面）；或贴整个组件的代码（代码在 diff 里，description 讲的是 diff 讲不了的东西）。

**type**（只允许这些）：

| type | 用途 |
|---|---|
| `feat` | 新组件 / 新区块 / 新能力 |
| `fix` | 修 bug、修设计缺陷（必须引用 C-xx） |
| `style` | 只改 token / 视觉，不改行为 |
| `refactor` | 不改行为的结构调整 |
| `test` | vitest / Playwright / story |
| `docs` | README / deviations / ai 文档 |
| `chore` | 依赖、脚手架、配置 |
| `logs` | **仅**同步 `ai-logs/`（见 §8） |

**scope**（固定词表，新增要先加进这里）：
`app` `ui` `sections` `schema` `mocks` `api` `tokens` `motion` `responsive` `storybook` `a11y` `copy` `deps` `ci` `readme` `ai-logs` `ai`

`ai` = `ai/` 下的规划文档与项目级 agent 配置（PROJECT / TODO / design_system / `.mcp.json`），2026-09-17 加。

**示例**：

```
chore(deps): scaffold next app with strict ts, tailwind v4 and storybook
feat(schema): define HomePage API contract with zod
feat(ui): add Button with primary/secondary/outline variants and stories
feat(sections): build Hero with language marquee
fix(copy): correct footer column title (C-01)
style(motion): add hover/focus/pressed tokens and apply to Button (D-01, D-02)
test(responsive): add 11-width overflow scan
docs(readme): explain directory structure and data layer
logs(ai-logs): sync claude code sessions through 2026-09-18
```

### 7.3 粒度与自查

1. **一个 commit 一件事**：一个组件、一个区块、一条缺陷修复、一份文档。能拆就拆，历史是评分项。
2. 每个 commit 必须能 `tsc --noEmit` 与 `eslint` 通过；`build` 允许在中间 commit 短暂红，但同一工作日内必须回绿。
3. 提交前自查（AI 执行时逐条报告）：
   - [ ] 只 `git add` 本次改动相关文件，禁止 `git add -A`
   - [ ] 无 `console.log`、无注释掉的代码、无 TODO 不带 issue 引用
   - [ ] 涉及设计偏差的，`docs/deviations.md` 已先登记且 message 引用 id
   - [ ] `scripts/sync-ai-logs.sh` 已跑，日志变更**随本 commit 一起进**，或紧接一条 `logs(ai-logs)` commit
4. AI 生成的 commit 末尾加 `Co-Authored-By` 行（Claude Code 默认带），不删。这与 README 的 AI 披露互为证据。

---

## 8. AI 会话日志规范（`ai-logs/`）

### 8.1 原则

1. **完整、未编辑、可复现**：原始文件逐字节拷贝，不删行、不脱敏、不改名内容。
2. 因此**敏感信息不能进会话**：不要在对话里粘贴 token、密码、公司内部路径或文档。开工前设好 `.env` 并加入 `.gitignore`，让 AI 读 `.env.example` 而不是 `.env`。
3. 所有会话在**新仓库目录**里开，保证日志落在该项目自己的 slug 下（方案讨论用的旧 session 不交，因为它混有无关项目内容且不可编辑）。

### 8.2 原始日志在哪

| 工具 | 落点 | 说明 |
|---|---|---|
| Claude Code（CLI 与 Desktop 同源） | `~/.claude/projects/<slug>/<session-id>.jsonl` | `<slug>` = 项目绝对路径把 `/` 换成 `-`；例：`-Users-chengzheng-Desktop-Files-apsu-home` |
| Claude Code 子代理 | `~/.claude/projects/<slug>/<session-id>/` 目录 | 与主日志同名目录，一起拷 |
| Codex CLI | `~/.codex/sessions/YYYY/MM/DD/rollout-<时间>-<id>.jsonl` | 按日期分目录；需按 cwd 字段过滤出本项目的 |
| Claude Desktop 导出 zip | `~/Downloads/` | Session 菜单 Export，或 AI 调 `export_transcript` 工具；内容与 jsonl 同源，属"可读副本" |

### 8.3 目录结构

```
ai-logs/
├── README.md                      索引：session id · 日期 · 工具 · 这段做了什么 · 对应 commit 范围
├── claude-code/
│   ├── <session-id>.jsonl         原始，未编辑
│   └── <session-id>/              子代理日志（若有）
├── codex/
│   └── rollout-<...>.jsonl        原始，未编辑
└── readable/
    └── <session-id>.md            由原始导出的可读版，文件头注明"derived; raw file is authoritative"
```

### 8.4 同步脚本 `scripts/sync-ai-logs.sh`

```bash
#!/usr/bin/env bash
# Copy raw AI session logs for THIS project into ai-logs/ byte-for-byte.
# Usage: scripts/sync-ai-logs.sh [--check]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="$(echo "$ROOT" | sed 's#/#-#g')"
CLAUDE_SRC="$HOME/.claude/projects/$SLUG"
CODEX_SRC="$HOME/.codex/sessions"
DST="$ROOT/ai-logs"

if [[ "${1:-}" == "--check" ]]; then
  [[ -d "$CLAUDE_SRC" ]] && echo "claude: $CLAUDE_SRC ($(ls "$CLAUDE_SRC"/*.jsonl 2>/dev/null | wc -l | tr -d ' ') sessions)" || echo "claude: no logs yet for $SLUG"
  exit 0
fi

mkdir -p "$DST/claude-code" "$DST/codex"
# Claude Code: main transcripts + subagent dirs
if [[ -d "$CLAUDE_SRC" ]]; then
  rsync -a --include='*.jsonl' --include='*/' --exclude='*' "$CLAUDE_SRC/" "$DST/claude-code/"
fi
# Codex: only rollouts whose cwd is this repo
if [[ -d "$CODEX_SRC" ]]; then
  grep -rl --include='*.jsonl' "\"cwd\":\"$ROOT\"" "$CODEX_SRC" 2>/dev/null | while read -r f; do
    cp -p "$f" "$DST/codex/"
  done
fi
# Integrity manifest: sha256 of every raw log as copied. Regenerated each run.
( cd "$DST" && find claude-code codex -type f -name '*.jsonl' -print0 | sort -z | xargs -0 shasum -a 256 ) > "$DST/MANIFEST.sha256"
echo "synced -> $DST"
git -C "$ROOT" status --short ai-logs | head
```


### 8.5 执行纪律

1. **每次 commit 前跑一次**，日志随代码同 commit；AI 执行提交时必须在报告里写"ai-logs 已同步：N 个文件"。
2. **每个 session 结束后再跑一次**并单独提交 `logs(ai-logs): ...`，因为 session 最后几轮的内容在上一次 commit 之后才落盘。
3. **提交前最后一步**：最终 session 结束 → 跑脚本 → `logs(ai-logs): final sync` → push。这条 commit 之后不再有任何对话式改动。
4. `ai-logs/README.md` 索引表在每次 `logs` commit 时更新一行。
5. 可读副本 (`readable/`) 每个 session 至少导出一次，方便考官抽样；缺了不算违规，原始文件才是硬要求。

### 8.6 Claude Desktop / Codex 能不能"自己导出"

能，且不需要任何"导出"动作：两者都是**边聊边把原始记录写到磁盘**，上表的路径就是原文件。所谓导出只是拷贝。Claude Desktop 另有 Export 菜单与 `export_transcript` 工具，产物是 zip 放到 `~/Downloads/`，那是可读副本的来源，不替代 jsonl。

---

## 9. 门禁（Definition of Done）

| 层级 | 必须通过 |
|---|---|
| 每个 commit | `tsc --noEmit` · `eslint` · 无 console.log · deviations 已登记 · ai-logs 已同步 |
| 每个区块完成 | 375 / 1440 与 Figma 逐项对照 · 对应 story 存在 · 键盘可走通 |
| 每日收工 | `npm run build` 绿 · `npm run check:responsive` 绿 · push |
| 最终提交 | 上述全部 + `npm run storybook` 全绿 · a11y 零违规 · README 清单 §10 全勾 · `logs(ai-logs): final sync` 为最后一条 commit |

`package.json#scripts` 至少含：`dev` `build` `start` `lint` `typecheck` `test` `storybook` `build-storybook` `check:responsive` `sync:ai-logs`。

`typecheck` = `next typegen && tsc --noEmit`：Next 16 的 `LayoutProps` / `PageProps` 等全局类型由 `next typegen` 生成到 `.next/types/`，干净 clone 上不先 typegen 直接 `tsc` 会报 `Cannot find name 'LayoutProps'`。

---

## 10. README 必答清单（英文）

- [ ] 一段话：这是什么、怎么跑（四条命令）
- [ ] Directory structure：树 + 每层职责（§4）
- [ ] Data layer & API contract：schema 在哪、mock 怎么校验、切真后端只改哪一行
- [ ] Design decisions：§3.3 那张表的英文版
- [ ] Responsive strategy：流式 + 三断点 + `responsive-report.md` 结果表
- [ ] Interaction states & motion：token 表 + D 类清单链接
- [ ] Deviation log：链接 `docs/deviations.md`
- [ ] Storybook：怎么跑、组件与状态一览
- [ ] **AI usage**：用了哪些工具（Claude Code / Codex）、各写了哪些部分、每部分对应 `ai-logs/` 里的哪个 session id
- [ ] Known limitations

---

## 11. 待拍板（方案阶段遗留）

| # | 问题 | 选项 | 倾向 |
|---|---|---|---|
| 1 | 证言卡上的 X / Instagram / LinkedIn 图标 | a. 删除并记 C 类 · b. 保留为不可点击装饰 | a |
| 2 | 导航三个产品项的目标 | a. 锚点到对应区块 · b. `/coming-soon` 占位页 | a |
| 3 | 本文档语言 | a. 中文入库 · b. 入库前译英 | a，README 已是英文，内部文档中文不减分 |
| 4 | 是否把方案讨论 session 的可读摘要放进 `docs/plan.md` | 由新 session 重述生成 | 是 |

