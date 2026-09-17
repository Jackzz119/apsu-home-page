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

1. 本文档任何一条规范都必须能追溯到上面两份文件中的某一句（追溯表见 §2）；追溯不到的是我们的自加要求，要在 §3.1 口供 / §11 决策记录里标明"自决"。
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
| 接入方式 | Claude Code 用项目级 `.mcp.json`，Codex 用 `.codex/config.toml`；均连接 `https://mcp.figma.com/mcp`。各客户端 OAuth 凭据在本机，不入库。2026-09-17 Codex OAuth 成功，重启后 `whoami` 与桌面根节点 `get_variable_defs` 均通过 |
| 变量快照与本轮用量 | [design_system/figma/variables.json](design_system/figma/variables.json)：桌面 `2002:3098` 的 75 项变量与样式定义，2026-09-17 保存。本轮计入读取配额的调用 1 次（`get_variable_defs`），`whoami` 不计入；账号当月剩余额度未返回，不能用本轮次数推断 |


---

## 0. 阅读顺序与角色

| 角色 | 开工前必读 |
|---|---|
| 人（Cheng） | 本文 §2 追溯表、§7 commit、§8 日志，其余按需 |
| Claude Code / Codex | 本文全文 + `ai/TODO.md` + `docs/deviations.md`；**开工第一动作是跑 `scripts/sync-ai-logs.sh --check`** 确认日志同步链路可用 |

---

## 1. 项目一句话与交付物

**当前实现（2026-09-17）**：P0.1 目录骨架与首页空壳完成，脚手架 SVG 已移除，改动文件格式检查与 typecheck / lint / build 通过；细节见 [STRUCTURE.md](features/STRUCTURE.md) ST-1 与测试记录。下一步 P0.2。

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
| 开头 "component library + page" | 交付的是 React 组件库 + 页面 | §3.1 口供「组件库形态」；[COMPONENTS.md](features/COMPONENTS.md) |
| §1 Tech stack | Next.js App Router + React + TS strict + Tailwind；commit the lockfile | [STRUCTURE.md](features/STRUCTURE.md) §二 技术栈锁定 |
| §1 其余自决 | tokens / 图片图标 / 状态 / 路由 / API 契约 / 数据层 | §3.1 项目决策口供 |
| §2 Directory | 结构是评分项，README 解释 | [STRUCTURE.md](features/STRUCTURE.md) §三 目录结构；§10 README 清单 |
| §3 Data | 无 API 文档，自己设计数据形状 = 未来 API 契约，提供 mock；**考官先读类型** | [DATACONTRACT.md](features/DATACONTRACT.md) 数据契约 |
| §4A Fidelity | 375 / 1440 两块板默认态保真（在 C 类修正之后） | [RESPONSIVE.md](features/RESPONSIVE.md) 保真线 |
| §4B Floor | 320–1920 每个宽度不横滚、导航不换行、不重叠不裁切 | [RESPONSIVE.md](features/RESPONSIVE.md) 完整性线 + [SELFCHECK.md](features/SELFCHECK.md) §三 扫描 |
| §4B Bonus | 板间与板外的优雅适配，defense 会问 | [RESPONSIVE.md](features/RESPONSIVE.md) 流式策略，README 贴证据 |
| §4C Flaw fixes | 稿里有真错误；修并逐条记录 | §6 偏差日志规范 |
| §4D States & motion | 每个交互元素 hover/focus/pressed + 过渡；稿没画 hover，自己设计；一致与克制 > 数量；README 列出 | [MOTION.md](features/MOTION.md)；§6 偏差日志 D 类 |
| §4E Storybook | 有状态组件一态一 story，考官逐个点 | [STORYBOOK.md](features/STORYBOOK.md) |
| §5 README | 用了哪些 AI、写了哪些部分、指向日志；Deviation log | §10 README 清单 |
| §6 Submission | 不 squash；AI 日志完整未编辑放 `ai-logs/`；不可复现的 AI 使用不合格 | §7 commit 规范；§8 日志规范 |

---

## 3. 项目决策口供与规范文档索引

### 3.1 项目决策口供（2026-09-17 由「由你决定项的决议」升级；写进 README 的 Design decisions 节）

