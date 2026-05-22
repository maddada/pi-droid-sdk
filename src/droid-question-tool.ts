import type { ExtensionAPI, ExtensionContext, ExtensionHandler, SessionStartEvent } from "@earendil-works/pi-coding-agent";
import { Text } from "@earendil-works/pi-tui";
import { Type } from "typebox";
import { resolveDroidPiToolBridgeEnabled } from "./droid-pi-tool-bridge.js";

export const DROID_ASK_QUESTION_TOOL_NAME = "droid_ask_question";

interface DroidQuestionOption {
	label: string;
	value: string;
	description?: string;
}

interface DroidQuestion {
	id: string;
	question: string;
	options: DroidQuestionOption[];
	allowCustom: boolean;
}

interface DroidQuestionAnswer {
	id: string;
	question: string;
	answer: string | null;
	value?: string;
	wasCustom: boolean;
	cancelled: boolean;
}

type RawQuestionOption = string | { label?: string; value?: string; description?: string };

type RawQuestion = {
	id?: string;
	question?: string;
	prompt?: string;
	options?: RawQuestionOption[];
	choices?: RawQuestionOption[];
	allowCustom?: boolean;
};

type DroidAskQuestionParams = RawQuestion & {
	questions?: RawQuestion[];
};

const QuestionOptionSchema = Type.Union([
	Type.String(),
	Type.Object({
		label: Type.String({ description: "User-facing option label" }),
		value: Type.Optional(Type.String({ description: "Optional value returned to Droid; defaults to label" })),
		description: Type.Optional(Type.String({ description: "Optional helper text shown by compatible pi UIs" })),
	}),
]);

const QuestionSchema = Type.Object({
	id: Type.Optional(Type.String({ description: "Stable question identifier" })),
	question: Type.Optional(Type.String({ description: "Question to ask the user" })),
	prompt: Type.Optional(Type.String({ description: "Alias for question" })),
	options: Type.Optional(Type.Array(QuestionOptionSchema, { description: "Choices the user can select" })),
	choices: Type.Optional(Type.Array(QuestionOptionSchema, { description: "Alias for options" })),
	allowCustom: Type.Optional(Type.Boolean({ description: "Allow a typed answer in addition to listed options; defaults to true" })),
});

const DroidAskQuestionParamsSchema = Type.Object({
	question: Type.Optional(Type.String({ description: "Question to ask the user" })),
	prompt: Type.Optional(Type.String({ description: "Alias for question" })),
	options: Type.Optional(Type.Array(QuestionOptionSchema, { description: "Choices the user can select" })),
	choices: Type.Optional(Type.Array(QuestionOptionSchema, { description: "Alias for options" })),
	allowCustom: Type.Optional(Type.Boolean({ description: "Allow a typed answer in addition to listed options; defaults to true" })),
	questions: Type.Optional(Type.Array(QuestionSchema, { description: "Ask multiple questions sequentially" })),
});

function isFactoryModel(model: ExtensionContext["model"]): boolean {
	return model?.provider === "factory" || model?.api === "droid-sdk";
}

function normalizeOption(option: RawQuestionOption, index: number): DroidQuestionOption | undefined {
	if (typeof option === "string") {
		const trimmed = option.trim();
		return trimmed ? { label: trimmed, value: trimmed } : undefined;
	}
	const label = option.label?.trim() || option.value?.trim() || `Option ${index + 1}`;
	return {
		label,
		value: option.value?.trim() || label,
		...(option.description?.trim() ? { description: option.description.trim() } : {}),
	};
}

function normalizeOptions(options: RawQuestionOption[] | undefined): DroidQuestionOption[] {
	return (options ?? []).map(normalizeOption).filter((option): option is DroidQuestionOption => option !== undefined);
}

function normalizeQuestion(raw: RawQuestion, index: number): DroidQuestion | undefined {
	const question = raw.question?.trim() || raw.prompt?.trim();
	if (!question) return undefined;
	return {
		id: raw.id?.trim() || `question_${index + 1}`,
		question,
		options: normalizeOptions(raw.options ?? raw.choices),
		allowCustom: raw.allowCustom !== false,
	};
}

function normalizeQuestions(params: DroidAskQuestionParams): DroidQuestion[] {
	const rawQuestions = Array.isArray(params.questions) && params.questions.length > 0 ? params.questions : [params];
	return rawQuestions.map(normalizeQuestion).filter((question): question is DroidQuestion => question !== undefined);
}

function summarizeAnswers(answers: DroidQuestionAnswer[]): string {
	if (answers.length === 0) return "No answer was collected.";
	if (answers.length === 1) {
		const [answer] = answers;
		return answer.cancelled || answer.answer === null ? "User cancelled the question." : `User answered: ${answer.answer}`;
	}
	return [
		"User answered:",
		...answers.map((answer) => {
			const value = answer.cancelled || answer.answer === null ? "cancelled" : answer.answer;
			return `- ${answer.id}: ${value}`;
		}),
	].join("\n");
}

