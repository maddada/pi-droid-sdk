import { describe, it, expect } from "vitest";
import { __testUtils } from "../src/droid-pi-tool-bridge.js";
import { buildDroidPrompt } from "../src/context.js";
import type { Context } from "@earendil-works/pi-ai";

describe("droid-pi-tool-bridge", () => {
	it("is enabled by default", () => {
		expect(__testUtils.resolveDroidPiToolBridgeEnabled({})).toBe(true);
	});

	it("prefixes bridged tool names", () => {
		expect(__testUtils.toMcpToolName("grep")).toBe("pi__grep");
	});
});

describe("buildDroidPrompt", () => {
	it("includes bridge contract and transcript", () => {
		const context: Context = {
			systemPrompt: "You are helpful.",
			messages: [{ role: "user", content: "hello", timestamp: Date.now() }],
		};
		const prompt = buildDroidPrompt(context);
		expect(prompt.text).toContain("Droid pi bridge contract");
		expect(prompt.text).toContain("User: hello");
	});
});
