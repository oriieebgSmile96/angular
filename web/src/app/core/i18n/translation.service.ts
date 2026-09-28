import { DOCUMENT } from "@angular/common";
import { Injectable, computed, effect, inject, signal } from "@angular/core";

import { ar } from "@bq/core/i18n/ar";
import { Dictionary, TranslationKey, en } from "@bq/core/i18n/en";
import { DIRECTION, LOCALE, Language, Localized, isLanguage } from "@bq/core/i18n/language.model";

const STORAGE_KEY = "bq.language";
const DEFAULT_LANGUAGE: Language = "en";

const DICTIONARY: Readonly<Record<Language, Dictionary>> = { en, ar };

export type TranslationParams = Readonly<Record<string, string | number>>;

/**
 * Runtime language switching for a two-language site.
 *
 * Angular's built-in i18n compiles one bundle per locale, which would mean a
 * page reload and a separate deployment to flip languages. The atelier's
 * visitors switch mid-scroll, so the dictionary is held in a signal instead and
 * templates read it through the `t` pipe.
 */
@Injectable({ providedIn: "root" })
export class TranslationService {
	readonly #document = inject(DOCUMENT);
	readonly #language = signal<Language>(readStoredLanguage());

	readonly language = this.#language.asReadonly();
	readonly direction = computed(() => DIRECTION[this.#language()]);
	readonly isRtl = computed(() => this.direction() === "rtl");
	readonly locale = computed(() => LOCALE[this.#language()]);

	readonly #dictionary = computed(() => DICTIONARY[this.#language()]);

	constructor() {
		effect(() => {
			const language = this.#language();
			const root = this.#document.documentElement;

			root.lang = language;
			root.dir = DIRECTION[language];

			try {
				localStorage.setItem(STORAGE_KEY, language);
			} catch {
				// Private browsing denies writes; the choice just will not survive a reload.
			}
		});
	}

	use(language: Language): void {
		this.#language.set(language);
	}

	toggle(): void {
		this.#language.update((current) => (current === "en" ? "ar" : "en"));
	}

	/** Looks up a dictionary key. Unknown keys surface as the key itself rather than blank. */
	translate(key: TranslationKey, params?: TranslationParams): string {
		return interpolate(this.#dictionary()[key] ?? key, params);
	}

	/** Picks the active language out of content that ships as data. */
	resolve<T>(value: Localized<T>): T {
		return value[this.#language()];
	}

	/** Formats a date in the active locale, e.g. for the booking summary. */
	formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
		return new Intl.DateTimeFormat(this.locale(), options).format(date);
	}
}

function interpolate(template: string, params?: TranslationParams): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in params ? String(params[name]) : match,
	);
}

function readStoredLanguage(): Language {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (isLanguage(stored)) return stored;
	} catch {
		// Storage unavailable: fall through to the browser's preference.
	}

	return navigator?.language?.startsWith("ar") ? "ar" : DEFAULT_LANGUAGE;
}
