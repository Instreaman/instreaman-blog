---
title: "Arch Linux 与 Niri 环境下的 Steam 游戏设置"
published: 2026-05-17
description: "记录 Niri 中 Steam 界面黑屏的处理方法，以及 ProtonPlus 和常见兼容层的选择思路。"
tags: ["Steam", "Proton", "Linux 游戏", "Niri"]
category: "Arch Linux"
lang: "zh_CN"
draft: false
permalink: "arch/steam-gaming"
---

本文记录 Niri 环境下 Steam 客户端黑屏的处理方式，以及通过 ProtonPlus 安装和
选择第三方兼容层时的基本思路。

## Steam 界面黑屏

如果 Steam 窗口内容黑屏，但界面仍能响应鼠标操作，可以尝试关闭客户端的 GPU
加速：

1. 将鼠标移动到窗口左上区域，打开 Steam 设置。
2. 进入“界面（Interface）”。
3. 关闭网页视图或界面的 GPU 加速选项。
4. 完全退出并重新启动 Steam。

不同 Steam 版本的选项名称可能略有差异。关闭 GPU 加速会牺牲一部分界面渲染
性能，但可以用于判断问题是否来自客户端的硬件加速路径。

## 使用 ProtonPlus 管理兼容层

Valve 官方 Proton 需要遵循自身的发布和许可策略，部分游戏可能需要社区版本中
额外提供的媒体组件、补丁或实验性功能。可以安装 ProtonPlus，在图形界面中管理
这些兼容工具。

安装完成后，应确认兼容层被部署到 Steam 能识别的位置，并重新启动 Steam。
然后在游戏属性的“兼容性”页面为单个游戏选择版本。

## 常见兼容层选择

| 工具或分支 | 主要特点 | 适用情况 | 建议 |
|---|---|---|---|
| Proton-GE | 集成额外媒体组件和社区补丁 | 游戏视频、语音或特定兼容问题 | 可作为常用社区版本优先测试 |
| Proton-CachyOS | 面向较新 CPU 的编译优化及补丁组合 | CPU 性能敏感或 CachyOS 相关环境 | 对比测试后再决定是否长期使用 |
| DW-Proton | 面向部分特定游戏和启动环境的社区修改 | 上游版本无法运行的目标游戏 | 仅在对应项目文档明确推荐时使用 |
| Proton-EM | 尝试较新的 Wine Wayland、图形或帧生成特性 | 测试前沿功能 | 可能存在回归，不宜作为唯一稳定版本 |
| Proton-GE RTSP | 在 GE 基础上增加特定流媒体相关补丁 | VRChat 等应用中的特定视频播放问题 | 有明确 RTSP 问题时再使用 |
| Proton-Tkg | 高度可定制并跟进较新 Wine 补丁 | 新游戏或特殊补丁验证 | 适合排错和实验，不保证稳定性 |
| Luxtorpeda | 使用 Linux 原生或开源重制引擎运行游戏资产 | 存在成熟开源引擎的老游戏 | 优先查阅其支持列表 |
| Roberta | 通过 ScummVM 运行兼容游戏 | 经典点击式冒险游戏 | 确认游戏在 ScummVM 支持列表中 |
| Boxtron | 面向 DOS 游戏的运行环境 | Steam 中的 DOS 老游戏 | 根据游戏兼容情况选择 |
| Steam Tinker Launch | 游戏启动包装和管理工具 | Mod、ReShade、调试或复杂启动参数 | 配置项较多，适合高级定制 |

## 选择顺序

1. 先测试 Steam 默认选择的官方 Proton。
2. 出现明确兼容问题时，尝试最新稳定版 Proton-GE。
3. 根据游戏日志、ProtonDB 和对应项目文档选择特化版本。
4. 每次只更换一个变量，避免同时修改兼容层、启动参数和图形设置。
5. 更新兼容层后如果问题异常，可备份并重建该游戏的 Proton prefix。

:::warning
第三方兼容层更新频繁，功能说明和适用游戏可能发生变化。涉及反作弊系统时，
应先确认游戏官方政策和社区最新报告，避免因不受支持的环境影响账号或游戏数据。
:::
