import { readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Removes generated output so a build starts from nothing.
 *
 * `npm run clean`        build artifacts and tool caches
 * `npm run clean:deps`   the above plus every node_modules tree
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const withDeps = process.argv.includes("--deps");

const ARTIFACTS = [
	"web/dist",
	"web/.angular",
	"portal/dist",
	"portal/.angular",
	"mobile/.expo",
	"mobile/.expo-export",
	"mobile/dist",
];

const DEPENDENCIES = [
	"node_modules",
	"web/node_modules",
	"portal/node_modules",
	"mobile/node_modules",
];

let removed = 0;

function remove(relativePath) {
	const target = join(root, relativePath);
	let bytes = 0;
	try {
		bytes = sizeOf(target);
	} catch {
		return;
	}

	rmSync(target, { recursive: true, force: true });
	removed += bytes;
	console.log(`removed  ${relativePath}  (${formatSize(bytes)})`);
}

function sizeOf(target) {
	const stats = statSync(target);
	if (!stats.isDirectory()) return stats.size;
	return readdirSync(target).reduce((total, entry) => {
		try {
			return total + sizeOf(join(target, entry));
		} catch {
			return total;
		}
	}, 0);
}

function formatSize(bytes) {
	if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	if (bytes > 1024) return `${Math.round(bytes / 1024)} kB`;
	return `${bytes} B`;
}

for (const path of ARTIFACTS) remove(path);

if (withDeps) {
	for (const path of DEPENDENCIES) remove(path);
}

console.log(`\nfreed ${formatSize(removed)}${withDeps ? "" : " — pass --deps to also drop node_modules"}`);
