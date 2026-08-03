import assert from "node:assert/strict";
import test from "node:test";

import { getFontConfigs } from "../scripts/compress-fonts/config-parser.js";

test("font compressor reads space-indented site config", () => {
	assert.deepEqual(getFontConfigs(), [
		{
			type: "asciiFont",
			files: ["ZenMaruGothic-Medium.ttf"],
			enableCompress: true,
		},
		{
			type: "cjkFont",
			files: ["loli.ttf"],
			enableCompress: true,
		},
	]);
});
