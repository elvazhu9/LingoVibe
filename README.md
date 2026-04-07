# LingoVibe｜AI 语境词典 Demo

> 一个面向多语言学习者的 AI 语言学习工具：不只翻译单词，而是把“含义、语气、例句、发音、记忆和复习”串成一条学习闭环。

[![React](https://img.shields.io/badge/React-19-4F46E5?style=flat-square)](#技术实现)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-2563EB?style=flat-square)](#技术实现)
[![Gemini](https://img.shields.io/badge/Gemini-AI-FFB703?style=flat-square)](#技术实现)
[![Vite](https://img.shields.io/badge/Vite-6.2-FB7185?style=flat-square)](#技术实现)

## 30 秒看懂

LingoVibe 是我在 Google AI Studio 中 vibe coding 的一个 AI 词典 app。它来自一个很具体的痛点：学习外语时，很多词不是“知道中文意思”就会用，尤其是口语、俚语、短句和带情绪的表达，更需要语境、语气、自然例句和反复复习。

这个项目想验证一件事：AI 词典可以从“查询工具”变成“轻量学习伙伴”。用户输入一个词或短句后，AI 会输出自然解释、例句翻译、发音、语境提示、图片辅助记忆，并支持收藏到 Notebook、生成故事和闪卡复习。

## 产品使用展示

以下界面来自可运行 Demo 的真实截图，使用示例词条 `Saya senang sekali`，展示从查词到复习的完整链路。

| 首页输入 | 词条结果概览 | 语境例句与学习提示 |
| --- | --- | --- |
| <img src="docs/images/lingovibe-home.png" alt="LingoVibe 首页输入界面" width="240" /> | <img src="docs/images/lingovibe-result-overview.png" alt="LingoVibe 词条结果概览" width="240" /> | <img src="docs/images/lingovibe-result-note.png" alt="LingoVibe 语境例句与学习提示" width="240" /> |

| Notebook 收藏 | Review 闪卡复习 |
| --- | --- |
| <img src="docs/images/lingovibe-notebook.png" alt="LingoVibe Notebook 收藏页" width="240" /> | <img src="docs/images/lingovibe-review.png" alt="LingoVibe Review 闪卡复习页" width="240" /> |

## 我做了什么

- **需求定义：** 从“语言学习者查到翻译但不会自然使用”的痛点出发，拆出查词、理解、追问、收藏、复习 5 个核心场景。
- **产品设计：** 设计首页输入、结构化结果页、Notebook 收藏、Review 闪卡复习等关键页面，实现完整产品闭环，而不是单点 AI 聊天功能。
- **AI 工作流：** 用结构化提示词和 Schema 约束模型输出，降低大模型回答漂移、字段缺失和前端渲染不稳定的问题。
- **原型实现：** 基于 React / TypeScript / Vite 实现移动端优先的可运行 Demo，接入 Gemini 文本生成、图片生成与 TTS 发音能力。
- **用户反馈与迭代：** 邀请 1 位在印尼创业、具备真实印尼语使用场景的朋友试用；基于“发音地道，但朗读延迟、结果页加载过长，使用体验不佳”等反馈完成 1 版产品迭代。

## 核心功能

- **多语言输入：** 支持 11 种语言，用户可选择自己的母语和正在学习的目标语言。
- **语境化解释：** 输入单词、短语、俚语或完整句子后，输出母语解释、例句、例句翻译、使用场景和易混表达提示。
- **发音辅助：** 为目标词和例句提供 TTS 发音，帮助用户判断表达是否自然。
- **AI 视觉记忆：** 为词条生成概念图，用图片帮助记忆抽象词义或情绪表达。
- **追问聊天：** 用户可以围绕当前词条继续追问语气、近义词、口语替代表达或使用场景。
- **Notebook 收藏：** 把查过的词条保存到本地 Notebook，方便之后复习。
- **故事生成与闪卡复习：** 将收藏词条串成短故事，并通过 Review 模式做轻量翻卡复习。

## 产品思考

传统词典很适合“查定义”，但对真实表达的帮助有限；通用 AI 聊天很灵活，但结果容易发散，也不利于沉淀复习。因此 LingoVibe 的设计重点不是做一个更复杂的聊天框，而是把 AI 输出收敛成可学习、可收藏、可复习的结构化内容。

我在此次vibe coding实践中重点练习了三个 AI 产品经理能力：

- **把模糊需求产品化：** 从“我想知道这个词怎么用”拆成可交互的信息架构和学习路径。
- **把模型能力结构化：** 让大模型承担解释、例句、语气判断、图片提示和复习内容生成，而不是只返回一段自由文本。
- **用AI工具快速验证产品可行性：** 快速搭建起产品 demo，并用真实场景用户反馈驱动迭代。

## 技术实现

- **前端：** React 19、TypeScript、Vite、Tailwind CSS
- **AI 能力：** `@google/genai`，覆盖文本生成、图片生成与 TTS 发音
- **内容渲染：** React Markdown，用于展示解释和追问内容
- **本地存储：** Browser localStorage，用于保存 Notebook 词条
- **稳定性设计：** 使用 JSON Schema 约束模型输出结构，减少字段漂移和 UI 渲染失败

## 如何运行

```bash
npm install
```

创建 `.env.local`，写入 Gemini API Key：

```bash
GEMINI_API_KEY=your_api_key_here
```

启动本地开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```
