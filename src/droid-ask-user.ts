import type { AskUserRequestParams, AskUserResult } from "@factory/droid-sdk";
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";

export interface DroidAskUserUiContext {
	hasUI: boolean;
	ui: Pick<ExtensionContext["ui"], "select" | "input">;
}

let uiContext: DroidAskUserUiContext | undefined;

export function setDroidAskUserUiContext(ctx: DroidAskUserUiContext | undefined): void {
	uiContext = ctx;
}

export async function handleDroidAskUserRequest(params: AskUserRequestParams): Promise<AskUserResult> {
	if (!uiContext?.hasUI) {
		return { cancelled: true, answers: [] };
	}

	const answers: AskUserResult["answers"] = [];
	for (const question of params.questions) {
		const options = question.options ?? [];
		if (options.length > 0) {
			const selected = await uiContext.ui.select(question.question, options);
			if (!selected) {
				return { cancelled: true, answers };
			}
			answers.push({
				index: question.index,
				question: question.question,
				answer: selected,
			});
			continue;
		}

		const answer = await uiContext.ui.input(question.question, "Type your answer");
		const trimmed = answer?.trim();
		if (!trimmed) {
			return { cancelled: true, answers };
		}
		answers.push({
			index: question.index,
			question: question.question,
			answer: trimmed,
		});
	}

	return { cancelled: false, answers };
}