> **口供** = 项目对所有「甲方说由你决定」问题的唯一统一说法。代码、README、Storybook 说明、deviations、答辩回答都必须与这张表一致；要改说法先改这里，再改别处。每条一句话理由，考官问「为什么」就答这句。

| 自决项 | 决议 | 一句话理由 |
|---|---|---|
| Design tokens | Tailwind v4 `@theme` CSS 变量，**语义命名**（`--color-brand`、`--color-surface-mint`），禁止按色值命名 | 换肤与后端主题接入不用改组件 |
| 图片 | `next/image` 静态导入；每张图是 `{ src, alt, width, height }` 数据 | alt 是内容不是代码；宽高防 CLS |
| 状态管理 | 无全局 store；`useState` / `useReducer`；BMI 计算抽纯函数 | 首页只有局部状态，引 store 是过度设计 |
| 路由 | 单路由 `/`；导航三个产品项（Weight Loss / Birth Control / Sleep）锚点滚动到对应区块，不做 `/coming-soon` 占位页 | 产品页不在范围内；占位页是多余的空壳（2026-09-17 拍板，见 §11） |
| API 契约 | zod schema 即契约；`HomePage` 为根类型 | 考官先读类型 |
| 数据层 | Route Handler `app/api/home` 当假后端；`lib/api/home.ts` 唯一取数入口；`NEXT_PUBLIC_API_URL` 切真后端 | 有 HTTP 边界又不多起进程 |
| 响应式策略与证据 | 策略：`clamp()` 流式 + 三个形态断点（`sm` / `lg` / `xl`）+ 容器 1440 封顶。证据：`check:responsive` 每次运行重生成并提交的 `docs/responsive-report.md`（11 宽度 × 3 断言结果表）；画面：最终提交前拍一次的 11 宽度横向拼图 `docs/responsive-report.png`，README 引用。原始整页截图目录 gitignored | 表可复现、图直观、历史里不堆几十兆截图（2026-09-17 拍板，§11 #5） |
| **组件库形态**（甲方原文 "React component library + page"） | 组件实现成**组件库**：`components/index.ts` 统一导出，消费者只 `import { X } from "@/components"`；组件通用、只吃 props、不依赖页面上下文，别人 import 就能用；页面本身也只是这个库的一个消费者。细则见 [COMPONENTS.md](features/COMPONENTS.md) §二 | 交付物是「组件库 + 页面」，页面私有组件不算库 |

---

### 3.2 规范文档索引（feature 文档，各管一个 scope）

> 2026-09-17 用户设立：PROJECT.md 的职责是**实时上下文与每一 turn 的追溯**，不装规范细节。规范类内容按 scope 拆到 `ai/features/` 下，本表是唯一入口；加新规范文档必须在此登记一行并写明 scope。

| 文档 | 管理 scope | 迁出自 |
|---|---|---|
| [STRUCTURE.md](features/STRUCTURE.md) | 技术栈与精确版本、升降版决定、脚手架实录、目录结构与命名、`scripts` 清单 | 原 §3.1、§4 |
| [SELFCHECK.md](features/SELFCHECK.md) | 考官环境可复现性隐患与对策、响应式 11 宽度扫描、按 Assignment 推导的验收测试（M5）、CI 决定 | 原 §3.2 |
| [COMPONENTS.md](features/COMPONENTS.md) | 组件库形态与统一导出、ui/ 与 sections/ 组件规范、client 白名单、组件清单登记 | 原 §5.1 |
| [DATACONTRACT.md](features/DATACONTRACT.md) | zod 契约与类型推导、mock 约束、`getHomePage()` 取数链路、真后端切换 | 原 §5.2 |
| [MOTION.md](features/MOTION.md) | 交互态规则（hover / focus / pressed / disabled）、动效 token、reduced-motion、D 类状态来源；开发时拉入 `emil-design-eng` 技能 | 原 §5.5 |
| [STORYBOOK.md](features/STORYBOOK.md) | `.storybook/` 配置、一态一 story 规则、viewport 预设、pseudo-states 与 a11y 策略 | 原 §5.6 |
| [TOKENS.md](features/TOKENS.md) | `@theme` token 文件与语义命名、魔法值禁令、字体接入、不引 UI 库 | 原 §5.3 |
| [RESPONSIVE.md](features/RESPONSIVE.md) | 保真线 / 完整性线定义、流式 + 三断点策略、容器规则、320–375 保底 | 原 §5.4 |
| [A11Y.md](features/A11Y.md) | 语义结构、对比度、alt、键盘路径、图标 aria 约定、a11y addon 零违规 | 原 §5.7 |

