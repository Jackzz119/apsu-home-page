# SELFCHECK — 测试自检

> **feature 文档 · 规范类**（不是单个功能的实施文档）。
> **管理 scope**：「甲方跑不起来」的隐患清单与对策、四条甲方命令在干净环境的可复现性、响应式 11 宽度扫描、按甲方 Assignment 逐条推导的验收测试（M5）、是否进 CI 的决定。任何新增测试、门禁脚本、CI 配置先登记在这里。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-18
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §3.2「甲方跑不起来的隐患与对策」 迁出。PROJECT.md 只保留索引、scope 与「项目决策口供」（§3.1）；本文与口供冲突时，先改口供再改这里。

---

## 一、目标

甲方只跑四条命令：`npm install` · `npm run build` · `npm run dev` · `npm run storybook`。本文保证它们在**甲方的机器**上绿，并用自动化测试在代码层面证明 [Front-End Take-Home Assignment.md](../Front-End%20Take-Home%20Assignment.md) 的每条可机检要求都满足。

## 二、「甲方跑不起来」的隐患与对策

甲方只跑四条命令：`npm install` · `npm run build` · `npm run dev` · `npm run storybook`。下面每条都是"在我们机器上绿、在甲方机器上红"的已知成因：

| # | 隐患 | 对策 |
|---|---|---|
| 1 | 甲方 Node 版本低于 20.9，Next 16 拒绝启动 | `.nvmrc` + `engines.node` + README 首段写明 "Node 22 LTS (tested on 22.23.1); minimum 20.9" |
| 2 | `package.json` 与 lockfile 不一致，`npm install` 静默改写 lock 装出别的版本 | 两个文件永远同一 commit 提交；每次改依赖后跑一次 `npm ci` 验证 lock 能独立复现 |
| 3 | `next/font/google` 在 build 时联网下载字体，甲方完全离线则 build 失败 | **接受此风险**，仍用 `next/font/google`：一行代码、无授权与文件管理成本；甲方跑 `npm install` 本来就要联网。字体名从 Figma Dev Mode 读，不猜 |
| 4 | `next build` 会在构建期预渲染 `/`，此时没有任何服务器在监听，页面若 `fetch("http://localhost:3000/api/home")` 会连接被拒，build 直接红 | `getHomePage()` 双分支：`NEXT_PUBLIC_API_URL` 为空 → 直接 `import { homeMock }` 返回，不发 HTTP；设置了 → `fetch(\`${url}/api/home\`)` 并 zod 校验。默认构建走前者，永不依赖运行中的服务 |
| 5 | Playwright 装完不自带浏览器，`check:responsive` 需要 `npx playwright install` | 这条命令**不进**四条甲方命令的依赖链；它是我们自己的门禁，README 里单独说明怎么跑 |
| 6 | macOS 文件系统不分大小写，`import "./button"` 引 `Button.tsx` 本机能过、Linux 上 build 红 | 仓库加 GitHub Actions，在 `ubuntu-latest` 上跑 `npm ci && npm run build && npm run lint && npm run build-storybook`；绿徽章贴 README，同时是"甲方环境能跑"的证明 |
| 7 | 甲方用 Windows，`package.json#scripts` 里的 `rm -rf` / `&&` 链 / bash 语法跑不了 | 四条甲方命令只调 `next` / `storybook` 自带 CLI；自研脚本用 Node 写，不用 bash；`sync-ai-logs.sh` 例外，因为它只在我们机器上跑 |
| 8 | build 依赖某个 env 变量而 `.env` 没提交 | 构建零必填 env；`NEXT_PUBLIC_API_URL` 可空；P0.5 已添加 `.env.example`，仅含空值与英文注释。P2 数据层已实现，默认本地取数；示例可入库，真实 `.env*` 仍被忽略 |
| 9 | `ai-logs/` 里单个 jsonl 超过 GitHub 100MB 硬限 | 每次同步脚本打印文件大小；单 session 逼近 50MB 就结束它开新 session |
| 10 | `postinstall` 钩子在甲方网络下失败 | 本项目不添加任何 `postinstall`；依赖里 `sharp` / `lightningcss` 的平台二进制由 lockfile 记录全部平台变体，`npm install` 自动挑 |

## 三、响应式扫描（RESPONSIVE.md 门禁的实现侧）

