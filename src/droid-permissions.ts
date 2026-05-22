import {
	AutonomyLevel,
	ToolConfirmationOutcome,
	ToolConfirmationType,
	type RequestPermissionRequestParams,
} from "@factory/droid-sdk";

const DROID_AUTONOMY_LEVEL_ENV = "PI_DROID_AUTONOMY_LEVEL";

let permissionPromptHandler: ((params: RequestPermissionRequestParams) => Promise<ToolConfirmationOutcome>) | undefined;

export function setDroidPermissionPromptHandler(
	handler: ((params: RequestPermissionRequestParams) => Promise<ToolConfirmationOutcome>) | undefined,
): void {
	permissionPromptHandler = handler;
}

export function resolveDroidAutonomyLevel(): AutonomyLevel {
	const raw = process.env[DROID_AUTONOMY_LEVEL_ENV]?.trim().toLowerCase();
	switch (raw) {
		case "off":
			return AutonomyLevel.Off;
		case "low":
			return AutonomyLevel.Low;
		case "medium":
			return AutonomyLevel.Medium;
		case "high":
		default:
			return AutonomyLevel.High;
	}
}

function isBridgeMcpTool(params: RequestPermissionRequestParams): boolean {
	return params.toolUses.some((item) => item.details.type === ToolConfirmationType.McpTool);
}

function summarizePermissionRequest(params: RequestPermissionRequestParams): string {
	return params.toolUses
		.map((item) => {
			const type = item.details.type;
			if (type === ToolConfirmationType.Execute) return `Execute: ${item.details.command ?? "command"}`;
			if (type === ToolConfirmationType.Create) return `Create: ${item.details.filePath ?? "file"}`;
			if (type === ToolConfirmationType.Edit) return `Edit: ${item.details.filePath ?? "file"}`;
			if (type === ToolConfirmationType.McpTool) return `MCP tool: ${item.toolName ?? "tool"}`;
			return `${type}: ${item.toolName ?? "tool"}`;
		})
		.join("; ");
}

export async function handleDroidPermissionRequest(
	params: RequestPermissionRequestParams,
): Promise<ToolConfirmationOutcome> {
	if (isBridgeMcpTool(params)) {
		return ToolConfirmationOutcome.ProceedOnce;
	}

	if (permissionPromptHandler) {
		return permissionPromptHandler(params);
	}

	const autonomy = resolveDroidAutonomyLevel();
	switch (autonomy) {
		case AutonomyLevel.High:
			return ToolConfirmationOutcome.ProceedAutoRunHigh;
		case AutonomyLevel.Medium:
			return ToolConfirmationOutcome.ProceedAutoRunMedium;
		case AutonomyLevel.Low:
			return ToolConfirmationOutcome.ProceedAutoRunLow;
		case AutonomyLevel.Off:
		default:
			return ToolConfirmationOutcome.Cancel;
	}
}

export function formatPermissionRequestForUi(params: RequestPermissionRequestParams): string {
	return summarizePermissionRequest(params);
}
