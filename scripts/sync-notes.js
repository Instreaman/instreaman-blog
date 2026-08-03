import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.js";
import { noteSources } from "./notes-sync.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, "..");
const allowedExtensions = new Set([
	".md",
	".mdx",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".avif",
	".svg",
]);
const markdownExtensions = new Set([".md", ".mdx"]);

function isInside(parent, child) {
	const relative = path.relative(parent, child);
	return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertSafeSource(source) {
	if (
		!source ||
		path.isAbsolute(source) ||
		source.split(/[\\/]+/).includes("..")
	) {
		throw new Error(`无效的写作源路径：${source}`);
	}
}

function assertSafeTarget(target) {
	if (
		!target ||
		path.isAbsolute(target) ||
		target.split(/[\\/]+/).includes("..")
	) {
		throw new Error(`无效的同步目标路径：${target}`);
	}
}

function getFrontmatterField(frontmatter, field) {
	return frontmatter.match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, "m"))?.[1];
}

function unwrapYamlString(value) {
	return value?.replace(/^['"]|['"]$/g, "");
}

function parseFrontmatter(content, filePath, mapping) {
	if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
		throw new Error(`${filePath}：缺少 YAML Frontmatter`);
	}

	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match) {
		throw new Error(`${filePath}：Frontmatter 没有正确结束`);
	}

	const frontmatter = match[1];
	const title = getFrontmatterField(frontmatter, "title");
	const published = getFrontmatterField(frontmatter, "published");

	if (!title || title === '""' || title === "''") {
		throw new Error(`${filePath}：缺少必填字段 title`);
	}
	if (!published) {
		throw new Error(`${filePath}：缺少必填字段 published`);
	}

	const dateText = published.replace(/^['"]|['"]$/g, "");
	if (Number.isNaN(new Date(dateText).getTime())) {
		throw new Error(`${filePath}：published 不是有效日期`);
	}

	for (const field of [
		"description",
		"tags",
		"category",
		"lang",
		"draft",
		"permalink",
	]) {
		if (!getFrontmatterField(frontmatter, field)) {
			throw new Error(`${filePath}：缺少统一发布字段 ${field}`);
		}
	}

	const draft = unwrapYamlString(getFrontmatterField(frontmatter, "draft"));
	if (draft !== "true" && draft !== "false") {
		throw new Error(`${filePath}：draft 必须是 true 或 false`);
	}

	const category = unwrapYamlString(
		getFrontmatterField(frontmatter, "category"),
	);
	if (mapping.category && category !== mapping.category) {
		throw new Error(
			`${filePath}：category 应为 ${mapping.category}，当前为 ${category}`,
		);
	}

	const permalink = unwrapYamlString(
		getFrontmatterField(frontmatter, "permalink"),
	);
	if (
		mapping.permalinkPrefix &&
		!permalink.startsWith(`${mapping.permalinkPrefix}/`)
	) {
		throw new Error(
			`${filePath}：permalink 必须以 ${mapping.permalinkPrefix}/ 开头`,
		);
	}

	return { permalink };
}

function normalizeImageReference(reference) {
	let value = reference.trim();
	if (value.startsWith("<") && value.endsWith(">")) {
		value = value.slice(1, -1);
	}
	value = value.split(/\s+["']/)[0];
	value = value.split("#")[0].split("?")[0];
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function validateImageReferences(content, filePath, sourcePath) {
	const obsidianEmbeds = [...content.matchAll(/!\[\[([^\]]+)\]\]/g)];
	if (obsidianEmbeds.length > 0) {
		throw new Error(
			`${filePath}：包含 Obsidian 图片语法 ![[${obsidianEmbeds[0][1]}]]，请改为标准 Markdown 相对路径`,
		);
	}

	const references = [
		...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g),
		...content.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi),
	].map((match) => normalizeImageReference(match[1]));

	for (const reference of references) {
		if (
			!reference ||
			reference.startsWith("/") ||
			/^(?:https?:|data:)/i.test(reference)
		) {
			continue;
		}

		const imagePath = path.resolve(path.dirname(filePath), reference);
		if (!isInside(sourcePath, imagePath)) {
			throw new Error(`${filePath}：本地图片不能位于写作源目录之外：${reference}`);
		}
		if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
			throw new Error(`${filePath}：找不到本地图片 ${reference}`);
		}
	}
}

function collectFiles(directory) {
	const files = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		if (entry.name.startsWith(".")) continue;

		const entryPath = path.join(directory, entry.name);
		if (entry.isSymbolicLink()) continue;
		if (entry.isDirectory()) {
			files.push(...collectFiles(entryPath));
			continue;
		}
		if (entry.isFile() && allowedExtensions.has(path.extname(entry.name).toLowerCase())) {
			files.push(entryPath);
		}
	}
	return files;
}

