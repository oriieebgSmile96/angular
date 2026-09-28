/**
 * Money and date formatting for the portal.
 *
 * Everything takes an explicit locale rather than reading the ambient default,
 * so a figure renders the same for a visitor in Dubai and one in London. The
 * Arabic locale is configured with Latin digits (`-u-nu-latn`) in
 * `language.model.ts`, matching how the Figma file sets its numerals.
 */

/** `56,120` — the amount alone. The dirham label comes from the `currency.aed` key. */
export function formatAmount(value: number, locale: string): string {
	return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

/** `04 Jul 2026`, the format the Figma file uses throughout. */
export function formatDate(iso: string, locale: string): string {
	return new Intl.DateTimeFormat(locale, {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(`${iso}T00:00:00`));
}
