import { Pipe, PipeTransform, inject } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

import { TranslationKey } from "@bq/core/i18n/en";
import { TranslationParams, TranslationService } from "@bq/core/i18n/translation.service";

/**
 * Turns the first validation error on a control into wording a client can act on.
 *
 * Add a key here rather than writing an error string in a template — that keeps
 * the copy consistent across every form in the site. The error's own payload is
 * passed straight through as interpolation parameters, so a message can quote
 * the limit it is complaining about.
 */
const MESSAGES: Readonly<Record<string, TranslationKey>> = {
	required: "validation.required",
	requiredTrue: "validation.requiredTrue",
	email: "validation.email",
	minlength: "validation.minlength",
	maxlength: "validation.maxlength",
	min: "validation.min",
	max: "validation.max",
	pattern: "validation.pattern",
	mobile: "validation.mobile",
	dateMin: "validation.dateMin",
	dateMax: "validation.dateMax",
};

/** Impure for the same reason as the `t` pipe: the message must follow the language. */
@Pipe({ name: "validationMessage", pure: false })
export class ValidationMessagePipe implements PipeTransform {
	readonly #i18n = inject(TranslationService);

	transform(errors: ValidationErrors | null | undefined): string {
		if (!errors) return "";

		const [key, detail] = Object.entries(errors)[0] ?? [];
		if (!key) return "";

		return this.#i18n.translate(MESSAGES[key] ?? "validation.fallback", toParams(detail));
	}
}

function toParams(detail: unknown): TranslationParams | undefined {
	return detail !== null && typeof detail === "object" ? (detail as TranslationParams) : undefined;
}
