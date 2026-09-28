import { TextStyle } from "react-native";

import { Language } from "@/i18n/language";
import { ThemeName, themes, tokens } from "./tokens";

/**
 * Semantic layer over the generated tokens.
 *
 * Screens and components read from a `Theme` handed to them by `useAppTheme()`
 * — never from raw hex values — so a palette change in
 * `shared/design-tokens/tokens.json` flows through the app, and so the same
 * component renders correctly in either theme.
 *
 * Sizes and tracking below are transcribed from the Figma file "Mobile App".
 */
export function createPalette(name: ThemeName) {
	const semantic = themes[name];

	return {
		color: {
			background: semantic.surface.page,
			surface: semantic.surface.raised,
			surfaceMuted: semantic.surface.sunken,
			surfaceInverse: semantic.surface.inverse,
			border: semantic.border.subtle,
			borderStrong: semantic.border.strong,

			textPrimary: semantic.text.primary,
			textSecondary: semantic.text.muted,
			textInverse: semantic.text.inverse,
			textOnGold: semantic.text["on-accent"],

			gold: semantic.accent.strong,
			goldStrong: semantic.accent.text,
			goldSoft: semantic.accent.soft,

			danger: semantic.state.danger,
			success: semantic.state.success,
			backdrop: semantic.backdrop,
		},
		space: tokens.space,
		radius: tokens.radius,
		/** Physical material chips. Fixed in both themes — marble does not re-tint. */
		swatch: tokens.color.swatch,
	} as const;
}

export type Theme = ReturnType<typeof createPalette>;

export const fonts = {
	displayRegular: "PlayfairDisplay_400Regular",
	displaySemiBold: "PlayfairDisplay_600SemiBold",
	displayBold: "PlayfairDisplay_700Bold",
	bodyRegular: "Poppins_400Regular",
	bodyMedium: "Poppins_500Medium",
	bodySemiBold: "Poppins_600SemiBold",
	bodyBold: "Poppins_700Bold",
} as const;

/**
 * The Arabic half of the same ramp — Amiri beside Playfair Display, Tajawal
 * beside Poppins — keyed identically so either set can stand in for the other.
 *
 * Neither family covers every slot: Amiri ships 400 and 700 only, and Tajawal
 * skips 600. The gaps reuse the nearest heavier cut, which is the face a browser
 * would land on for the same weight.
 */
export const arabicFonts = {
	displayRegular: "Amiri_400Regular",
	displaySemiBold: "Amiri_700Bold",
	displayBold: "Amiri_700Bold",
	bodyRegular: "Tajawal_400Regular",
	bodyMedium: "Tajawal_500Medium",
	bodySemiBold: "Tajawal_700Bold",
	bodyBold: "Tajawal_700Bold",
} as const satisfies Record<keyof typeof fonts, string>;

/**
 * Picks the face set for the active language.
 *
 * Web needs no equivalent. A CSS font stack resolves per glyph, so appending
 * 'Amiri' to the display stack in `tokens.json` is enough for an Arabic headline
 * to find it while Latin text still gets Playfair. React Native has no stack —
 * `fontFamily` takes one name, and an unresolved glyph falls back to whatever
 * the OS supplies — so the family has to be chosen up front from the language.
 *
 * This deliberately lives here rather than in `tokens.ts`, which is generated
 * and strips every stack down to its first family for exactly that reason.
 */
export const fontsByLanguage = {
	en: fonts,
	ar: arabicFonts,
} as const satisfies Record<Language, Record<keyof typeof fonts, string>>;

export type TypeRamp = ReturnType<typeof createType>;

/**
 * The app's type ramp. Every `Text` should use one of these.
 *
 * Built per theme and language rather than declared as a constant: the colours
 * come from the active palette, the faces from the active script, and Arabic
 * needs `writingDirection` so that mixed strings — a price beside a name, a
 * reference code inside a sentence — order their runs correctly.
 */
