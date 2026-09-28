/**
 * Date helpers for the picker.
 *
 * Deliberately dependency-free: the site needs a handful of local-time day
 * operations, not a full date library, and every value the picker stores is a
 * plain `YYYY-MM-DD` string so it survives a round trip through a form.
 */

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, months: number): Date {
	return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
	);
}

export function toMonthLabel(date: Date, locale: string): string {
	return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

/** Two-letter column headings, starting on Sunday to match the grid. */
export function weekdayInitials(locale: string): readonly string[] {
	const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

	// 2024-01-07 was a Sunday, so seven days from there covers the week in order.
	return Array.from({ length: 7 }, (_, offset) => formatter.format(new Date(2024, 0, 7 + offset)));
}

/** Storage format: a local calendar day, with no timezone to shift it. */
export function toDateValue(date: Date): string {
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export function fromDateValue(value: unknown): Date | null {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : startOfDay(value);
	if (typeof value !== "string" || !value) return null;

	const [year, month, day] = value.slice(0, 10).split("-").map(Number);
	if (!year || !month || !day) return null;

	const parsed = new Date(year, month - 1, day);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Human-readable form shown in pickers, e.g. "Tuesday, 17 November 2026". */
export function toDisplayDate(date: Date, locale: string): string {
	return new Intl.DateTimeFormat(locale, {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

/** A closed range shown in the trigger, e.g. two long dates separated by an en dash. */
export function toDisplayDateRange(from: Date, to: Date, locale: string): string {
	const start = toDisplayDate(from, locale);
	if (isSameDay(from, to)) return start;

	return `${start} – ${toDisplayDate(to, locale)}`;
}
