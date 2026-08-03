import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { syncNotes } from "../scripts/sync-notes.js";

const temporaryDirectories = [];

function createWorkspace() {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "mizuki-sync-notes-"));
	temporaryDirectories.push(root);
	const notesRoot = path.join(root, "notebooks");
	const projectRoot = path.join(root, "project");
	fs.mkdirSync(notesRoot, { recursive: true });
	fs.mkdirSync(projectRoot, { recursive: true });
	return { notesRoot, projectRoot };
}

function writeFile(filePath, content) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, content);
}

const validPost = `---
title: "测试文章"
published: 2026-08-03
description: "测试描述"
tags: ["测试"]
category: "测试"
lang: "zh_CN"
draft: false
permalink: "test/example"
---

正文
`;

afterEach(() => {
	for (const directory of temporaryDirectories.splice(0)) {
		fs.rmSync(directory, { recursive: true, force: true });
	}
});

describe("syncNotes", () => {
	it("mirrors Markdown files and their local images", () => {
		const { notesRoot, projectRoot } = createWorkspace();
		const source = path.join(notesRoot, "编程", "example");
		writeFile(
			path.join(source, "index.md"),
			validPost.replace("正文", "![示例](./assets/example.png)"),
		);
		writeFile(path.join(source, "assets", "example.png"), "image");

		syncNotes({
			notesRoot,
			projectRoot,
			sources: [{ source: "编程", target: "programming" }],
			logger: { log() {} },
		});

		const target = path.join(
			projectRoot,
			"src/content/posts/notes/programming/example",
		);
		assert.equal(fs.readFileSync(path.join(target, "index.md"), "utf8").includes("测试文章"), true);
		assert.equal(fs.readFileSync(path.join(target, "assets/example.png"), "utf8"), "image");
	});

	it("removes files deleted from a registered source", () => {
		const { notesRoot, projectRoot } = createWorkspace();
		const sourceFile = path.join(notesRoot, "数学", "note.md");
		writeFile(sourceFile, validPost);
		const options = {
			notesRoot,
			projectRoot,
			sources: [{ source: "数学", target: "math" }],
			logger: { log() {} },
		};
		syncNotes(options);
		fs.rmSync(sourceFile);
		syncNotes(options);

		assert.equal(
			fs.existsSync(path.join(projectRoot, "src/content/posts/notes/math/note.md")),
			false,
		);
	});

	it("keeps the previous mirror when validation fails", () => {
		const { notesRoot, projectRoot } = createWorkspace();
		const sourceFile = path.join(notesRoot, "Arch折腾笔记", "note.md");
		writeFile(sourceFile, validPost);
		const options = {
			notesRoot,
			projectRoot,
			sources: [{ source: "Arch折腾笔记", target: "arch" }],
			logger: { log() {} },
		};
		syncNotes(options);
		writeFile(sourceFile, "没有 Frontmatter");

		assert.throws(() => syncNotes(options), /缺少 YAML Frontmatter/);
		assert.equal(
			fs.readFileSync(
				path.join(projectRoot, "src/content/posts/notes/arch/note.md"),
				"utf8",
			),
			validPost,
		);
	});

	it("rejects missing images and Obsidian embeds", () => {
		const { notesRoot, projectRoot } = createWorkspace();
		const sourceFile = path.join(notesRoot, "编程", "note.md");
		writeFile(sourceFile, validPost.replace("正文", "![缺失](./missing.png)"));
		const options = {
			notesRoot,
			projectRoot,
			sources: [{ source: "编程", target: "programming" }],
			logger: { log() {} },
		};

		assert.throws(() => syncNotes(options), /找不到本地图片/);
		writeFile(sourceFile, validPost.replace("正文", "![[image.png]]"));
		assert.throws(() => syncNotes(options), /Obsidian 图片语法/);
	});

	it("validates configured categories, permalink prefixes and duplicates", () => {
		const { notesRoot, projectRoot } = createWorkspace();
		writeFile(path.join(notesRoot, "编程", "first.md"), validPost);
		const mapping = {
			source: "编程",
			target: "programming",
			category: "编程",
			permalinkPrefix: "programming",
		};

		assert.throws(
			() =>
				syncNotes({
					notesRoot,
					projectRoot,
					sources: [mapping],
					logger: { log() {} },
				}),
			/category 应为 编程/,
		);

		const programmingPost = validPost
			.replace('category: "测试"', 'category: "编程"')
			.replace('permalink: "test/example"', 'permalink: "programming/example"');
		writeFile(path.join(notesRoot, "编程", "first.md"), programmingPost);
		writeFile(path.join(notesRoot, "编程", "second.md"), programmingPost);

		assert.throws(
			() =>
				syncNotes({
					notesRoot,
					projectRoot,
					sources: [mapping],
					logger: { log() {} },
				}),
			/固定链接重复/,
		);
	});
});