- 脚本：`scripts/check-responsive.ts`（Node + Playwright，不用 bash，见 §二 #7）
- 宽度：320 / 360 / 375 / 414 / 640 / 768 / 1024 / 1280 / 1440 / 1600 / 1920
- 每个宽度断言三条：`document.documentElement.scrollWidth <= window.innerWidth`；导航项 `getBoundingClientRect().top` 全部相等（同一行）；区块之间无重叠、无被裁切（元素 `right`/`bottom` 不超出其容器）
- 产出：结果表重生成写入 `docs/responsive-report.md`（入库）；每宽度整页截图写入 `docs/responsive-shots/`（gitignored，每次覆盖）；`--composite` 模式把 11 张缩成一张横向拼图 `docs/responsive-report.png`（入库，本轮 P6 首次交付；后续布局变化再刷新）。形式见 RESPONSIVE.md §五、PROJECT §11 #5
- 浏览器安装 `npx playwright install chromium` 不进甲方命令链，README 单独说明

## 四、验收测试（TODO M5：按 Assignment 逐条推导）

| Assignment 条目 | 可机检断言 | 工具 | 落点 |
|---|---|---|---|
| §1 commit the lockfile | `package-lock.json` 被 git 追踪；`npm ci` 成功 | vitest（读 git ls-files） / CI | `tests/acceptance/lockfile.test.ts` |
| §3 类型即契约 | `HomePage.parse(homeMock)` 通过；`content/schema.ts` 无手写重复 interface | vitest | `tests/schema.test.ts` |
| §4B 320–1920 完整性 | §三 的三条断言，11 宽度全过 | Playwright | `scripts/check-responsive.ts` |
| §4D 交互态 | 每个 `button` / `a` / `input` 在 `:hover` `:focus-visible` `:active` 下计算样式与默认态不同，且 `transition-duration` > 0 | Playwright | `tests/acceptance/states.spec.ts` |
| §4E Storybook | 每个 `components/ui/*` 与 client 区块都有同目录 `*.stories.tsx`；story 数 ≥ 该组件声明的状态数 | vitest（文件系统扫描） | `tests/acceptance/stories.test.ts` |
| §5 README | README 含 "AI usage" 与 "Deviation log" 两节且各有链接 | vitest | `tests/acceptance/readme.test.ts` |
| §6 ai-logs | `ai-logs/` 至少一个 `*.jsonl`，`MANIFEST.sha256` 校验全部通过 | vitest（Node `crypto` 重算 sha256，不依赖 shasum） | `tests/acceptance/ai-logs.test.ts` |

2026-09-18 落地口径（ST-3）：

- §1：`git ls-files` 追踪 + package.json 全部精确版本（无 `^` / `~`）+ lockfile v3 根依赖与 package.json 一致；`npm ci` 本身由 CI 跑。
- §3：`content/schema.ts` 无 `interface`，每个 `export type X` 都是 `z.infer<typeof X>`，schema 常量与类型一一对应。
- §4D：`states.spec.ts` 给页面上每个可见、可用的 `a[href] / button / input / select / textarea / summary / [tabindex="0"]` 打标，用 DevTools 协议 `CSS.forcePseudoState` 依次强制 `:hover`、`:active`、`:focus:focus-visible`，等 CSS transition 结束后比较子树计算样式签名（含图标、视觉隐藏单选旁的 label）。指针控件（链接 / 按钮 / summary）四项全要，键盘控件（输入 / 单选 / 可聚焦区域，含输入的步进按钮——2026-09-18 用户决定）只要 focus-visible；`aria-hidden` 复制轨、`inert` 幻灯片、关闭 dialog、skip link 不计；移动端另扫打开的菜单。1440 量 65 个、375 量 69 个，全部通过（PROJECT §11 #10）。
- §4E：每个 `ui/` 原语与 client 区块有同目录 stories；六个可按压原语必有 Hover / Focus / Pressed，六个带禁用语义的必有 Disabled；交互岛的文档状态（MenuOpen、BMI 四态、AllExpanded、Paused、Toggled）存在；每个原语的 stories 数 ≥ README 组件表声明数。
- §5：README 十个二级标题、四条甲方命令、AI usage 链到索引 / 原始 jsonl / manifest、Deviation log 链到 `docs/deviations.md`、全部相对链接可达。
- §6：每个工具至少一份 jsonl；manifest 文件集合 = 实际 jsonl 集合且 sha256 逐个相等；每个 session id 出现在 `ai-logs/README.md`；`readable/*.md` 与原始文件同名且声明 derived。

原则：断言写的是 Assignment 的原话能被机器判定的那一半；像素保真（§4A）与设计判断（§4C）不写成测试，靠人工对照与 deviations 记录。

## 五、CI（2026-09-18 已进，PROJECT §11 #9）