function validateSource(sourcePath, mapping) {
	if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isDirectory()) {
		throw new Error(`写作源目录不存在：${sourcePath}`);
	}

	const files = collectFiles(sourcePath);
	const permalinks = [];
	for (const filePath of files) {
		if (!markdownExtensions.has(path.extname(filePath).toLowerCase())) continue;
		const content = fs.readFileSync(filePath, "utf8");
		const frontmatter = parseFrontmatter(content, filePath, mapping);
		validateImageReferences(content, filePath, sourcePath);
		permalinks.push({ filePath, permalink: frontmatter.permalink });
	}
	return { files, permalinks };
}

function copyFiles(files, sourcePath, targetPath) {
	for (const filePath of files) {
		const relativePath = path.relative(sourcePath, filePath);
		const destination = path.join(targetPath, relativePath);
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.copyFileSync(filePath, destination);
	}
}

export function syncNotes({
	notesRoot,
	projectRoot = defaultProjectRoot,
	sources = noteSources,
	logger = console,
}) {
	const resolvedNotesRoot = path.resolve(notesRoot);
	const postsRoot = path.resolve(projectRoot, "src/content/posts/notes");
	const stageRoot = path.resolve(
		projectRoot,
		"src/content/posts",
		`.notes-sync-stage-${process.pid}-${Date.now()}`,
	);

	if (!fs.existsSync(resolvedNotesRoot) || !fs.statSync(resolvedNotesRoot).isDirectory()) {
		throw new Error(`笔记根目录不存在：${resolvedNotesRoot}`);
	}

	const preparedSources = sources.map((mapping) => {
		assertSafeSource(mapping.source);
		assertSafeTarget(mapping.target);
		const sourcePath = path.resolve(resolvedNotesRoot, mapping.source);
		const targetPath = path.resolve(postsRoot, mapping.target);
		if (!isInside(resolvedNotesRoot, sourcePath) || !isInside(postsRoot, targetPath)) {
			throw new Error(`同步映射超出允许范围：${mapping.source} -> ${mapping.target}`);
		}
		const validation = validateSource(sourcePath, mapping);
		return {
			...mapping,
			sourcePath,
			targetPath,
			files: validation.files,
			permalinks: validation.permalinks,
		};
	});

	const permalinkOwners = new Map();
	for (const source of preparedSources) {
		for (const item of source.permalinks) {
			const previousOwner = permalinkOwners.get(item.permalink);
			if (previousOwner) {
				throw new Error(
					`固定链接重复：${item.permalink}\n- ${previousOwner}\n- ${item.filePath}`,
				);
			}
			permalinkOwners.set(item.permalink, item.filePath);
		}
	}

	try {
		for (const source of preparedSources) {
			const stageTarget = path.join(stageRoot, source.target);
			fs.mkdirSync(stageTarget, { recursive: true });
			copyFiles(source.files, source.sourcePath, stageTarget);
		}

		fs.mkdirSync(postsRoot, { recursive: true });
		for (const source of preparedSources) {
			const stageTarget = path.join(stageRoot, source.target);
			fs.rmSync(source.targetPath, { recursive: true, force: true });
			fs.renameSync(stageTarget, source.targetPath);
			logger.log(
				`已同步 ${source.source} -> src/content/posts/notes/${source.target}（${source.files.length} 个文件）`,
			);
		}
	} finally {
		fs.rmSync(stageRoot, { recursive: true, force: true });
	}

	return preparedSources.map((source) => ({
		source: source.source,
		target: source.target,
		fileCount: source.files.length,
	}));
}

async function main() {
	loadEnv();
	const notesRoot =
		process.env.NOTES_ROOT || path.join(os.homedir(), "Documents", "notebooks");
	loggerHeader(notesRoot);
	const result = syncNotes({ notesRoot });
	const total = result.reduce((sum, item) => sum + item.fileCount, 0);
	console.log(`同步完成，共复制 ${total} 个文件。`);
}

function loggerHeader(notesRoot) {
	console.log(`笔记根目录：${notesRoot}`);
	console.log("开始同步已注册的写作源...\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((error) => {
		console.error(`同步失败：${error.message}`);
		process.exitCode = 1;
	});
}