async function askOneQuestion(question: DroidQuestion, ctx: { ui: ExtensionContext["ui"] }): Promise<DroidQuestionAnswer> {
	if (question.options.length > 0) {
		const labels = question.options.map((option) => option.description ? `${option.label} — ${option.description}` : option.label);
		const customLabel = "Type a custom answer";
		const choices = question.allowCustom ? [...labels, customLabel] : labels;
		const selected = await ctx.ui.select(question.question, choices);
		if (!selected) {
			return { id: question.id, question: question.question, answer: null, wasCustom: false, cancelled: true };
		}
		if (selected === customLabel) {
			const customAnswer = await ctx.ui.input(question.question, "Type your answer");
			const trimmed = customAnswer?.trim();
			return trimmed
				? { id: question.id, question: question.question, answer: trimmed, value: trimmed, wasCustom: true, cancelled: false }
				: { id: question.id, question: question.question, answer: null, wasCustom: true, cancelled: true };
		}
		const selectedIndex = labels.indexOf(selected);
		const selectedOption = selectedIndex >= 0 ? question.options[selectedIndex] : undefined;
		const answer = selectedOption?.label ?? selected;
		return {
			id: question.id,
			question: question.question,
			answer,
			value: selectedOption?.value ?? answer,
			wasCustom: false,
			cancelled: false,
		};
	}

	const answer = await ctx.ui.input(question.question, "Type your answer");
	const trimmed = answer?.trim();
	return trimmed
		? { id: question.id, question: question.question, answer: trimmed, value: trimmed, wasCustom: true, cancelled: false }
		: { id: question.id, question: question.question, answer: null, wasCustom: true, cancelled: true };
}

function syncDroidQuestionToolForModel(pi: Pick<ExtensionAPI, "getActiveTools" | "setActiveTools">, model: ExtensionContext["model"]): void {
	const activeToolNames = new Set(pi.getActiveTools());
	const shouldBeActive = isFactoryModel(model) && resolveDroidPiToolBridgeEnabled();
	const alreadyActive = activeToolNames.has(DROID_ASK_QUESTION_TOOL_NAME);
	if (shouldBeActive === alreadyActive) return;
	if (shouldBeActive) activeToolNames.add(DROID_ASK_QUESTION_TOOL_NAME);
	else activeToolNames.delete(DROID_ASK_QUESTION_TOOL_NAME);
	pi.setActiveTools([...activeToolNames]);
}

export function registerDroidQuestionTool(pi: Pick<ExtensionAPI, "getActiveTools" | "registerTool" | "setActiveTools"> & {
	on(event: "session_start", handler: ExtensionHandler<SessionStartEvent>): void;
	on(event: "model_select", handler: (event: { model: ExtensionContext["model"] }, ctx: ExtensionContext) => Promise<void> | void): void;
}): void {
	pi.registerTool({
		name: DROID_ASK_QUESTION_TOOL_NAME,
		label: "Droid question",
		description: "Ask the user a clarifying question from Factory Droid. Use when user preferences materially affect the next step.",
		parameters: DroidAskQuestionParamsSchema,
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			const questions = normalizeQuestions(params as DroidAskQuestionParams);
			if (questions.length === 0) {
				return {
					content: [{ type: "text" as const, text: "No valid question was provided." }],
					details: { questions: [], answers: [], uiAvailable: ctx.hasUI, cancelled: true },
					isError: true,
				};
			}
			if (!ctx.hasUI) {
				return {
					content: [{ type: "text" as const, text: "Cannot ask the user because pi UI is unavailable." }],
					details: { questions, answers: [], uiAvailable: false, cancelled: true },
					isError: true,
				};
			}

			const answers: DroidQuestionAnswer[] = [];
			for (const question of questions) {
				const answer = await askOneQuestion(question, ctx);
				answers.push(answer);
				if (answer.cancelled) break;
			}

			return {
				content: [{ type: "text" as const, text: summarizeAnswers(answers) }],
				details: { questions, answers, uiAvailable: true, cancelled: answers.some((answer) => answer.cancelled) },
			};
		},
		renderCall(args, theme) {
			const questions = normalizeQuestions(args as DroidAskQuestionParams);
			const label = questions[0]?.question ?? "Ask the user";
			return new Text(theme.fg("toolTitle", theme.bold("droid question ")) + theme.fg("muted", label), 0, 0);
		},
	});

	pi.on("session_start", (_event, ctx) => {
		syncDroidQuestionToolForModel(pi, ctx.model);
	});
	pi.on("model_select", (event) => {
		syncDroidQuestionToolForModel(pi, event.model);
	});
}
