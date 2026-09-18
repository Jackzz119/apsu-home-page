# STRUCTURE — 项目结构与技术栈

> **feature 文档 · 规范类**（不是单个功能的实施文档）。
> **管理 scope**：技术栈与每个依赖的精确版本、升降版决定及理由、脚手架实录、目录结构与命名规则、`package.json#scripts` 清单。改依赖版本或加目录，先改这里再动仓库。
> 归属：intj（索引）+ feature（细节） · 最后更新：2026-09-17
> 来源：2026-09-17 从 [PROJECT.md](../PROJECT.md) §3.1「固定项与版本锁定」与 §4「目录结构」 迁出。PROJECT.md 只保留索引、scope 与「项目决策口供」（§3.1）；本文与口供冲突时，先改口供再改这里。

---

## 一、目标

让任何人（考官、下一个 session）读完本文就能说出：装了什么版本、为什么是这个版本、代码放哪、叫什么名字。`package.json` 与本文说的必须是同一句话。

## 二、技术栈与版本锁定

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
| 校验 | `zod` | **4.6.5** | 数据契约的运行时形态，见 DATACONTRACT.md |
| 动效 | `motion` | **13.4.0** | 保留依赖；CSS 优先，按实际 spring / layout / exit / 手势需求决定使用处，见 MOTION.md |
| 图标 | `lucide-react` | 1.46.0 | 品牌图标自绘 SVG |
| 变体 | `class-variance-authority` | 0.7.1 | 原语组件的 variant 映射 |
| Storybook | `storybook` `@storybook/nextjs-vite` `@storybook/addon-a11y` `storybook-addon-pseudo-states` | **10.6.0** 四包同版本 | peer 已声明支持 Next 16 |
| 单测 | `vitest` | 5.0.1 | schema 与纯函数 |
| E2E | `@playwright/test` | 1.63.0 | 响应式扫描，见 SELFCHECK.md §三 |
| 无障碍机检 | `axe-core` | 4.13.0 | P4 原语逐态浏览器门禁，版本与当前 Storybook a11y 依赖一致；显式声明测试直接使用的依赖 |
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

## 三、目录结构（评分项，README 里必须解释）

```
apsu-home/
├── app/                        路由层：只放 layout / page / route handler，页面是薄壳
│   ├── layout.tsx
│   ├── page.tsx                const data = await getHomePage(); 分发给 14 个区块
│   └── api/home/route.ts       假后端：返回 mock，形状 = HomePage schema
├── components/
│   ├── index.ts                组件库统一出口：ui/ 与 sections/ 的全部导出都从这里 re-export，见 COMPONENTS.md
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
│   ├── export-readable-logs.mjs §8.3：由原始 jsonl 派生 ai-logs/readable/*.md（用户提问 / 回复 / 工具调用一行摘要）
│   ├── check-tokens.mjs        TOKENS ST-3：魔法值机检
│   └── check-responsive.ts     SELFCHECK.md §三：Playwright 11 宽度扫描
├── docs/
│   ├── deviations.md           §6：偏差日志（C 类 + D 类）
│   ├── responsive-report.md    check:responsive 每次重生成的结果表（入库）
│   ├── responsive-report.png   11 宽度横向拼图，最终提交前生成一次（入库）
│   └── responsive-shots/       原始整页截图，每次覆盖（gitignored）
├── ai/
│   ├── PROJECT.md              本文
│   └── TODO.md                 任务唯一来源
├── ai-logs/                    §8：原始会话记录，未编辑；readable/ 为派生可读版
├── .github/workflows/ci.yml    SELFCHECK §五：quality + browser 两个 job
├── tests/                      schema 与纯函数等自动化测试
├── vitest.config.mts           Node 测试配置；只发现 tests/ 与 content/ 中的 *.test.ts(x)
├── .codex/config.toml          Codex 项目级 MCP 服务地址，OAuth 凭据不入库
├── .env.example                可选 API 地址示例，默认空值；接入归 P2
├── .storybook/
├── README.md
└── package-lock.json
```

命名：目录 kebab-case；组件文件 PascalCase（`Button.tsx` + `Button.stories.tsx` 同目录）；其余 camelCase；文档全小写 kebab-case，`README.md` / `PROJECT.md` / `TODO.md` 例外。

---

## 四、待实现 / 已知问题

- P4 增加 `playwright.config.ts`、`tests/primitives.spec.ts` 与 `npm run test:ui`：复用 / 启动 6006 Storybook，Chromium 在 375 / 1440 跑逐态 axe 和真实交互。`content/mocks/primitives.ts` 只装开发标本 / a11y 辅助文案，业务文字继续取 homeMock。`test-results/` / `playwright-report/` 为可重建产物，不入库、不参与格式化。

