import { ReasoningEffort } from "@factory/droid-sdk";
import type { ThinkingLevelMap } from "@earendil-works/pi-ai";

export interface DroidFallbackModelItem {
	id: string;
	displayName: string;
	supportsReasoning: boolean;
	supportedReasoningEfforts: ReasoningEffort[];
	defaultReasoningEffort: ReasoningEffort;
	thinkingLevelMap?: ThinkingLevelMap;
	noImageSupport?: boolean;
	isCustom?: boolean;
	tokenMultiplier?: number;
}

const claudeReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [
		ReasoningEffort.Off,
		ReasoningEffort.Low,
		ReasoningEffort.Medium,
		ReasoningEffort.High,
		ReasoningEffort.ExtraHigh,
		ReasoningEffort.Max,
	],
	defaultReasoningEffort: ReasoningEffort.High,
	thinkingLevelMap: {
		off: ReasoningEffort.Off,
		minimal: null,
		low: ReasoningEffort.Low,
		medium: ReasoningEffort.Medium,
		high: ReasoningEffort.High,
		xhigh: ReasoningEffort.Max,
	} satisfies ThinkingLevelMap,
};

const claudeStandardReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [
		ReasoningEffort.Off,
		ReasoningEffort.Low,
		ReasoningEffort.Medium,
		ReasoningEffort.High,
	],
	defaultReasoningEffort: ReasoningEffort.High,
	thinkingLevelMap: {
		off: ReasoningEffort.Off,
		minimal: null,
		low: ReasoningEffort.Low,
		medium: ReasoningEffort.Medium,
		high: ReasoningEffort.High,
		xhigh: null,
	} satisfies ThinkingLevelMap,
};

const gptReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [
		ReasoningEffort.Low,
		ReasoningEffort.Medium,
		ReasoningEffort.High,
		ReasoningEffort.ExtraHigh,
	],
	defaultReasoningEffort: ReasoningEffort.Medium,
	thinkingLevelMap: {
		off: null,
		minimal: null,
		low: ReasoningEffort.Low,
		medium: ReasoningEffort.Medium,
		high: ReasoningEffort.High,
		xhigh: ReasoningEffort.ExtraHigh,
	} satisfies ThinkingLevelMap,
};

const gptWithOffReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [
		ReasoningEffort.Off,
		ReasoningEffort.Low,
		ReasoningEffort.Medium,
		ReasoningEffort.High,
		ReasoningEffort.ExtraHigh,
	],
	defaultReasoningEffort: ReasoningEffort.Low,
	thinkingLevelMap: {
		off: ReasoningEffort.Off,
		minimal: null,
		low: ReasoningEffort.Low,
		medium: ReasoningEffort.Medium,
		high: ReasoningEffort.High,
		xhigh: ReasoningEffort.ExtraHigh,
	} satisfies ThinkingLevelMap,
};

const geminiProReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [ReasoningEffort.Low, ReasoningEffort.Medium, ReasoningEffort.High],
	defaultReasoningEffort: ReasoningEffort.High,
	thinkingLevelMap: {
		off: null,
		minimal: null,
		low: ReasoningEffort.Low,
		medium: ReasoningEffort.Medium,
		high: ReasoningEffort.High,
		xhigh: null,
	} satisfies ThinkingLevelMap,
};

const geminiFlashReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [
		ReasoningEffort.Minimal,
		ReasoningEffort.Low,
		ReasoningEffort.Medium,
		ReasoningEffort.High,
	],
	defaultReasoningEffort: ReasoningEffort.High,
	thinkingLevelMap: {
		off: null,
		minimal: ReasoningEffort.Minimal,
		low: ReasoningEffort.Low,
		medium: ReasoningEffort.Medium,
		high: ReasoningEffort.High,
		xhigh: null,
	} satisfies ThinkingLevelMap,
};

const coreReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [ReasoningEffort.Off, ReasoningEffort.High],
	defaultReasoningEffort: ReasoningEffort.High,
	thinkingLevelMap: {
		off: ReasoningEffort.Off,
		minimal: null,
		low: null,
		medium: null,
		high: ReasoningEffort.High,
		xhigh: null,
	} satisfies ThinkingLevelMap,
};

const deepseekReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [
		ReasoningEffort.Off,
		ReasoningEffort.Low,
		ReasoningEffort.High,
		ReasoningEffort.Max,
	],
	defaultReasoningEffort: ReasoningEffort.High,
	thinkingLevelMap: {
		off: ReasoningEffort.Off,
		minimal: null,
		low: ReasoningEffort.Low,
		medium: null,
		high: ReasoningEffort.High,
		xhigh: ReasoningEffort.Max,
	} satisfies ThinkingLevelMap,
};

const highOnlyReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [ReasoningEffort.High],
	defaultReasoningEffort: ReasoningEffort.High,
	thinkingLevelMap: {
		off: null,
		minimal: null,
		low: null,
		medium: null,
		high: ReasoningEffort.High,
		xhigh: null,
	} satisfies ThinkingLevelMap,
};