规则：细节只在 feature 文档写一份；本文只登记入口、scope 与 §3.1 口供。feature 文档之间有交叉时（如 SELFCHECK 引用 STRUCTURE 的目录），引用不复制。

## 5. 全局铁律（留在本文的实现规范）

> 只有跨所有 feature 的全局规则留在这里；分领域的规范在 §3.2 索引的 feature 文档里。

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
4. JSDoc 里的 schema 字段说明（[DATACONTRACT.md](features/DATACONTRACT.md)）视为注释，同样英文、一句话。

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

### 7.0 谁决定 commit（2026-09-17 用户设立）

**commit 的时机、次数与切分由用户决定，AI 不自主提交。**

- AI 做完一段工作后只报告「哪些文件动了、建议怎么切成几条 commit、每条的 message 草稿」，然后**停下等指令**。
- 用户说了「commit」「提交」「按你建议的切」之类的话才动手；说了几条就几条，不合并、不多拆。
- 用户没说 push 就不 push；push 授权只在当轮有效（同 CLAUDE.md「Auto 模式报告规范」第 6 条）。
- 例外：无。包括 `logs(ai-logs)` 同步提交，也等用户开口。

> 为什么：commit 历史是评分项（PDF §6），每条的粒度和叙事要由人把关；AI 顺手提交会把中间状态、搭车改动和未定稿文档混进历史，事后按 §7.1 又不能改。

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

### 7.3 每次 commit 必做清单（2026-09-17 由「粒度与自查」升级）

**粒度**：一个 commit 一件事——一个组件、一个区块、一条缺陷修复、一份文档。能拆就拆，历史是评分项（PDF §6）。

**清单**：用户说「commit」之后、`git commit` 之前，AI 逐条执行并在报告里逐条打勾；任何一条不过就停下报告，不提交。

| # | 必做 | 依据 |
|---|---|---|
| 1 | `npm run format`（全局 prettier `--write`），改动的文件重新 `git add` | 用户 2026-09-17 口头设立；`.prettierrc` 是标准，`.prettierignore` 已排除协议、`ai/`、`ai-logs/`、锁文件 |
| 2 | `npm run typecheck` 与 `npm run lint` 绿 | §9 每 commit 门禁 |
| 3 | 只 `git add` 本次改动相关文件，禁止 `git add -A`；别的 session / 用户改的文件不带 | CLAUDE.md Auto 模式第 6 条 |
| 4 | 无 `console.log`、无注释掉的代码、无不带 TODO.md 条目引用的 `TODO` | §5.8、§5.0 |
| 5 | 动了依赖：`package.json` 与 `package-lock.json` 同一 commit，且 `npm ci` 能独立复现 | PDF §1 "commit the lockfile"；SELFCHECK §二 #2 |
| 6 | 新增或改动有状态组件：同目录 `*.stories.tsx` 同 commit，一态一 story | PDF §4E；STORYBOOK.md |
| 7 | 涉及设计修正（C）或自设计交互态（D）：`docs/deviations.md` **先**登记，message 引用 id | PDF §4C / §4D；§6 |
| 8 | 改了目录结构、数据层、AI 使用范围：README 对应节同 commit 更新 | PDF §2 / §5；§10 |
| 9 | 区块级 commit：`npm run check:responsive` 绿（脚本就位后） | PDF §4B；§9 每区块门禁 |
| 10 | `npm run sync:ai-logs`，日志随本 commit 进，或紧接一条 `logs(ai-logs)` commit；报告写「ai-logs 已同步：N 个文件」 | PDF §6；§8.5 |
| 11 | message 按 §7.2：type(scope) 在词表内、英文祈使句 ≤ 72 字符、3–4 句 description、保留 `Co-Authored-By` | §7.2 |
| 12 | 不 squash、不 `--amend` 已推送的提交、不 force-push、不 push（除非当轮授权） | PDF §6；§7.0 / §7.1 |

