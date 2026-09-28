/** The two languages the atelier publishes in. */
export type Language = "en" | "ar";

export type Direction = "ltr" | "rtl";

/**
 * Copy that ships as data rather than as a dictionary key.
 *
 * Marketing content (project names, testimonials, material notes) lives in
 * `atelier.data.ts` next to the imagery it belongs to, so translating it in a
 * separate dictionary would split one editorial decision across two files.
 * Those strings use this shape instead and are read through the same `t` pipe.
 */
export type Localized<T = string> = Readonly<Record<Language, T>>;

export const LANGUAGES: readonly Language[] = ["en", "ar"];

export const DIRECTION: Readonly<Record<Language, Direction>> = {
	en: "ltr",
	ar: "rtl",
};

/** BCP 47 tags for `Intl` formatting. Arabic uses Latin digits to match the design. */
export const LOCALE: Readonly<Record<Language, string>> = {
	en: "en-AE",
	ar: "ar-AE-u-nu-latn",
};

/** Endonyms, so the switch reads in the language it offers. */
export const LANGUAGE_LABEL: Readonly<Record<Language, string>> = {
	en: "EN",
	ar: "عر",
};

export function isLanguage(value: unknown): value is Language {
	return value === "en" || value === "ar";
}
