/**
 * Builds the icon sprite from `public/icons/*.svg`.
 *
 * The individual SVG files are the source of truth — drop a new one in that
 * folder, run `npm run icons`, and it becomes available to `<bq-icon>`. This
 * writes two outputs:
 *
 *   public/icons/sprite.svg                      one request for every icon
 *   src/app/shared/components/icon/icon-name.ts  the `IconName` union
 *
 * Pass `--check` to fail instead of writing, which is what CI runs.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconDir = join(root, "public", "icons");
const spritePath = join(iconDir, "sprite.svg");
const namesPath = join(root, "src", "app", "shared", "components", "icon", "icon-name.ts");

const checkOnly = process.argv.includes("--check");

const files = readdirSync(iconDir)
	.filter((file) => file.endsWith(".svg") && file !== "sprite.svg")
	.sort();

if (!files.length) throw new Error("no icons found in public/icons");

const symbols = [];
const names = [];

for (const file of files) {
	const name = file.replace(/\.svg$/, "");
	const raw = readFileSync(join(iconDir, file), "utf8").trim();

	const openTag = raw.slice(0, raw.indexOf(">") + 1);
	const viewBox = /viewBox="([^"]+)"/.exec(openTag)?.[1];
	if (!viewBox) throw new Error(`${file} has no viewBox`);

	// Paint attributes live on the root <svg>, so they have to move to the
	// <symbol> or the shape loses its fill once it is referenced by <use>.
	const paint = ["fill", "stroke", "stroke-linecap", "stroke-linejoin"]
		.map((attribute) => new RegExp(`\\s${attribute}="([^"]+)"`).exec(openTag))
		.filter(Boolean)
		.map((match) => match[0])
		.join("");

	const inner = raw.slice(raw.indexOf(">") + 1, raw.lastIndexOf("</svg>")).trim();

	symbols.push(`<symbol id="${name}" viewBox="${viewBox}"${paint}>${inner}</symbol>`);
	names.push(name);
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>\n`;

const namesFile = `// GENERATED FROM web/public/icons/*.svg - DO NOT EDIT BY HAND.
// Add or remove an SVG in that folder, then run \`npm run icons\`.

export const ICON_NAMES = [
${names.map((name) => `\t"${name}",`).join("\n")}
] as const;

export type IconName = (typeof ICON_NAMES)[number];
`;

const outputs = [
	{ path: spritePath, contents: sprite, label: "public/icons/sprite.svg" },
	{ path: namesPath, contents: namesFile, label: "src/app/shared/components/icon/icon-name.ts" },
];

let drifted = false;

for (const output of outputs) {
	const current = safeRead(output.path);

	if (current === output.contents) {
		console.log(`unchanged  ${output.label}`);
		continue;
	}

	if (checkOnly) {
		console.error(`DRIFT      ${output.label}`);
		drifted = true;
		continue;
	}

	writeFileSync(output.path, output.contents, "utf8");
	console.log(`written    ${output.label}`);
}

if (drifted) {
	console.error("\nIcon outputs are stale. Run `npm run icons` and commit the result.");
	process.exit(1);
}

console.log(`\n${names.length} icons`);

function safeRead(path) {
	try {
		return readFileSync(path, "utf8");
	} catch {
		return null;
	}
}
