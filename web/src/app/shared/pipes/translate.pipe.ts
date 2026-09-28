import { Pipe, PipeTransform, inject } from "@angular/core";

import { TranslationKey } from "@bq/core/i18n/en";
import { Localized } from "@bq/core/i18n/language.model";
import { TranslationParams, TranslationService } from "@bq/core/i18n/translation.service";

/**
 * Resolves either a dictionary key or a `Localized` value into the active language.
 *
 * Impure by necessity: a pure pipe memoizes on its arguments, so it would keep
 * returning English after the language signal changed even though the view had
 * been marked dirty. The work is a single map lookup, so the cost is noise.
 */
@Pipe({ name: "t", pure: false })
export class TranslatePipe implements PipeTransform {
	readonly #i18n = inject(TranslationService);

	transform(value: TranslationKey, params?: TranslationParams): string;
	transform(value: Localized): string;
	transform(value: Localized | null | undefined): string;
	transform(value: TranslationKey | Localized | null | undefined, params?: TranslationParams): string {
		if (value == null) return "";
		if (typeof value === "string") return this.#i18n.translate(value, params);

		return this.#i18n.resolve(value);
	}
}
