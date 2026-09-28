/**
 * Downloads the brand fonts into `assets/fonts/`.
 *
 * The app used to get these from the `@expo-google-fonts/*` packages. Those work,
 * but they put the typeface — a design decision, and part of the brand — inside
 * node_modules where it is invisible next to the rest of the assets and pinned by
 * a version range. A dozen committed files are easier to reason about.
 *
 * Google serves TrueType to a client that cannot take woff2, which is what React
 * Native needs.
 *
 * Run with `node scripts/fetch-fonts.mjs`. It is a one-off; the files are committed.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontDir = join(root, "assets", "fonts");

// Deliberately ancient: a modern UA gets woff2 back, which RN cannot load.
const USER_AGENT = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko) Version/5.0 Safari/534.30";

/** `key` is the name passed to `useFonts`, and therefore the RN `fontFamily` value. */
const FONTS = [
	{ key: "PlayfairDisplay_400Regular", family: "Playfair+Display", weight: 400 },
	{ key: "PlayfairDisplay_600SemiBold", family: "Playfair+Display", weight: 600 },
	{ key: "PlayfairDisplay_700Bold", family: "Playfair+Display", weight: 700 },
	{ key: "Poppins_400Regular", family: "Poppins", weight: 400 },
	{ key: "Poppins_500Medium", family: "Poppins", weight: 500 },
	{ key: "Poppins_600SemiBold", family: "Poppins", weight: 600 },
	{ key: "Poppins_700Bold", family: "Poppins", weight: 700 },

	// Arabic companions: Amiri partners Playfair Display, Tajawal partners
	// Poppins. Neither covers the whole Latin ramp — Amiri ships 400 and 700
	// only, and Tajawal has no 600 — so `theme.ts` doubles up the missing slots.
	{ key: "Amiri_400Regular", family: "Amiri", weight: 400 },
	{ key: "Amiri_700Bold", family: "Amiri", weight: 700 },
	{ key: "Tajawal_400Regular", family: "Tajawal", weight: 400 },
	{ key: "Tajawal_500Medium", family: "Tajawal", weight: 500 },
	{ key: "Tajawal_700Bold", family: "Tajawal", weight: 700 },
];

mkdirSync(fontDir, { recursive: true });

for (const font of FONTS) {
	const cssUrl = `https://fonts.googleapis.com/css2?family=${font.family}:wght@${font.weight}`;
	const css = await (await fetch(cssUrl, { headers: { "User-Agent": USER_AGENT } })).text();

	const url = /url\((https:[^)]+)\)/.exec(css)?.[1];
	if (!url) throw new Error(`no font url for ${font.key}\n${css}`);
	if (!url.endsWith(".ttf")) throw new Error(`expected a ttf for ${font.key}, got ${url}`);

	const buffer = Buffer.from(await (await fetch(url, { headers: { "User-Agent": USER_AGENT } })).arrayBuffer());
	writeFileSync(join(fontDir, `${font.key}.ttf`), buffer);

	console.log(`${font.key}.ttf  ${Math.round(buffer.length / 1024)}kB`);
}

console.log(`\n${FONTS.length} fonts in assets/fonts/`);
