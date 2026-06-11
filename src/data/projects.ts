// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "library-system",
		title: "Library System",
		description:
			"一个简单的图书馆借阅平台，后端使用 Spring Boot + MyBatis-Plus + MariaDB，前端为静态 HTML/JavaScript，JWT 认证通过自定义拦截器实现。",
		image: "",
		category: "web",
		techStack: ["Spring Boot", "MyBatis-Plus", "MariaDB", "JavaScript", "Maven"],
		status: "completed",
		sourceCode: "https://github.com/Instreaman/library-system",
		startDate: "2025-01-01",
		tags: ["Java", "全栈", "图书馆"],
		showImage: false,
	},
	{
		id: "instreaman-cc",
		title: "instreaman.cc",
		description:
			"个人名片式主页，静态单页应用设计，包含头像、社交链接和工具导航卡片。",
		image: "",
		category: "web",
		techStack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
		status: "completed",
		sourceCode: "https://github.com/Instreaman/instreaman.cc",
		visitUrl: "https://instreaman.cc",
		startDate: "2025-01-01",
		tags: ["个人主页", "名片", "前端"],
		showImage: false,
	},
	{
		id: "vue3-element-admin",
		title: "Vue3 Element Admin",
		description:
			"基于 Vue 3 + Vite + TypeScript + Element Plus 的智能物流管理系统后台前端。",
		image: "",
		category: "web",
		techStack: ["Vue 3", "TypeScript", "Vite", "Element Plus", "UnoCSS"],
		status: "completed",
		sourceCode: "https://github.com/Instreaman/vue3-element-admin-damo",
		startDate: "2025-01-01",
		tags: ["Vue", "后台管理", "前端"],
		showImage: false,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
