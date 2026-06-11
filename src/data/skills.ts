// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	tags?: string[]; // Skill tags
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	{
		id: "linux",
		name: "Linux",
		description:
			"专注于 Arch Linux 和其他主流发行版的使用和部署。自 2024 年 7 月起系统学习 Linux，已在 Ubuntu、Debian、CentOS 7、Fedora、Arch Linux 及 Gentoo 等多个发行版上有实践经验。主要应用场景为项目部署和日常桌面工作流。",
		icon: "logos:linux-tux",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 11 },
		tags: ["Arch", "Ubuntu", "Debian", "Fedora", "CentOS"],
		color: "#FCC624",
	},
	{
		id: "ai-coding",
		name: "AI Coding",
		description:
			"深度使用 AI 辅助编程工具。自 2025 年初持续使用 ChatGPT 和 Gemini 进行编程实践，2025 年 6 月开始在 VSCode 中集成 GitHub Copilot，随后陆续解锁 Codex 和 Claude Code。已将 AI 编程集成到日常开发工作流中，提高开发效率。",
		icon: "logos:openai-icon",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 6 },
		tags: ["ChatGPT", "Gemini", "GitHub Copilot", "Codex", "Claude"],
		color: "#10A37F",
	},
	{
		id: "c",
		name: "C",
		description:
			"自 2024 年 6 月起自学 C 语言，掌握基础语法和编程概念。学习主要以应付考试为目标，未进行深入的系统学习和实践项目开发。",
		icon: "logos:c",
		category: "backend",
		level: "beginner",
		experience: { years: 2, months: 0 },
		tags: ["基础", "自学"],
		color: "#A8B9CC",
	},
	{
		id: "java",
		name: "Java",
		description:
			"自 2025 年 3 月起根据课程安排学习 Java，掌握面向对象编程基础和 Java 核心语法。学习以课程要求为导向，主要为了应付考试。",
		icon: "logos:java",
		category: "backend",
		level: "beginner",
		experience: { years: 1, months: 3 },
		tags: ["课程", "基础"],
		color: "#ED8B00",
	},
	{
		id: "python",
		name: "Python",
		description:
			"自 2024 年 10 月起根据课程安排学习 Python，掌握基础语法和编程概念。学习以课程要求为导向，主要为了应付考试。",
		icon: "logos:python",
		category: "backend",
		level: "beginner",
		experience: { years: 1, months: 8 },
		tags: ["课程", "基础"],
		color: "#3776AB",
	},
	{
		id: "cpp",
		name: "C++",
		description:
			"自 2024 年 11 月起自学 C++，学习了基础语法和核心概念。后续学习因其他事项搁置，未进行深入的系统学习和实践项目。",
		icon: "logos:c-plusplus",
		category: "backend",
		level: "beginner",
		experience: { years: 1, months: 7 },
		tags: ["自学", "搁置"],
		color: "#00599C",
	},
	{
		id: "springboot",
		name: "Spring Boot",
		description:
			"自 2025 年 3 月起根据课程安排学习 Spring Boot。能够借助 AI Coding 工具（如 ChatGPT、Claude Code 等）独立完成项目，但对具体框架知识的掌握还不够深入，无法完全手写代码实现。",
		icon: "logos:spring-icon",
		category: "backend",
		level: "beginner",
		experience: { years: 1, months: 3 },
		tags: ["课程", "AI 驱动"],
		color: "#6DB33F",
	},
	{
		id: "html",
		name: "HTML",
		description:
			"自 2024 年 10 月起根据课程安排学习 HTML，掌握基础标签和页面结构。学习以课程要求为导向，知识掌握还不够深入。",
		icon: "logos:html-5",
		category: "frontend",
		level: "beginner",
		experience: { years: 1, months: 8 },
		tags: ["课程", "基础"],
		color: "#E34C26",
	},
	{
		id: "css",
		name: "CSS",
		description:
			"自 2024 年 10 月起根据课程安排学习 CSS，掌握样式和布局基础。学习以课程要求为导向，知识掌握还不够深入。",
		icon: "logos:css-3",
		category: "frontend",
		level: "beginner",
		experience: { years: 1, months: 8 },
		tags: ["课程", "基础"],
		color: "#1572B6",
	},
	{
		id: "javascript",
		name: "JavaScript",
		description:
			"自 2024 年 10 月起根据课程安排学习 JavaScript，掌握基础语法和编程概念。学习以课程要求为导向，知识掌握还不够深入。",
		icon: "logos:javascript",
		category: "frontend",
		level: "beginner",
		experience: { years: 1, months: 8 },
		tags: ["课程", "基础"],
		color: "#F7DF1E",
	},
	{
		id: "bash",
		name: "Bash",
		description:
			"自 2025 年 5 月起自学 Bash，能够理解和阅读现有脚本，可以编写一些基础的 Shell 脚本进行常见系统操作和自动化任务。",
		icon: "logos:bash-icon",
		category: "tools",
		level: "beginner",
		experience: { years: 1, months: 1 },
		tags: ["自学", "脚本"],
		color: "#4EAA25",
	},
	{
		id: "react",
		name: "React",
		description:
			"自 2026 年 1 月起学习 React，掌握组件和 Hooks 基础概念。主要依靠 AI Coding 工具（如 Claude Code、ChatGPT 等）辅助开发，能够借助这些工具完成项目。",
		icon: "logos:react",
		category: "frontend",
		level: "beginner",
		experience: { years: 1, months: 5 },
		tags: ["框架", "AI 驱动"],
		color: "#61DAFB",
	},
	{
		id: "vue",
		name: "Vue",
		description:
			"自 2026 年 3 月起学习 Vue，掌握基础的组件和响应式 API。主要依靠 AI Coding 工具进行开发，能够借助这些工具快速完成项目。",
		icon: "logos:vue",
		category: "frontend",
		level: "beginner",
		experience: { years: 1, months: 3 },
		tags: ["框架", "AI 驱动"],
		color: "#4FC08D",
	},
	{
		id: "mysql",
		name: "MySQL",
		description:
			"自 2025 年 3 月起根据课程安排学习 MySQL 数据库，掌握基础的 SQL 操作和数据库设计。同时自学了 MariaDB，两者使用体验相近。能够进行基础的数据库开发和查询优化。",
		icon: "logos:mysql",
		category: "database",
		level: "beginner",
		experience: { years: 1, months: 3 },
		tags: ["课程", "自学", "MariaDB"],
		color: "#00758F",
	},
	{
		id: "latex",
		name: "LaTeX",
		description:
			"自 2025 年 3 月起学习 LaTeX，掌握文档排版和论文编写的基本技能。能够使用 LaTeX 撰写学术论文、报告和各类科技文档。",
		icon: "mdi:file-document",
		category: "tools",
		level: "beginner",
		experience: { years: 1, months: 3 },
		tags: ["排版", "论文"],
		color: "#0E1C26",
	},
	{
		id: "k6",
		name: "K6",
		description:
			"自 2026 年 3 月起学习和使用 K6 进行网站性能测试。主要结合 AI Coding 工具（如 Claude Code 等）进行测试脚本编写和网站性能评估。",
		icon: "simple-icons:k6",
		category: "tools",
		level: "beginner",
		experience: { years: 1, months: 3 },
		tags: ["测试", "性能", "AI 驱动"],
		color: "#7D64FF",
	},
	{
		id: "solidity",
		name: "Solidity",
		description:
			"自 2025 年 12 月起学习 Solidity 智能合约开发，参加学校区块链比赛。仅学习 3 个月，主要为了比赛需求凑热闹，拿到省三等奖。知识掌握较浅，未进行深入系统学习。",
		icon: "simple-icons:solidity",
		category: "backend",
		level: "beginner",
		experience: { years: 0, months: 6 },
		tags: ["区块链", "智能合约", "比赛"],
		color: "#13293E",
	},

	// 前端技能示例
	// {
	// 	id: "javascript",
	// 	name: "JavaScript",
	// 	description:
	// 		"Modern JavaScript development, including ES6+ syntax, asynchronous programming, and modular development.",
	// 	icon: "logos:javascript",
	// 	category: "frontend",
	// 	level: "advanced",
	// 	experience: { years: 3, months: 6 },
	// 	projects: ["mizuki-blog", "portfolio-website", "data-visualization-tool"],
	// 	color: "#F7DF1E",
	// },

	// 后端技能示例
	// {
	// 	id: "java",
	// 	name: "Java",
	// 	description:
	// 		"Enterprise-level programming language, including Spring Boot, JPA, and microservices.",
	// 	icon: "logos:java",
	// 	category: "backend",
	// 	level: "advanced",
	// 	experience: { years: 4, months: 0 },
	// 	projects: ["enterprise-system", "api-gateway"],
	// 	color: "#ED8B00",
	// },

	// 数据库技能示例
	// {
	// 	id: "mysql",
	// 	name: "MySQL",
	// 	description:
	// 		"Relational database management system, experienced in database design and optimization.",
	// 	icon: "logos:mysql",
	// 	category: "database",
	// 	level: "advanced",
	// 	experience: { years: 3, months: 6 },
	// 	projects: ["e-commerce-backend", "crm-system"],
	// 	color: "#00758F",
	// },

	// 工具技能示例
	// {
	// 	id: "git",
	// 	name: "Git",
	// 	description:
	// 		"Version control system, experienced in managing repositories and collaboration workflows.",
	// 	icon: "logos:git-icon",
	// 	category: "tools",
	// 	level: "advanced",
	// 	experience: { years: 4, months: 0 },
	// 	color: "#F1502F",
	// },

	// 其他技能示例
	// {
	// 	id: "docker",
	// 	name: "Docker",
	// 	description:
	// 		"Containerization technology for application deployment and environment management.",
	// 	icon: "logos:docker-icon",
	// 	category: "other",
	// 	level: "intermediate",
	// 	experience: { years: 2, months: 0 },
	// 	projects: ["microservices-platform"],
	// 	color: "#2496ED",
	// },
];