export function createType(theme: Theme, language: Language) {
	const face = fontsByLanguage[language];
	const rtl = language === "ar";
	const flow: TextStyle = rtl
		? { writingDirection: "rtl", textAlign: "right" }
		: { writingDirection: "ltr" };

	return {
		/** Screen and section titles. Playfair Display 600 / 20 / 1.6. */
		title: {
			...flow,
			fontFamily: face.displaySemiBold,
			fontSize: 20,
			lineHeight: 27,
			letterSpacing: rtl ? 0 : 1.6,
			color: theme.color.textPrimary,
		},
		/** Product and collection names. Playfair Display 700 / 16 / 1.28. */
		heading: {
			...flow,
			fontFamily: face.displayBold,
			fontSize: 16,
			lineHeight: 22,
			letterSpacing: rtl ? 0 : 1.28,
			color: theme.color.textPrimary,
		},
		/** Collection card names. Playfair Display 700 / 12 / 0.96. */
		headingSmall: {
			...flow,
			fontFamily: face.displayBold,
			fontSize: 12,
			lineHeight: 16,
			letterSpacing: rtl ? 0 : 0.96,
			color: theme.color.textPrimary,
		},
		/** Greeting and section intros. Poppins 400 / 16 / 0.64. */
		eyebrow: {
			...flow,
			fontFamily: face.bodyRegular,
			fontSize: 16,
			lineHeight: 24,
			letterSpacing: rtl ? 0 : 0.64,
			color: theme.color.goldStrong,
		},
		/** Category kickers above a product name. Poppins 400 / 12 / 0.48. */
		kicker: {
			...flow,
			fontFamily: face.bodyRegular,
			fontSize: 12,
			lineHeight: 18,
			letterSpacing: rtl ? 0 : 0.48,
			color: theme.color.goldStrong,
		},
		/**
		 * Badges laid over imagery. Poppins 600 / 12.
		 *
		 * Both pill tones stay light in either theme — gold, or near-white over a
		 * photograph — so the label is pinned to the on-accent ink rather than
		 * following the palette, which would turn it near-white on near-white.
		 */
		badge: {
			...flow,
			fontFamily: face.bodySemiBold,
			fontSize: 12,
			lineHeight: 18,
			color: theme.color.textOnGold,
		},
		/** "See all" and other inline actions. Poppins 600 / 16 / 1.28. */
		action: {
			...flow,
			fontFamily: face.bodySemiBold,
			fontSize: 16,
			lineHeight: 22,
			letterSpacing: rtl ? 0 : 1.28,
			color: theme.color.gold,
		},
		/** Form labels and content group headers. Poppins 500 / 14 / 0.42. */
		label: {
			...flow,
			fontFamily: face.bodyMedium,
			fontSize: 14,
			lineHeight: 21,
			letterSpacing: rtl ? 0 : 0.42,
			color: theme.color.textPrimary,
		},
		/** Chips and input text. Poppins 500 / 14. */
		control: {
			...flow,
			fontFamily: face.bodyMedium,
			fontSize: 14,
			lineHeight: 21,
			color: theme.color.textPrimary,
		},
		/** Long-form copy. Poppins 400 / 12 / 0.96 on a generous 24 leading. */
		body: {
			...flow,
			fontFamily: face.bodyRegular,
			fontSize: 12,
			lineHeight: 24,
			letterSpacing: rtl ? 0 : 0.96,
			color: theme.color.textPrimary,
		},
		/** Secondary paragraphs and input text. Poppins 400 / 14. */
		bodyMuted: {
			...flow,
			fontFamily: face.bodyRegular,
			fontSize: 14,
			lineHeight: 21,
			color: theme.color.textSecondary,
		},
		/** Spec labels and counts. Poppins 400 / 12 / 0.96. */
		caption: {
			...flow,
			fontFamily: face.bodyRegular,
			fontSize: 12,
			lineHeight: 16,
			letterSpacing: rtl ? 0 : 0.96,
			color: theme.color.textSecondary,
		},
		/** Tab bar labels. Poppins 500 / 12. */
		tab: {
			...flow,
			fontFamily: face.bodyMedium,
			fontSize: 12,
			lineHeight: 18,
			color: theme.color.goldStrong,
		},
		/** Full-width call to action. Poppins 600 / 16. */
		button: {
			fontFamily: face.bodySemiBold,
			fontSize: 16,
			lineHeight: 24,
			textTransform: rtl ? "none" : "uppercase",
		},
	} satisfies Record<string, TextStyle>;
}