- 文件：`.github/workflows/ci.yml`，触发 push `main` 与 pull_request，同 ref 新跑取消旧跑。
- `quality` job：`ubuntu-latest`，`actions/setup-node@v7` 按 `.nvmrc` 取 Node 22 并缓存 npm；`npm ci` → `format:check` → `typecheck` → `lint` → `check:tokens` → `build` → `build-storybook` → `test`。
- `browser` job：`npm ci` → `npx playwright install --with-deps chromium` → `npm run build` → `npm run test:ui`（`playwright.config.ts` 在 `CI` 下用 `next start` 起生产服务，本地仍用 dev）→ 后台 `next start` 等待就绪 → `npm run check:responsive`；`test-results/`、重生成的 `docs/responsive-report.md` 与 `docs/responsive-shots/` 以 artifact 上传 14 天。CI 不提交任何文件。
- 目的：§二 #6 大小写与「甲方环境能跑」的证据；徽章 `actions/workflows/ci.yml/badge.svg?branch=main` 贴 README 首行。
- 首跑记录：run `35376147601`（`58c2c34`）quality 绿、browser 红——`primitives.spec.ts` 的 4 倍节流手风琴用例在 2 核 runner 上「反向后等 50ms 再采样」；trace 显示那次 50ms 的 Node 侧等待实际拖到 1.2s，采样时面板已经关完（`details` 无 `open`、内联高度已清），Chromium 对关闭 `details` 内容返回的 87px 全高被当成「跳回去」。第二跑 `35377058908`（`7ce69cd`）先等 `data-target-open="false"` 仍红（同一采样时机问题），quality 也红了一次：README 链到了尚未提交的 `ai-logs/readable/`。修法：把反向点击与逐帧采样放进同一个页内 `evaluate`（组件 finish 前或 300ms 内每帧高度单调不增，断言强于原来的单点），`readable/` 随 final sync 入库。

## 实现计划

进度：4 / 4 subtasks 完成（100%）

- [x] ST-1: `scripts/check-responsive.ts` + `npm run check:responsive` + `docs/responsive-report.md` 模板
- [x] ST-2: vitest 配置（`vitest.config.mts`，只跑 `tests/**` 与 `content/**`，不含 Storybook 浏览器测试）+ `npm test`（2026-09-17）
  - P0.3 范围：Node 环境，仅发现 `tests/**/*.test.{ts,tsx}` 与 `content/**/*.test.{ts,tsx}`；`@/` 指向仓库根。Storybook 与 Playwright 的 `*.spec.ts` 不进入本测试入口。
  - 冒烟测试：`tests/home.test.ts` 导入首页并用 React 服务端渲染输出 HTML，断言一个 `<main>` 地标；同时覆盖路径别名与 TSX 转换，无需新增依赖或启动浏览器。
  - 配置采用 `.mts` 显式声明 ESM：初次使用 `.ts` 时 Vite 8 提示配置被视为 CommonJS，后缀调整解决该警告，不改变整个项目的模块类型。
- [x] ST-3: §四 的验收测试逐条落地（2026-09-18；口径见 §四）
- [x] ST-4: CI 决定与 workflow 文件（2026-09-18；见 §五）

## 测试记录

- 2026-09-16：脚手架四绿；尚无自动化测试
- 2026-09-17：P0.3 完成，`npm test` 为 1 文件 / 1 测试通过；typecheck、lint、format:check 通过。临时探测文件验证 `tests/**/*.test.ts`、`content/**/*.test.tsx` 会被发现，`.storybook/`、`components/` 下的测试及 `tests/**/*.spec.ts` 不会被发现；探测文件已清理。配置改为 `.mts` 后不再出现 CommonJS / ESM 警告。
- 2026-09-17：P0.5 用 Node `parseEnv` 验证 `.env.example` 仅解析出 `NEXT_PUBLIC_API_URL: ''`；`git check-ignore --no-index --quiet` 验证示例可跟踪，`.env` / `.env.local` 被忽略。未创建或读取真实环境文件，未改运行时代码。

- 2026-09-17 P5：为满足区块 DoD 提前完成 P6.1 扫描器。三断言为页面横溢出、导航行/相邻项不重叠、区块顺序及文字边界（含裁切祖先）。有意图片裁切/跑马灯/轮播滚动视口/关闭菜单不按正文裁切误报，另用交互测试验证。11 宽生产扫描通过；可选 --composite 已实现但最终拼图留 P8。新增 17 条 BMI + 25 条资源尺寸测试，总计 91；新增 14 条页面浏览器用例，总计 32。P7 七条交付验收与 CI 不因本地测试通过而自动完成。

