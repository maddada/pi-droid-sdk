#!/usr/bin/env node

/**
 * Refresh bundled fallback Factory model metadata.
 *
 * Usage:
 *   node scripts/refresh-droid-model-snapshots.mjs
 *   node scripts/refresh-droid-model-snapshots.mjs --write
 */

import { execFileSync } from "node:child_process";

const shouldWrite = process.argv.includes("--write");

function parseModelsFromHelp(helpText) {
	const lines = helpText.split("\n");
	const models = [];
	let inModels = false;
	for (const line of lines) {
		if (line.includes("Available Models:")) {
			inModels = true;
			continue;
		}
		if (inModels && line.trim() === "") break;
		if (!inModels) continue;
		const match = /^\s{2}([^\s]+)\s+/.exec(line);
		if (match) models.push(match[1]);
	}
	return models;
}

try {
	const help = execFileSync("droid", ["exec", "--help"], { encoding: "utf8" });
	const models = parseModelsFromHelp(help);
	console.log(`Found ${models.length} models in droid exec --help`);
	if (shouldWrite) {
		console.log("Manual update required: edit src/droid-fallback-models.generated.ts with model metadata from docs.factory.ai/models");
	}
	for (const model of models) console.log(`- ${model}`);
} catch (error) {
	console.error("Failed to run droid exec --help:", error instanceof Error ? error.message : error);
	process.exit(1);
}
