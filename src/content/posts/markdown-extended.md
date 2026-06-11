---
title: Markdown 扩展功能
published: 2024-05-01
updated: 2024-11-29
description: '了解更多 Mizuki 中的 Markdown 功能'
image: ''
tags: [演示, 示例, Markdown, Mizuki]
category: '示例'
draft: false 
---

## GitHub 仓库卡片
你可以添加动态卡片链接到 GitHub 仓库，页面加载时，仓库信息从 GitHub API 提取。

::github{repo="LyraVoid/Mizuki"}

使用代码 `::github{repo="LyraVoid/Mizuki"}` 创建 GitHub 仓库卡片。

```markdown
::github{repo="LyraVoid/Mizuki"}
```

## 提示框

支持以下类型的提示框：`note` `tip` `important` `warning` `caution`

:::note
突出用户应该注意的信息，即使是浏览时也应注意。
:::

:::tip
可选信息，帮助用户更成功。
:::

:::important
用户成功所需的关键信息。
:::

:::warning
需要立即引起用户注意的关键内容，涉及潜在风险。
:::

:::caution
操作的负面潜在后果。
:::

### 基本语法

```markdown
:::note
突出用户应该注意的信息，即使是浏览时也应注意。
:::

:::tip
可选信息，帮助用户更成功。
:::
```

### 自定义标题

可以自定义提示框的标题。

:::note[自定义标题]
这是一个带有自定义标题的便签。
:::

```markdown
:::note[自定义标题]
这是一个带有自定义标题的便签。
:::
```

### GitHub 语法

> [!TIP]
> [GitHub 语法](https://github.com/orgs/community/discussions/16925)也被支持。

```
> [!NOTE]
> GitHub 语法也被支持。

> [!TIP]
> GitHub 语法也被支持。
```

### 剧透

你可以在文本中添加剧透。文本也支持 **Markdown** 语法。

内容 :spoiler[是隐藏的 **哎呀**]！

```markdown
内容 :spoiler[是隐藏的 **哎呀**]！