- 收口时新出现 .claude/worktrees/ 嵌套并行工作区，根 ESLint 原先会扫入另一检出的技能 CLI 并误报 no-console。根配置仅排除 .claude/worktrees/**，原应用规则不变，未修改/切换/清理另一工作区。

## P6 / BMI 验证结果

补充 BMI 空值、提示 / 结果前后几何稳定性、数字递增中间帧与终值、快速重算 / 编辑打断、键盘与 reduced-motion 回归；在 320–1920 的 11 宽度覆盖默认、错误、有效结果三态。沿用现有 Playwright 与响应式扫描器，不将 P7 验收 / CI 冒报完成。


- 92 Node、42 浏览器测试通过；BMI 在 11 宽下的默认、全错、仅体重错、有效结果和编辑清除状态，文档坐标变化均小于 1px，无横溢出。数字动画包含中间帧与终值检查，编辑中断、键盘提交、实时切换 reduced-motion 均通过。
- 14 个受影响 stories × 375/1440 = 28 次 axe / 横溢出检查零违规；当前共 109 stories。本轮未重新全扫全部 109 态，不用定向检查冒充完整审计。
- format/typecheck/lint/token guard、生产与 Storybook 构建通过。375 触控与 4 倍 CPU 节流检查终值和可访问终值；320 极端大数不改变布局或产生横溢出。
- 为避开并行会话未提交的 How it works 样式，从 `9a26050` 导出独立临时目录，在 Node 22.23.1 执行 npm ci / build，生产服务 3002 上 11 宽扫描及拼图通过；同一隔离生产页的 8 项 BMI 浏览器回归再次通过。临时目录默认 Node 21 不支持 strip-types，显式切至项目约定 Node 22 后通过，未改项目依赖或脚本。该验证不是 P8 四条甲方命令的完整干净克隆验收。
- Emil 审查结论 Approve：250ms ease-out 数字反馈只用于指针主动提交；最终值立即进入 live region，中间帧 aria-hidden；取消清理与减动效即时完成。数字 textContent 更新走主线程，不宣称 GPU 合成。同 agent UI Tailor / Monet 已看空态、错误态、结果态，表单与圆盘保持稳定；未做独立评审或物理设备测试。

## P7 / P8 验证结果（2026-09-18）

- Node：`npm test` 110 条（原 92 + `tests/acceptance/` 17 + schema 1）；`format:check` / `typecheck` / `lint` / `check:tokens` 通过。
- 浏览器：`npm run test:ui` 44 条（42 既有 + states 扫描 × 2 视口），1440 量 65 个可见控件、375 含打开菜单 69 个，全部具备要求的状态与过渡；扫描前把 D-03 的 `.logo` 链接缺口补上，并给 FAQ 圆形 chevron 的底色变化加了 `--dur-fast` 过渡；`.numberStepper button` 曾同样补齐，用户审阅后认为两态突兀要求撤回，改为把步进按钮按输入的一部分（键盘控件）处理。两套 Playwright 同时压一个 dev server 时 `sections.spec.ts` 的移动菜单用例偶发失败，单跑即过，未改断言。
- CI：run `35376147601`（`58c2c34`）quality 绿 / browser 红（见 §五 首跑记录）；run `35377058908`（`7ce69cd`）两 job 绿。
- 干净 clone（`git clone` 本地仓库到临时目录，Node 22.23.1 / npm 10.9.8）：`npm install` 约 5 秒（本机缓存）、`npm run build` 成功、`npm run dev` 首页与 `/api/home` 200、`npm run storybook` 111 stories 200。两处副作用：① `npm install` 把 `package-lock.json` 从 2 空格重写为 package.json 的 4 空格（`git diff -w` 为空，内容不变）——主检出已用 npm 自己的写法重提交（`ed4edea`），之后 clone 保持干净；② 由 AI 会话跑 `next dev` 时 Next 16 往 `AGENTS.md` 追加 `nextjs-agent-rules` 块，人类终端不触发，处置归 P0.7（TODO）。
- 日志：`readable:ai-logs` 由 6 份原始 jsonl 派生 6 份 Markdown（共约 450 KB），`ai-logs.test.ts` 校验派生文件与原始文件同名且声明 derived。
- 本地门禁的坑（2026-09-18 撤回步进两态后复验时发现）：specs 写死 `127.0.0.1:3000`；3000 上若是用户用裸 `npm run dev` 起的服务器（绑 localhost），从 127.0.0.1 加载的页面在 Next 16 的 dev origin 检查下 HMR 连不上、客户端永不 hydrate，所有交互测试都会「点了没反应」。同目录第二个 `next dev` 会被 `.next/dev/lock` 拒绝，Turbopack 也不接受指向项目外的 node_modules 软链，所以复验时把工作树导出到临时目录 `npm ci` + `next build` + `next start --hostname 127.0.0.1 --port 3100` 再扫（1440：65 / 375：69 全过）。CI 不受影响：那里由 Playwright 自己起 `--hostname 127.0.0.1` 的生产服务。README 浏览器门禁段已加一句提醒。
