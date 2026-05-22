import type { ExtensionHandler, SessionStartEvent } from "@earendil-works/pi-coding-agent";

interface DroidSessionCwdExtensionApi {
	on(event: "session_start", handler: ExtensionHandler<SessionStartEvent>): void;
}

const state = {
	sessionCwd: process.cwd(),
};

export function getDroidSessionCwd(): string {
	return state.sessionCwd;
}

function setDroidSessionCwd(cwd: string): void {
	state.sessionCwd = cwd;
}

function resetDroidSessionCwd(): void {
	state.sessionCwd = process.cwd();
}

export function registerDroidSessionCwd(pi: DroidSessionCwdExtensionApi): void {
	pi.on("session_start", (_event, ctx) => {
		setDroidSessionCwd(ctx.cwd);
	});
}

export const __testUtils = {
	set: setDroidSessionCwd,
	reset: resetDroidSessionCwd,
};
