import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	discoverModels,
	mapPiThinkingToReasoningEffort,
	getDroidModelMetadata,
	__testUtils,
} from "../src/model-discovery.js";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

vi.mock("@factory/droid-sdk", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@factory/droid-sdk")>();
	return {
		...actual,
		createSession: vi.fn(),
	};
});

import { createSession } from "@factory/droid-sdk";
import { ReasoningEffort } from "@factory/droid-sdk";
import { FALLBACK_MODEL_ITEMS } from "../src/droid-fallback-models.generated.js";

const mockedCreateSession = vi.mocked(createSession);

const expectedFallbackModelIds = [
	"claude-opus-4-8",
	"claude-opus-4-8-fast",
	"claude-opus-4-7",
	"claude-opus-4-7-fast",
	"claude-opus-4-6",
	"claude-opus-4-6-fast",
	"claude-opus-4-5-20251101",
	"claude-opus-4-1-20250805",
	"claude-sonnet-4-6",
	"claude-sonnet-4-5-20250929",
	"claude-sonnet-4-20250514",
	"claude-3-7-sonnet-20250219",
	"claude-haiku-4-5-20251001",
	"claude-3-5-haiku-20241022",
	"claude-3-5-sonnet-20241022",
	"aspen-05-15",
	"almond-05-27",
	"gpt-5.5",
	"gpt-5.5-fast",
	"gpt-5.5-pro",
	"gpt-5.4",
	"gpt-5.4-fast",
	"gpt-5.4-mini",
	"gpt-5.3-codex",
	"gpt-5.3-codex-fast",
	"gpt-5.2",
	"gpt-5.2-codex",
	"gpt-5.1-codex-max",
	"gpt-5.1-codex",
	"gpt-5.1",
	"gpt-5-codex",
	"gpt-5-2025-08-07",
	"gpt-5-mini-2025-08-07",
	"gpt-5-nano-2025-08-07",
	"olm-03-05",
	"orbit-04-09",
	"olive-05-22",
	"oriel-06-01",
	"oxide-06-01",
	"oxbow-06-01",
	"ocelot-06-01",
	"gemini-3.5-flash",
	"gemini-3.1-pro-preview",
	"gemini-3-pro-preview",
	"gemini-3-flash-preview",
	"gemini-2.5-pro",
	"gemini-2.5-flash",
	"gantry-05-07",
	"titan-02-12",
	"glm-5.1",
	"glm-5",
	"glm-4.7",
	"glm-4.6",
	"kimi-k2.7-code",
	"kimi-k2.6",
	"kimi-k2.5",
	"nemotron-3-ultra",
	"deepseek-v4-pro",
	"minimax-m3",
	"minimax-m2.7",
	"minimax-m2.5",
	"factory-router",
];

function writeStoredFactoryApiKey(apiKey: string): void {
	writeFileSync(
		join(process.env.PI_CODING_AGENT_DIR!, "auth.json"),
		JSON.stringify({ factory: { type: "api_key", key: apiKey } }, null, 2),
	);
}

describe("discoverModels", () => {
	const originalEnv = process.env;
	let tmpAgentDir: string;

	beforeEach(() => {
		process.env = { ...originalEnv };
		delete process.env.FACTORY_API_KEY;
		tmpAgentDir = mkdtempSync(join(tmpdir(), "pi-droid-discovery-"));
		process.env.PI_CODING_AGENT_DIR = tmpAgentDir;
		process.argv = ["node", "vitest"];
		__testUtils.clearMetadata();
	});

	afterEach(() => {
		rmSync(tmpAgentDir, { recursive: true, force: true });
		process.env = originalEnv;
		vi.clearAllMocks();
	});

	it("returns fallback models when no API key", async () => {
		const models = await discoverModels();
		const ids = new Set(models.map((model) => model.id));
		const fallbackIds = FALLBACK_MODEL_ITEMS.map((model) => model.id);

		expect(new Set(fallbackIds).size).toBe(fallbackIds.length);
		expect(expectedFallbackModelIds.filter((id) => !ids.has(id))).toEqual([]);
		expect(mockedCreateSession).not.toHaveBeenCalled();
	});

	it("discovers live models when API key is available", async () => {
		writeStoredFactoryApiKey("factory-test-key");
		mockedCreateSession.mockResolvedValue({
			initResult: {
				availableModels: [
					{
						id: "kimi-k2.5",
						displayName: "Droid Core (Kimi K2.5)",
						shortDisplayName: "Kimi K2.5",
						modelProvider: "factory",
						supportedReasoningEfforts: [ReasoningEffort.Off, ReasoningEffort.High],
						defaultReasoningEffort: ReasoningEffort.High,
						isCustom: false,
					},
				],
			},
			close: vi.fn(),
		} as never);

		const models = await discoverModels();
		expect(models).toEqual([
			expect.objectContaining({ id: "kimi-k2.5", name: "Droid Core (Kimi K2.5)" }),
		]);
		expect(mockedCreateSession).toHaveBeenCalledWith(expect.objectContaining({
			apiKey: "factory-test-key",
			modelId: "claude-opus-4-8",
			env: expect.objectContaining({ FACTORY_API_KEY: "factory-test-key" }),
		}));
	});
});

describe("mapPiThinkingToReasoningEffort", () => {
	beforeEach(async () => {
		await discoverModels();
	});

	it("maps off to ReasoningEffort.Off for core models", () => {
		expect(mapPiThinkingToReasoningEffort("kimi-k2.5", "off")).toBe(ReasoningEffort.Off);
	});

	it("maps high to ReasoningEffort.High for core models", () => {
		expect(mapPiThinkingToReasoningEffort("kimi-k2.5", "high")).toBe(ReasoningEffort.High);
	});

	it("returns metadata for discovered models", () => {
		expect(getDroidModelMetadata("kimi-k2.5")?.displayName).toContain("Kimi");
	});
});
