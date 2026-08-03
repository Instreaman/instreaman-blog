import fs from "node:fs";
import path from "node:path";
import { ROOT_DIR } from "./utils.js";

/**
 * 一次性读取 siteConfig.ts，缓存原始内容
 * 所有配置解析共享同一次文件读取
 */
let _cachedContent = null;

function readSiteConfig() {
	if (_cachedContent) return _cachedContent;
	const configPath = path.join(ROOT_DIR, "src/config/siteConfig.ts");
	_cachedContent = fs.readFileSync(configPath, "utf-8");
	return _cachedContent;
}

/**
 * 按属性名提取对象内容，不依赖 Biome 使用 tab 还是 space 缩进。
 * 简单正则会在第一个嵌套对象的 `},` 处提前结束。
 */
function extractObjectBody(content, propertyName) {
	const propertyMatch = new RegExp(`${propertyName}:\\s*\\{`).exec(content);
	if (!propertyMatch) return null;

	const openingBrace = content.indexOf("{", propertyMatch.index);
	let depth = 0;
	let quote = null;
	let escaped = false;
	let lineComment = false;
	let blockComment = false;

	for (let i = openingBrace; i < content.length; i++) {
		const char = content[i];
		const next = content[i + 1];

		if (lineComment) {
			if (char === "\n") lineComment = false;
			continue;
		}
		if (blockComment) {
			if (char === "*" && next === "/") {
				blockComment = false;
				i++;
			}
			continue;
		}
		if (quote) {
			if (escaped) {
				escaped = false;
			} else if (char === "\\") {
				escaped = true;
			} else if (char === quote) {
				quote = null;
			}
			continue;
		}
		if (char === "/" && next === "/") {
			lineComment = true;
			i++;
			continue;
		}
		if (char === "/" && next === "*") {
			blockComment = true;
			i++;
			continue;
		}
		if (char === '"' || char === "'" || char === "`") {
			quote = char;
			continue;
		}
		if (char === "{") depth++;
		if (char === "}" && --depth === 0) {
			return content.slice(openingBrace + 1, i);
		}
	}

	return null;
}

/**
 * 提取语言设置
 */
export function getLang() {
	const content = readSiteConfig();
	const match = content.match(/const SITE_LANG = ["'](.+?)["']/);
	return match ? match[1] : "zh_CN";
}

/**
 * 提取字体配置（只返回 enableCompress=true 且有 localFonts 的字体）
 */
export function getFontConfigs() {
	const content = readSiteConfig();

	const fontConfigStr = extractObjectBody(content, "font");
	if (!fontConfigStr) {
		console.log("⚠ Font config not found, using default settings");
		return [];
	}

	const fonts = [];
	const fontTypes = ["asciiFont", "cjkFont"];

	for (const fontType of fontTypes) {
		const regex = new RegExp(`${fontType}:\\s*\\{([\\s\\S]*?)\\}`, "m");
		const match = fontConfigStr.match(regex);
		if (!match) continue;

		const config = match[1];

		const compressMatch = config.match(/enableCompress:\s*(true|false)/);
		const enableCompress = compressMatch ? compressMatch[1] === "true" : false;

		const localFontsMatch = config.match(/localFonts:\s*\[(.*?)\]/s);
		let localFonts = [];
		if (localFontsMatch?.[1].trim()) {
			localFonts =
				localFontsMatch[1]
					.match(/["']([^"']+)["']/g)
					?.map((s) => s.replace(/["']/g, "")) || [];
		}

		if (enableCompress && localFonts.length > 0) {
			fonts.push({ type: fontType, files: localFonts, enableCompress });
		}
	}

	return fonts;
}

/**
 * 检查番剧页面是否启用
 */
export function isAnimePageEnabled() {
	const content = readSiteConfig();
	const match = content.match(/featurePages:\s*\{([\s\S]*?)\}/);
	if (!match) return false;
	const animeMatch = match[1].match(/anime:\s*(true|false)/);
	return animeMatch ? animeMatch[1] === "true" : false;
}

/**
 * 获取番剧模式
 */
export function getAnimeMode() {
	const content = readSiteConfig();
	const match = content.match(/anime:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/);
	return match ? match[1] : "bangumi";
}

/**
 * 获取 Bangumi 用户 ID
 */
export function getBangumiUserId() {
	const content = readSiteConfig();
	const match = content.match(
		/bangumi:\s*\{[\s\S]*?userId:\s*["']([^"']+)["']/,
	);
	return match ? match[1] : null;
}

/**
 * 获取音乐播放器配置（从 musicConfig.ts 读取）
 */
export function getMusicConfig() {
	const configPath = path.join(ROOT_DIR, "src/config/musicConfig.ts");
	if (!fs.existsSync(configPath)) return null;
	const content = fs.readFileSync(configPath, "utf-8");

	const enableMatch = content.match(
		/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{[\s\S]*?enable:\s*(true|false)/,
	);
	if (!enableMatch || enableMatch[1] === "false") {
		return null;
	}

	const configMatch = content.match(
		/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{([\s\S]*?)\};/,
	);
	if (!configMatch) return null;

	const configStr = configMatch[1];
	const extract = (field) => {
		const m = configStr.match(new RegExp(`${field}:\\s*["']([^"']+)["']`));
		return m ? m[1] : null;
	};

	return {
		mode: extract("mode") || "meting",
		meting_api:
			extract("meting_api") ||
			"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",
		id: extract("id") || "14164869977",
		server: extract("server") || "netease",
		type: extract("type") || "playlist",
	};
}

/**
 * 获取合并配置（一次读取，返回所有需要的信息）
 */
export function getConfig() {
	return {
		lang: getLang(),
		fonts: getFontConfigs(),
		animeEnabled: isAnimePageEnabled(),
		animeMode: getAnimeMode(),
		bangumiUserId: getBangumiUserId(),
		musicConfig: getMusicConfig(),
	};
}
