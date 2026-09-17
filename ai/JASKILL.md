# JASKILL — 本项目专属技能登记

> 本文件由 `shelf init` 在项目里**缺它时植入一次**，之后归项目自己维护，**不随货架同步**（`shelf sync` 不会覆盖它）。
> 这里只登记**本项目专属**的技能：第三方领域知识包（ORM、认证、组件库、构建系统……）和绑定本项目基础设施的自建技能。
> 通用技能（`intj` / `feature` / `vc` / `logman` / `custom-skill` / `shelf-ops` ……）**不登记在这里**——它们的名册与触发规范在根 `CLAUDE.md` / `AGENTS.md`「Skill 系统」节。

## 读法

技能唯一正本在 `ai/jaSkills/<name>/`；agent 的技能目录（`.claude/skills` 等）是指向它的链接，从哪边读都是同一份。
先读对应 `SKILL.md`，再按需读 `reference.md` / `references/` / `rules/`，不整包加载。遇到表里的场景**主动触发**，不等用户提醒。

## 技能与触发场景

| 技能 | 何时读 | 上游 |
| --- | --- | --- |
| [emil-design-eng](jaSkills/emil-design-eng/SKILL.md) | P3 写动效 token 前；P4/P5 每个 UI 原语 / 区块完成后的视觉与交互细节复核 | emilkowalski/skills |
| [animate](jaSkills/animate/SKILL.md) | 每次新增或修改动效，先判断频率与目的，再按七步实现；对应组件必读 RECIPES.md | emilkowalski/skills |
| [review-animations](jaSkills/review-animations/SKILL.md) | P4/P5 每个带动效的原语 / 区块完成后显式调用；读 STANDARDS.md，输出 Before / After / Why 与 Block / Approve | emilkowalski/skills |
| [find-animation-opportunities](jaSkills/find-animation-opportunities/SKILL.md) | P5 全页组装后只读扫一次；最多 5–7 条建议，并记录考虑过但拒绝的候选 | emilkowalski/skills |

登记规则：一行一个技能；「何时读」写**触发场景**（用户会说什么、代码里会碰到什么），不写功能简介；「上游」写来源仓库，自建的写「本项目自建」。
技能之间有分工边界（谁管动效、谁管视觉 token 之类）时，在表下面用一两句话写清，别让两个技能抢同一个场景。

## Emil 来源与项目适配（2026-09-17）

- 四个技能来自 [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/85e8e2363b713506e1d5b6e07a0eb2da66be1bc3/skills)，固定 commit `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`，由 `skill-installer` 按 `skills/<name>` 安装到 `ai/jaSkills/`。复现时取该 commit 的同名目录，不能直接取浮动 main。
- 上游 6 份 Markdown 原样保留（含 animate/RECIPES.md、review-animations/STANDARDS.md），每个目录附上游 MIT `LICENSE`。项目适配集中在本节与 [MOTION.md](features/MOTION.md)。`emil-design-eng` 的 674 行为第三方原件，不按自建技能的 500 行建议重排。
- `shelf adopt` 仅将四个技能记入本地账本，不上架；两套 agent 通过已有整目录链接读取同一份真源。新增技能的自动发现可在下次 session 生效，当前 session 可按链接显式读取。
- **不调用 `pick-ui-library`，不安装 Base UI / Radix / Sonner / zustand。** 忽略 animate 第 3 步引导安装 UI 库的指令；依 TOKENS §二自研原语并验证原生语义、焦点与键盘行为。`var(--transform-origin)` 不是本项目内置变量，只有组件自行定义后才能用。
- 示例中的 `framer-motion` import 改为项目已安装的 `motion/react`；保留现有 motion 依赖，是否使用按具体交互判断。不要为了复刻示例再装旧包。
- `review-animations` 保留 `disable-model-invocation: true`。用户本轮已指定其为 UI 开发工作流步骤：届时以该明确请求显式调用 / 读取，不能宣称技能会自行触发；脱离该工作流仍仅手动调用。
- Emil 提供主要动效与 UI polish 标准；UI Tailor 管实现与交互，Monet 看实际截图 / 动画复核全局一致性。默认态继续对齐 Figma，技能不能替代设计真源或 deviations 批准。无独立 reviewer 时如实注明同一 agent 自审。

## 更新与工作区

- 第三方技能用安装器更新；本项目 Emil 按明确的 commit 更新，核对差异后同步本表与 README 的 hash，不跟随浮动 main。装完跑 `shelf adopt` 让账本 `local` 段入账。
- 新检出 / 新 worktree：跑一次 `shelf init`，协议文档与技能链接一并还原（幂等，已有文件不覆盖）。
- 除本表已声明的项目适配与用户明确决定外，本表与技能 `SKILL.md` 不符时以上游为准并修订本表；不要用上游示例覆盖本项目的 UI 库约束、减动效例外或 deviations 审批。
- `shelf sync` 会核对正本里的项目专属技能是否都登记在本表，漏的会提示补登记。
