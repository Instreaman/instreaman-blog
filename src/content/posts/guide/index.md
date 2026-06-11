---
title: Mizuki 简易指南
published: 2024-04-01
description: "如何使用此博客模板。"
image: "./cover.webp"
tags: ["Mizuki", "博客", "自定义"]
category: 指南
draft: false
---

本博客模板使用 [Astro](https://astro.build/) 构建。对于本指南中未提及的内容，你可以在 [Astro 文档](https://docs.astro.build/)中找到答案。

## 文章前置数据

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我的新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [Foo, Bar]
category: 前端
draft: false
---
```



| 属性 | 描述 |
|---|---|
| `title` | 文章的标题。 |
| `published` | 文章发布的日期。 |
| `pinned` | 该文章是否固定在文章列表的顶部。 |
| `priority` | 固定文章的优先级。较小的值表示更高的优先级（0, 1, 2...）。 |
| `description` | 文章的简短描述。在索引页面上显示。 |
| `image` | 文章的封面图片路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：`public` 目录中的图片<br/>3. 没有上述前缀：相对于 markdown 文件 |
| `tags` | 文章的标签。 |
| `category` | 文章的分类。 |
| `licenseName` | 文章内容的许可证名称。 |
| `author` | 文章的作者。 |
| `sourceLink` | 文章内容的源链接或参考。 |
| `draft` | 如果此文章仍然是草稿，则不会显示。 |

## 文章放在哪里

你的文章文件应该放在 `src/content/posts/` 目录中。你也可以创建子目录来更好地组织你的文章和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.webp
    └── index.md
```