- P0.1 已完成：`components/{ui,sections}/`、`content/mocks/`、`lib/api/`、`styles/`、`docs/`、`tests/`、`public/images/` 骨架就位；空目录用 `.gitkeep` 保留。P3 已填充 tokens，P4 已导出 11 个原语及 props。
- `app/page.tsx` 现为明确标注的开发标本，从统一出口渲染源 CTA 的 disabled 示例；完整首页组装归 P5。五个脚手架 SVG 已删除，`scripts/check-responsive.ts` 实现仍归 P6。
- P0.2 已补齐 `package.json#scripts` 的 `test` 与 `check:responsive`：前者运行 Vitest，后者在 P6.1 实现前明确报未实现并失败。P0.3 已新增 `vitest.config.mts` 与 `tests/home.test.ts`，测试范围与验证记录见 SELFCHECK ST-2。
- P0.4 已完成全量格式检查与项目 `no-console` 规则；共享技能 CLI 的例外范围见 ST-3。本文三个 subtasks 已完成，P0 工程验证已完成；P0.7 按用户指示暂缓，不阻塞后续阶段，提交由用户决定。

## 实现计划

进度：3 / 3 subtasks 完成（100%）

- [x] ST-1: 按 §三 建空目录骨架与 `styles/tokens.css` 起步文件，删脚手架占位物（2026-09-17）
  - 影响文件：`app/page.tsx`、`public/*.svg`、`public/images/`、`components/`、`styles/tokens.css`、`content/`、`lib/`、`docs/`、`tests/`、`README.md`
  - 说明：先把树立起来，后续 feature 各自往里填；占位 svg 是 Vercel 素材，不该出现在交付里
- [x] ST-2: 补 `package.json#scripts` 的 `test` 与 `check:responsive`（2026-09-17）
  - 影响文件：`package.json`
  - 说明：§9 门禁要求的最少脚本集；`check:responsive` 的实现归 SELFCHECK.md
  - P0.2 实施范围：`test` 使用 `vitest run`；`check:responsive` 暂用 Node 向 stderr 输出 `not implemented` 并返回退出码 1，避免未实现时误报通过。P0.3 补测试配置与首个测试，P6.1 替换响应式占位命令。
- [x] ST-3: 格式化与 lint 规则收口（2026-09-17）
  - P0.4 范围：全量运行现有 Prettier 配置；在 ESLint 中增加 `no-console: ['error', { allow: ['error'] }]`。该规则覆盖项目代码，仅对 `ai/jaSkills/**` 的共享 CLI 工具不启用；不改技能源码，也不关闭这些文件原有的其他 lint 规则。
  - 影响文件：`eslint.config.mjs`；沿用 `.prettierrc`，本次未改格式配置。
  - 说明：全量 `npm run format` 已执行且所有文件均未发生额外格式改动；原有「11 个文件不合格式」与「2 空格双引号」描述已过时。项目 `no-console` 规则已生效，共享技能保持原有命令输出。

## 测试记录

- 2026-09-16：`npm run typecheck` · `lint` · `build` · `build-storybook` 四绿（脚手架状态）
- 2026-09-17：P0.1 的 `app/page.tsx`、`components/index.ts`、`styles/tokens.css`、`README.md` 通过 Prettier 检查；`npm run typecheck`、`npm run lint`、`npm run build` 通过。构建提示忽略仓库外的 `/Users/chengzheng/pnpm-lock.yaml`，不影响结果；本次未改构建配置。P0 整阶段门禁尚未完成。
- 2026-09-17：P0.2 两个入口均实测：`npm test` 成功启动 Vitest 5.0.1，因尚无测试而以退出码 1 结束；`npm run check:responsive` 输出 `check:responsive not implemented (P6.1).`，退出码 1。这是脚本接线验证，不代表测试或响应式门禁已通过。
- 2026-09-17：P0.4 的 format / format:check / typecheck / lint / test 均通过（1 个测试）。用 ESLint API 的内存探测验证 `console.log/warn/info/debug` 均为 error，`console.error` 放行；app、components、content、lib、scripts、tests、.storybook 均覆盖。共享技能 CLI 未启用该条规则，其他 lint 规则仍保留；未创建探测文件。

- 2026-09-17：P0 收口重新执行 `npm ci → format:check → typecheck → lint → build → test → build-storybook` 全部通过（Node 22.23.1 / npm 10.9.8，1 测试，npm audit 0 漏洞）。补齐 `app/api/home/.gitkeep` 以保留假后端目录，响应式原始截图目录本地存在且按既有规则忽略。原始目录树的未来文件仍归各阶段实现。Next 仓库外 lockfile 提示与 Storybook 无 stories / chunk 大小 / use client 打包提示不阻塞构建；未改锁文件、依赖与协议。工作区保留待用户决定的文档和日志，未将 git clean 误报为已通过。

- 2026-09-17 P4：`axe-core@4.13.0` 显式 devDependency 与 lockfile 同步；在独立临时目录 `npm ci` 安装 525 包成功。依赖工具原生输出保留 tsconfck / ESLint 的弃用提示，本轮不扩大版本升级范围。原语审图证据为 `docs/primitive-review-375.png` / `primitive-review-1440.png`；`.storybook/primitiveDecorators.tsx` 统一原语 story 地标和焦点留白。两份配置文件的 generated ignore 增加 test-results / playwright-report。