const noReasoning = {
	supportsReasoning: false,
	supportedReasoningEfforts: [ReasoningEffort.Off],
	defaultReasoningEffort: ReasoningEffort.Off,
};

const routerReasoning = {
	supportsReasoning: true,
	supportedReasoningEfforts: [ReasoningEffort.Dynamic],
	defaultReasoningEffort: ReasoningEffort.Dynamic,
	thinkingLevelMap: {
		off: ReasoningEffort.Dynamic,
		minimal: null,
		low: null,
		medium: null,
		high: null,
		xhigh: null,
	} satisfies ThinkingLevelMap,
};

// Generated/maintained fallback Factory catalog snapshot.
// Refresh with: npm run refresh:droid-snapshots -- --write
export const FALLBACK_MODEL_ITEMS: DroidFallbackModelItem[] = [
	{ id: "claude-opus-4-8", displayName: "Claude Opus 4.8", ...claudeReasoning, tokenMultiplier: 2 },
	{ id: "claude-opus-4-8-fast", displayName: "Claude Opus 4.8 Fast", ...claudeReasoning, tokenMultiplier: 12 },
	{ id: "claude-opus-4-7", displayName: "Claude Opus 4.7", ...claudeReasoning, tokenMultiplier: 2 },
	{ id: "claude-opus-4-7-fast", displayName: "Claude Opus 4.7 Fast", ...claudeReasoning, tokenMultiplier: 12 },
	{ id: "claude-opus-4-6", displayName: "Claude Opus 4.6", ...claudeReasoning, tokenMultiplier: 2 },
	{ id: "claude-opus-4-6-fast", displayName: "Claude Opus 4.6 Fast", ...claudeReasoning, tokenMultiplier: 12 },
	{ id: "claude-opus-4-5-20251101", displayName: "Claude Opus 4.5", ...claudeStandardReasoning, defaultReasoningEffort: ReasoningEffort.Off, tokenMultiplier: 2 },
	{ id: "claude-opus-4-1-20250805", displayName: "Claude Opus 4.1", ...claudeReasoning, tokenMultiplier: 2 },
	{ id: "claude-sonnet-4-6", displayName: "Claude Sonnet 4.6", ...claudeReasoning, tokenMultiplier: 1.2 },
	{ id: "claude-sonnet-4-5-20250929", displayName: "Claude Sonnet 4.5", ...claudeStandardReasoning, defaultReasoningEffort: ReasoningEffort.Off, tokenMultiplier: 1.2 },
	{ id: "claude-sonnet-4-20250514", displayName: "Claude Sonnet 4", ...claudeReasoning, tokenMultiplier: 1 },
	{ id: "claude-3-7-sonnet-20250219", displayName: "Claude Sonnet 3.7", ...claudeStandardReasoning, tokenMultiplier: 0.8 },
	{ id: "claude-haiku-4-5-20251001", displayName: "Claude Haiku 4.5", ...claudeStandardReasoning, defaultReasoningEffort: ReasoningEffort.Off, tokenMultiplier: 0.4 },
	{ id: "claude-3-5-haiku-20241022", displayName: "Claude Haiku 3.5", ...noReasoning, tokenMultiplier: 0.25 },
	{ id: "claude-3-5-sonnet-20241022", displayName: "Claude Sonnet 3.5", ...noReasoning, tokenMultiplier: 0.8 },
	{ id: "aspen-05-15", displayName: "Aspen 05-15", ...claudeStandardReasoning },
	{ id: "almond-05-27", displayName: "Almond 05-27", ...claudeStandardReasoning },
	{ id: "gpt-5.5", displayName: "GPT-5.5", ...gptReasoning, tokenMultiplier: 2 },
	{ id: "gpt-5.5-fast", displayName: "GPT-5.5 Fast", ...gptReasoning, tokenMultiplier: 5 },
	{ id: "gpt-5.5-pro", displayName: "GPT-5.5 Pro", ...gptReasoning, tokenMultiplier: 12 },
	{ id: "gpt-5.4", displayName: "GPT-5.4", ...gptReasoning, tokenMultiplier: 1 },
	{ id: "gpt-5.4-fast", displayName: "GPT-5.4 Fast", ...gptReasoning, tokenMultiplier: 2 },
	{ id: "gpt-5.4-mini", displayName: "GPT-5.4 Mini", ...gptReasoning, defaultReasoningEffort: ReasoningEffort.High, tokenMultiplier: 0.3 },
	{ id: "gpt-5.3-codex", displayName: "GPT-5.3-Codex", ...gptReasoning, tokenMultiplier: 0.7 },
	{ id: "gpt-5.3-codex-fast", displayName: "GPT-5.3-Codex Fast", ...gptReasoning, tokenMultiplier: 1.4 },
	{ id: "gpt-5.2", displayName: "GPT-5.2", ...gptWithOffReasoning, tokenMultiplier: 0.7 },
	{ id: "gpt-5.2-codex", displayName: "GPT-5.2-Codex", ...gptReasoning, tokenMultiplier: 0.7 },
	{ id: "gpt-5.1-codex-max", displayName: "GPT-5.1-Codex-Max", ...gptReasoning, tokenMultiplier: 0.7 },
	{ id: "gpt-5.1-codex", displayName: "GPT-5.1-Codex", ...gptReasoning, tokenMultiplier: 0.7 },
	{ id: "gpt-5.1", displayName: "GPT-5.1", ...gptReasoning, tokenMultiplier: 0.7 },
	{ id: "gpt-5-codex", displayName: "GPT-5-Codex", ...gptReasoning, tokenMultiplier: 0.7 },
	{ id: "gpt-5-2025-08-07", displayName: "GPT-5", ...gptReasoning, tokenMultiplier: 1 },
	{ id: "gpt-5-mini-2025-08-07", displayName: "GPT-5 Mini", ...gptReasoning, tokenMultiplier: 0.3 },
	{ id: "gpt-5-nano-2025-08-07", displayName: "GPT-5 Nano", ...gptReasoning, tokenMultiplier: 0.1 },
	{ id: "olm-03-05", displayName: "OLM 03-05", ...gptReasoning },
	{ id: "orbit-04-09", displayName: "Orbit 04-09", ...gptReasoning },
	{ id: "olive-05-22", displayName: "Olive 05-22", ...gptReasoning },
	{ id: "oriel-06-01", displayName: "Oriel 06-01", ...gptReasoning },
	{ id: "oxide-06-01", displayName: "Oxide 06-01", ...gptReasoning },
	{ id: "oxbow-06-01", displayName: "Oxbow 06-01", ...gptReasoning },
	{ id: "ocelot-06-01", displayName: "Ocelot 06-01", ...gptReasoning },
	{ id: "gemini-3.5-flash", displayName: "Gemini 3.5 Flash", ...geminiFlashReasoning, tokenMultiplier: 0.2 },
	{ id: "gemini-3.1-pro-preview", displayName: "Gemini 3.1 Pro", ...geminiProReasoning, tokenMultiplier: 0.8 },
	{ id: "gemini-3-pro-preview", displayName: "Gemini 3 Pro", ...geminiProReasoning, tokenMultiplier: 0.8 },
	{ id: "gemini-3-flash-preview", displayName: "Gemini 3 Flash", ...geminiFlashReasoning, tokenMultiplier: 0.2 },
	{ id: "gemini-2.5-pro", displayName: "Gemini 2.5 Pro", ...geminiProReasoning, tokenMultiplier: 0.6 },
	{ id: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash", ...geminiFlashReasoning, tokenMultiplier: 0.15 },
	{ id: "gantry-05-07", displayName: "Gantry 05-07", ...geminiProReasoning },
	{ id: "titan-02-12", displayName: "Titan 02-12", ...noReasoning },
	{ id: "glm-5.1", displayName: "Droid Core (GLM-5.1)", ...coreReasoning, tokenMultiplier: 0.55 },
	{ id: "glm-5", displayName: "Droid Core (GLM-5)", ...coreReasoning, tokenMultiplier: 0.5 },
	{ id: "glm-4.7", displayName: "Droid Core (GLM-4.7)", ...coreReasoning, tokenMultiplier: 0.45 },
	{ id: "glm-4.6", displayName: "Droid Core (GLM-4.6)", ...coreReasoning, tokenMultiplier: 0.4 },
	{ id: "kimi-k2.7-code", displayName: "Droid Core (Kimi K2.7 Code)", ...coreReasoning, tokenMultiplier: 0.45 },
	{ id: "kimi-k2.6", displayName: "Droid Core (Kimi K2.6)", ...coreReasoning, tokenMultiplier: 0.4 },
	{ id: "kimi-k2.5", displayName: "Droid Core (Kimi K2.5)", ...coreReasoning, tokenMultiplier: 0.25 },
	{ id: "nemotron-3-ultra", displayName: "Droid Core (Nemotron 3 Ultra)", ...coreReasoning, tokenMultiplier: 0.45 },
	{ id: "deepseek-v4-pro", displayName: "Droid Core (DeepSeek V4 Pro)", ...deepseekReasoning, tokenMultiplier: 0.55 },
	{ id: "minimax-m3", displayName: "Droid Core (MiniMax M3)", ...highOnlyReasoning, tokenMultiplier: 0.15 },
	{ id: "minimax-m2.7", displayName: "Droid Core (MiniMax M2.7)", ...highOnlyReasoning, tokenMultiplier: 0.12 },
	{ id: "minimax-m2.5", displayName: "Droid Core (MiniMax M2.5)", supportsReasoning: true, supportedReasoningEfforts: [ReasoningEffort.Low, ReasoningEffort.Medium, ReasoningEffort.High], defaultReasoningEffort: ReasoningEffort.High, thinkingLevelMap: { off: null, minimal: null, low: ReasoningEffort.Low, medium: ReasoningEffort.Medium, high: ReasoningEffort.High, xhigh: null }, tokenMultiplier: 0.12 },
	{ id: "factory-router", displayName: "Factory Router", ...routerReasoning },
];
