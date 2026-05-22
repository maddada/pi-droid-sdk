export const DROID_PI_BRIDGE_MCP_TOOL_PREFIX = "pi__";

const DROID_PI_BRIDGE_CONTRACT_LINES = [
	"Droid pi bridge contract:",
	`${DROID_PI_BRIDGE_MCP_TOOL_PREFIX}* names are live Droid MCP bridge tool names only when exposed in the current run.`,
	`Call the ${DROID_PI_BRIDGE_MCP_TOOL_PREFIX}* MCP tool name, not the real pi tool name shown in pi history or transcripts.`,
	"Bridged calls execute through normal pi tool flow, so pi shows the real pi tool name and returns a normal pi tool result.",
	"Droid-native host tools, settings, plugins, and configured MCP servers are separate from the pi bridge.",
] as const;

export function getDroidPiBridgeContractText(): string {
	return DROID_PI_BRIDGE_CONTRACT_LINES.join("\n");
}

export function buildDroidPiBridgeMcpToolDescription(options: {
	piToolName: string;
	mcpToolName: string;
	piToolDescription: string;
}): string {
	return [
		options.piToolDescription,
		"",
		getDroidPiBridgeContractText(),
		`This run exposes real pi tool ${options.piToolName} as Droid MCP tool ${options.mcpToolName}.`,
	].join("\n");
}
