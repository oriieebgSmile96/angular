/**
 * Generates the SCSS and TypeScript token files from `tokens.json`.
 *
 * Targets:
 *   web/src/styles/_tokens.scss     SCSS variables + `:root` custom properties
 *   portal/src/styles/_tokens.scss  the same, for the client portal
 *   mobile/src/theme/tokens.ts      typed token object
 *
 * Both generated files are committed so the apps build without a prebuild step,
 * but they must never be hand-edited: `npm run tokens:check` fails the build if
 * they drift from `tokens.json`.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

/** Both Angular apps get the identical stylesheet — same brand, same palette. */
const SCSS_TARGETS = [
	join(repoRoot, "web", "src", "styles", "_tokens.scss"),
	join(repoRoot, "portal", "src", "styles", "_tokens.scss"),
];
const TS_TARGET = join(repoRoot, "mobile", "src", "theme", "tokens.ts");

const PREFIX = "bq";
const BANNER = "GENERATED FROM shared/design-tokens/tokens.json - DO NOT EDIT BY HAND.";
/** Applied when the document carries no `data-theme`, so there is never a bare page. */
const DEFAULT_THEME = "dark";

/** Token groups whose numeric leaves represent CSS pixel lengths. */
const PX_GROUPS = new Set(["space", "radius", "layout", "font.size", "font.tracking", "breakpoint"]);
/** Token groups whose numeric leaves represent milliseconds. */
const MS_GROUPS = new Set(["duration"]);

function loadTokens() {
	const raw = JSON.parse(readFileSync(join(here, "tokens.json"), "utf8"));
	delete raw.$meta;
	return raw;
}

function flatten(node, path = []) {
	return Object.entries(node).flatMap(([key, value]) => {
		if (key === "$comment") return [];
		return value !== null && typeof value === "object"
			? flatten(value, [...path, key])
			: [{ path: [...path, key], value }];
	});
}

/**
 * Splits the semantic `theme` group off the palette.
 *
 * The two are emitted differently: palette tokens become literal SCSS values,
 * while theme tokens become `var(--bq-theme-*)` so that swapping `data-theme`
 * on the document restyles the page without a rebuild.
 */
function splitThemes(tokens) {
	const { theme = {}, ...base } = tokens;
	const names = Object.keys(theme).filter((name) => name !== "$comment");
	if (!names.length) throw new Error("tokens.json has no `theme` group");

	const shape = flatten(theme[names[0]]).map((entry) => entry.path.join("-"));

	for (const name of names) {
		const keys = flatten(theme[name]).map((entry) => entry.path.join("-"));
		const missing = shape.filter((key) => !keys.includes(key));
		const extra = keys.filter((key) => !shape.includes(key));
		if (missing.length || extra.length) {
			throw new Error(
				`theme "${name}" does not match "${names[0]}": missing [${missing}] extra [${extra}]`,
			);
		}
	}

	return { base, themes: theme, themeNames: names, themeKeys: shape };
}

function cssValue({ path, value }) {
	if (typeof value !== "number") return value;
	const group = path[0];
	const pair = `${path[0]}.${path[1]}`;
	if (MS_GROUPS.has(group)) return `${value}ms`;
	if (PX_GROUPS.has(group) || PX_GROUPS.has(pair)) return value === 0 ? "0" : `${value}px`;
	return String(value);
}