`build` 允许在中间 commit 短暂红，但同一工作日内必须回绿。

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
  # `|| true`: grep exits 1 when this repo has no Codex sessions yet; with pipefail that would abort before the manifest.
  { grep -rl --include='*.jsonl' "\"cwd\":\"$ROOT\"" "$CODEX_SRC" 2>/dev/null || true; } | while read -r f; do
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
| 每个 commit | §7.3 十二条清单全过（format · typecheck · lint · 无 console.log · lockfile 同步 · story 同 commit · deviations 先登记 · README 同步 · ai-logs 同步 · message 规范） |
| 每个区块完成 | 375 / 1440 与 Figma 逐项对照 · 对应 story 存在 · 键盘可走通 |
| 每日收工 | `npm run build` 绿 · `npm run check:responsive` 绿 · push |
| 最终提交 | 上述全部 + `npm run storybook` 全绿 · a11y 零违规 · README 清单 §10 全勾 · `logs(ai-logs): final sync` 为最后一条 commit |

`package.json#scripts` 至少含：`dev` `build` `start` `lint` `typecheck` `format` `format:check` `test` `storybook` `build-storybook` `check:responsive` `sync:ai-logs`。

`typecheck` = `next typegen && tsc --noEmit`：Next 16 的 `LayoutProps` / `PageProps` 等全局类型由 `next typegen` 生成到 `.next/types/`，干净 clone 上不先 typegen 直接 `tsc` 会报 `Cannot find name 'LayoutProps'`。

---

## 10. README 必答清单（英文）

- [ ] 一段话：这是什么、怎么跑（四条命令）
- [ ] Directory structure：树 + 每层职责（§4）
- [ ] Data layer & API contract：schema 在哪、mock 怎么校验、切真后端只改哪一行
- [ ] Design decisions：§3.1 口供那张表的英文版
- [ ] Responsive strategy：流式 + 三断点 + `responsive-report.md` 结果表
- [ ] Interaction states & motion：token 表 + D 类清单链接
- [ ] Deviation log：链接 `docs/deviations.md`
- [ ] Storybook：怎么跑、组件与状态一览
- [ ] **AI usage**：用了哪些工具（Claude Code / Codex）、各写了哪些部分、每部分对应 `ai-logs/` 里的哪个 session id
- [ ] Known limitations

---

## 11. 决策记录（方案阶段遗留问题的拍板）

> 已拍板的写在这里，一行一条，带日期；影响「自决项说法」的同时回写 §3.1 口供。新冒出的待拍板问题先进 [TODO.md](TODO.md)「待澄清想法」，拍板后搬来。

| # | 问题 | 决定 | 日期 |
|---|---|---|---|
| 1 | 证言卡上的 X / Instagram / LinkedIn 图标 | **保留设计，不可点击**：渲染为装饰性图标（`aria-hidden`，不是链接、不是按钮），无 hover / focus 态。不算设计缺陷，不进 deviations | 2026-09-17 |
| 2 | 导航三个产品项的目标 | **锚点**滚动到对应区块，不做 `/coming-soon` 占位页。已回写 §3.1 口供「路由」行 | 2026-09-17 |
| 3 | `ai/` 内部文档语言 | **中文入库**。README 与一切考官可见文本是英文，内部规划文档中文不减分（PROJECT §5.0） | 2026-09-17 |
| 4 | 是否把方案阶段那次讨论的可读摘要写成 `docs/plan.md` | **不写**。方案的结论已全部落在本文与 feature 文档里，README「Design decisions」节即对外说法；旧 session 混有其他项目内容，按 §8.1 第 3 条不交 | 2026-09-17 |
| 5 | 响应式 Bonus 的证据形式 | **表 + 一张拼图**：`check:responsive` 每次跑都重生成 `docs/responsive-report.md` 的结果表并提交；截图只在最终提交前拍一次，11 个宽度缩成一张横向拼图 `docs/responsive-report.png` 放 `docs/`，README 引用；原始整页截图目录 `docs/responsive-shots/` 进 `.gitignore`。README「Responsive」节写三句：策略是 clamp 流式 + 三个形态断点 + 容器封顶，证据是这张表，画面是这张图。已回写 §3.1 口供 | 2026-09-17 |
| 6 | `prettier-plugin-tailwindcss` 是否进 `.prettierrc` | **进**。`plugins: ["prettier-plugin-tailwindcss"]`，class 顺序由插件定，人不手排 | 2026-09-17 |
