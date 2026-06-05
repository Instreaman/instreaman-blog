import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
  avatar: "https://q1.qlogo.cn/g?b=qq&nk=2804914560&s=640", // QQ头像API
  name: "Instreaman",
  bio: "世界は大きい、君は行かなければならない",
  typewriter: {
    enable: true, // 启用个人简介打字机效果
    speed: 80, // 打字速度（毫秒）
  },
  links: [
    {
      name: "Bilibili",
      icon: "fa7-brands:bilibili",
      url: "https://space.bilibili.com/409590859",
    },
    {
      name: "Gitee",
      icon: "mdi:git",
      url: "https://gitee.com/instreaman",
    },
    {
      name: "GitHub",
      icon: "fa7-brands:github",
      url: "https://github.com/instreaman",
    },
    {
      name: "X",
      icon: "fa7-brands:x-twitter",
      url: "https://x.com/instreaman",
    },
    {
      name: "Zhihu",
      icon: "fa7-brands:zhihu",
      url: "https://www.zhihu.com/people/isytyrt",
    },
    {
      name: "Telegram",
      icon: "fa7-brands:telegram",
      url: "https://t.me/EvanInstris",
    },
    {
      name: "Steam",
      icon: "fa7-brands:steam",
      url: "https://steamcommunity.com/id/instreaman",
    },
    {
      name: "Gmail",
      icon: "fa7-solid:envelope",
      url: "mailto:instreaman@gmail.com",
    },
  ],
};
