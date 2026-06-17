import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Api, AssistantMessageEvent, Context, Model } from "@earendil-works/pi-ai";

vi.mock("@factory/droid-sdk", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@factory/droid-sdk")>();
	return {
		...actual,
		createSession: vi.fn(),
	};
});

import { createSession, DroidMessageType } from "@factory/droid-sdk";
import { streamDroid } from "../src/droid-provider.js";

const mockedCreateSession = vi.mocked(createSession);

const model = {
	id: "claude-opus-4-8",
	api: "factory-droid",
	provider: "factory",
} as Model<Api>;

const context = {
	messages: [
		{
			role: "user",
			content: "Say exactly: ok",
			timestamp: 1,
		},
	],
} as Context;

async function collectEvents(stream: AsyncIterable<AssistantMessageEvent>): Promise<AssistantMessageEvent[]> {
	const events: AssistantMessageEvent[] = [];
	for await (const event of stream) events.push(event);
	return events;
}

describe("streamDroid", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		process.env = { ...originalEnv };
		delete process.env.FACTORY_API_KEY;
		vi.clearAllMocks();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it("passes Factory API key through session options and env", async () => {
		mockedCreateSession.mockResolvedValue({
			initResult: {},
			stream: vi.fn(() => (async function* () {
				yield { type: DroidMessageType.TurnComplete };
			})()),
			close: vi.fn(),
		} as never);

		await collectEvents(streamDroid(model, context, { apiKey: "factory-test-key", reasoning: "off" }));

		expect(mockedCreateSession).toHaveBeenCalledWith(expect.objectContaining({
			apiKey: "factory-test-key",
			env: expect.objectContaining({ FACTORY_API_KEY: "factory-test-key" }),
		}));
	});

	it("returns Droid stream errors as pi error messages", async () => {
		mockedCreateSession.mockResolvedValue({
			initResult: {},
			stream: vi.fn(() => (async function* () {
				yield { type: DroidMessageType.Error, message: "403 Forbidden" };
			})()),
			close: vi.fn(),
		} as never);

		const events = await collectEvents(streamDroid(model, context, { apiKey: "factory-test-key", reasoning: "off" }));
		const errorEvent = events.find((event) => event.type === "error");

		expect(errorEvent).toMatchObject({
			type: "error",
			reason: "error",
			error: {
				stopReason: "error",
				errorMessage: "403 Forbidden",
			},
		});
	});
});
