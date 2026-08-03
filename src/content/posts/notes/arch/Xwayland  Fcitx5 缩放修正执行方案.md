---
title: "Xwayland 与 Fcitx5 缩放修正方案"
published: 2026-05-17
updated: 2026-05-21
description: "通过 Xresources 设置 Xft DPI，改善 Wayland 混合缩放环境中部分 Xwayland 应用的字体尺寸。"
tags: ["Xwayland", "Fcitx5", "DPI", "Niri"]
category: "Arch Linux"
lang: "zh_CN"
draft: false
permalink: "arch/xwayland-fcitx5-scaling"
---

在 Wayland 环境中，部分微信、QQ、WPS 等传统桌面应用仍通过 Xwayland 运行。
这些应用可能无法正确跟随合成器的缩放比例，表现为字体或输入法界面尺寸异常。

可以通过 Xresources 设置 `Xft.dpi`，验证它是否能改善目标应用的显示效果。

## 计算目标 DPI

先查询当前输出设备的缩放比例。不同桌面或合成器可使用不同命令：

```bash
niri msg outputs       # Niri
# hyprctl monitors     # Hyprland
# kscreen-doctor -o    # KDE Plasma
# xrandr               # 传统 X11 环境
```

我的 Niri 输出包含：

```text
Output "Lenovo Group Limited 0x8BA1 0x00006003" (eDP-1)
  Current mode: 3200x2000 @ 60.000 Hz (preferred)
  Physical size: 340x220 mm
  Logical size: 1828x1142
  Scale: 1.75
```

以标准 96 DPI 为基准：

```text
96 × 1.75 = 168
```

因此可以先测试 `Xft.dpi: 168`。

## 临时验证

将设置合并到当前 X 资源数据库：

```bash
echo "Xft.dpi: 168" | xrdb -merge
```

完全退出并重新启动目标 Xwayland 应用，检查字体、界面和 Fcitx5 候选框尺寸。

:::tip
`Xft.dpi` 主要影响读取 Xresources 的 X11/Xwayland 应用，并不能保证修复所有
程序。Electron、Qt 和 GTK 应用还可能受到自身缩放变量或启动参数影响。
:::

## 持久化配置

确认效果合适后，将配置写入 `~/.Xresources`：

```text
Xft.dpi: 168
```

避免反复使用 `>>` 追加相同配置，否则文件中可能出现多个互相覆盖的值。

## 在 Fish 中自动加载

创建 `~/.config/fish/conf.d/xresources.fish`：

```fish
if test -n "$DISPLAY"; and type -q xrdb
    if test -f "$HOME/.Xresources"
        xrdb -merge "$HOME/.Xresources"
    end
end
```

打开新的终端会话，或手动加载文件：

```fish
source ~/.config/fish/conf.d/xresources.fish
```

如果图形应用并不是从 Fish 启动，更稳妥的做法是在图形会话启动阶段加载
Xresources，而不是依赖交互式 Shell。