function buildScss(tokens) {
	const { base, themes, themeNames, themeKeys } = splitThemes(tokens);
	const entries = flatten(base);
	const lines = [
		`// ${BANNER}`,
		"",
		"// ---------------------------------------------------------------------------",
		"// SCSS variables - available at compile time (usable in media queries, maths).",
		"// ---------------------------------------------------------------------------",
	];

	let currentGroup = null;
	for (const entry of entries) {
		if (entry.path[0] !== currentGroup) {
			currentGroup = entry.path[0];
			lines.push("", `// ${currentGroup}`);
		}
		lines.push(`$${PREFIX}-${entry.path.join("-")}: ${cssValue(entry)};`);
	}

	lines.push(
		"",
		"// ---------------------------------------------------------------------------",
		"// Semantic theme variables - resolve to whichever theme is on <html>.",
		"// Components use these; the raw ramps above are for fixed brand marks only.",
		"// ---------------------------------------------------------------------------",
	);
	for (const key of themeKeys) {
		lines.push(`$${PREFIX}-${key}: var(--${PREFIX}-${key});`);
	}

	lines.push(
		"",
		"// ---------------------------------------------------------------------------",
		"// Custom properties - available at runtime (usable for theming, JS reads).",
		"// ---------------------------------------------------------------------------",
		":root {",
	);
	for (const entry of entries) {
		lines.push(`\t--${PREFIX}-${entry.path.join("-")}: ${cssValue(entry)};`);
	}
	lines.push("}", "");

	// `dark` doubles as the `:root` fallback so a document with no `data-theme`
	// still renders the atelier's default look rather than unstyled colours.
	// The `.bq-theme-*` classes pin a subtree to one palette regardless of the
	// document setting, which is how the footer stays an ink band on paper.
	for (const name of themeNames) {
		const scopes = [`[data-theme="${name}"]`, `.${PREFIX}-theme-${name}`];
		if (name === DEFAULT_THEME) scopes.unshift(":root");
		lines.push("", `${scopes.join(",\n")} {`);
		for (const entry of flatten(themes[name])) {
			lines.push(`\t--${PREFIX}-${entry.path.join("-")}: ${entry.value};`);
		}
		lines.push("}");
	}
	lines.push("");

	return lines.join("\n");
}

function serialize(node, indent = 1) {
	const pad = "\t".repeat(indent);
	const closePad = "\t".repeat(indent - 1);
	const body = Object.entries(node)
		// `$comment` documents a group for whoever edits tokens.json; it is not a
		// token, so it must not reach the apps as a runtime string.
		.filter(([key]) => key !== "$comment")
		.map(([key, value]) => {
			const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `"${key}"`;
			if (value !== null && typeof value === "object") {
				return `${pad}${safeKey}: ${serialize(value, indent + 1)},`;
			}
			return `${pad}${safeKey}: ${typeof value === "number" ? value : JSON.stringify(value)},`;
		})
		.join("\n");
	return `{\n${body}\n${closePad}}`;
}

function buildTs(tokens) {
	const { base, themes, themeNames } = splitThemes(tokens);

	// React Native has no font stacks: keep only the first family of each stack.
	const mobile = structuredClone(base);
	for (const [key, stack] of Object.entries(mobile.font.family)) {
		mobile.font.family[key] = String(stack).split(",")[0].replace(/'/g, "").trim();
	}

	const themeObject = Object.fromEntries(
		themeNames.map((name) => {
			const clone = structuredClone(themes[name]);
			delete clone.$comment;
			return [name, clone];
		}),
	);

	return [
		`// ${BANNER}`,
		"",
		`export const tokens = ${serialize(mobile)} as const;`,
		"",
		"/** Semantic colours per theme. Pick one with `useTheme()` rather than reading `tokens.color`. */",
		`export const themes = ${serialize(themeObject)} as const;`,
		"",
		"export type Tokens = typeof tokens;",
		'export type ColorScale = keyof Tokens["color"];',
		"export type ThemeName = keyof typeof themes;",
		"export type ThemeColors = (typeof themes)[ThemeName];",
		"",
	].join("\n");
}

function write(target, contents, { check }) {
	const existing = existsSync(target) ? readFileSync(target, "utf8") : null;
	if (existing === contents) return { target, changed: false };
	if (check) return { target, changed: true, stale: true };
	mkdirSync(dirname(target), { recursive: true });
	writeFileSync(target, contents, "utf8");
	return { target, changed: true };
}

const check = process.argv.includes("--check");
const tokens = loadTokens();
const scss = buildScss(tokens);
const results = [
	...SCSS_TARGETS.map((target) => write(target, scss, { check })),
	write(TS_TARGET, buildTs(tokens), { check }),
];

const stale = results.filter((r) => r.stale);
if (stale.length > 0) {
	console.error("Design tokens are stale. Run `npm run tokens`:");
	for (const r of stale) console.error(`  - ${r.target}`);
	process.exit(1);
}

for (const r of results) {
	console.log(`${r.changed ? "updated" : "unchanged"}  ${r.target}`);
}
