---
title: "Linux 下 VIA WebHID 键盘连接排错与配置"
published: 2026-05-17
description: "排查 VIA 网页端无法连接键盘的问题，并通过 udev 规则为 WebHID 配置合适的设备权限。"
tags: ["VIA", "WebHID", "udev", "键盘"]
category: "Arch Linux"
lang: "zh_CN"
draft: false
permalink: "arch/via-webhid-keyboard"
---

在 Linux 中使用 VIA 网页端连接 EPOMAKER Hack59 键盘时，浏览器连续报告
`NotAllowedError` 或协议版本无效。最终确认问题来自浏览器对
`/dev/hidraw*` 设备没有读写权限。

## 问题原因

Linux 默认限制普通用户访问裸 HID 设备。浏览器虽然支持 WebHID，但如果无权
打开对应的 `/dev/hidraw*`，VIA 就无法与键盘通信。

可以先查看设备节点及权限：

```bash
ls -l /dev/hidraw*
```

再通过 `lsusb` 或 udev 查询设备的厂商 ID（VID）和产品 ID（PID），避免为所有
HID 设备放宽权限。

## 配置 udev 规则

创建规则文件：

```bash
sudoedit /etc/udev/rules.d/99-via-keyboard.rules
```

为指定 VID/PID 写入规则：

```text
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", ATTRS{idVendor}=="36b0", ATTRS{idProduct}=="301e", TAG+="uaccess"
```

这里的 `36b0` 和 `301e` 只适用于我的键盘，实际使用时应替换为目标设备的
VID/PID。`TAG+="uaccess"` 会将当前本地登录用户的访问权限交给 systemd-logind
管理，通常比全局开放设备更合适。

:::warning
不建议直接使用 `MODE="0666"`。它会允许所有本机用户读写目标 HID 设备，权限
范围通常过大。如果桌面会话不能使用 `uaccess`，可以改用专用用户组和
`MODE="0660"`，但需要同时确认组成员关系。
:::

## 重载并验证

重新加载规则并触发设备事件：

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

也可以拔插一次键盘，让规则重新应用。随后检查设备权限，并重新打开浏览器和
VIA 页面：

```bash
ls -l /dev/hidraw*
```

如果仍无法连接，可以使用下面的命令确认目标节点匹配到了哪些属性：

```bash
udevadm info --attribute-walk --name=/dev/hidraw0
```

将 `/dev/hidraw0` 替换为实际设备节点，然后核对 VID、PID 和规则文件内容。
