---
title: "Arch Linux 与 Niri 环境下的 xremap 配置"
published: 2026-05-17
description: "在非 root 环境中配置 xremap，将 Caps Lock 映射为单击 Esc、长按 Ctrl，并支持键盘热插拔。"
tags: ["xremap", "Niri", "systemd", "键盘"]
category: "Arch Linux"
lang: "zh_CN"
draft: false
permalink: "arch/xremap-niri"
---

目标是在 Niri（Wayland）环境中使用 xremap，将 Caps Lock 配置为“单击 Esc、
长按 Ctrl”，并让外接键盘热插拔后自动生效。

## 安装 xremap

从 AUR 安装带 Niri 支持的版本：

```bash
yay -S xremap-niri-bin
```

## 配置输入设备权限

xremap 需要读取真实输入设备，并通过 `/dev/uinput` 创建虚拟键盘。

### 加入 input 用户组

```bash
sudo usermod -aG input "$USER"
```

组成员变更需要注销并重新登录，或者重启系统后才能完整生效。

### 加载 uinput 模块

```bash
echo uinput | sudo tee /etc/modules-load.d/uinput.conf
sudo modprobe uinput
```

### 配置 udev 规则

创建 `/etc/udev/rules.d/99-xremap.rules`：

```text
KERNEL=="uinput", GROUP="input", MODE="0660", OPTIONS+="static_node=uinput"
SUBSYSTEM=="input", GROUP="input", MODE="0660"
```

重新加载规则：

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

:::warning
第二条规则会把所有 input 子系统设备交给 `input` 组，权限范围较广。多用户机器
应进一步限制设备匹配条件，并谨慎控制 `input` 组成员，因为读取输入设备可能
暴露键盘输入。
:::

## 编写键位映射

创建 `~/.config/xremap/config.yml`：

```yaml
modmap:
  - name: CapsLock to Ctrl/Esc
    remap:
      CapsLock:
        held: Ctrl_L
        alone: Esc
        alone_timeout: 500

# 可选：按应用配置快捷键。
# keymap:
#   - name: Terminal shortcuts
#     application:
#       only: [Alacritty, WezTerm]
#     remap:
#       Alt-c: Ctrl-Shift-c
```

## 创建 systemd 用户服务

`--watch` 会持续监听输入设备，使后插入的外接键盘也能被识别。创建
`~/.config/systemd/user/xremap.service`：

```ini
[Unit]
Description=xremap service
Requires=graphical-session.target
After=graphical-session.target

[Service]
ExecStart=/usr/bin/xremap --watch %h/.config/xremap/config.yml
Restart=always
RestartSec=2

[Install]
WantedBy=graphical-session.target
```

加载并启动服务：

```bash
systemctl --user daemon-reload
systemctl --user enable --now xremap.service
```

## 验证与排错

查看服务状态和最近日志：

```bash
systemctl --user status xremap.service
journalctl --user -u xremap.service -b
```

分别测试内置键盘和外接键盘，并在服务运行期间拔插外接键盘，确认 Caps Lock
映射仍然有效。
