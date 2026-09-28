import { Directive, input } from "@angular/core";

import { ButtonSize, ButtonVariant } from "./button.model";

export type { ButtonSize, ButtonVariant } from "./button.model";

/**
 * Applies the atelier's button treatment to a native `<button>` or `<a>`.
 *
 * A directive rather than a component so the host stays a real interactive
 * element: routerLink, type="submit", disabled and focus all behave natively.
 * Styles live in `styles/_button.scss` because the host is outside this
 * directive's (non-existent) view encapsulation.
 */
@Directive({
	selector: "button[bqButton], a[bqButton]",
	host: {
		class: "bq-button",
		"[class.bq-button--primary]": "variant() === 'primary'",
		"[class.bq-button--outline]": "variant() === 'outline'",
		"[class.bq-button--ghost]": "variant() === 'ghost'",
		"[class.bq-button--link]": "variant() === 'link'",
		"[class.bq-button--sm]": "size() === 'sm'",
		"[class.bq-button--lg]": "size() === 'lg'",
		"[class.bq-button--block]": "block()",
	},
})
export class ButtonDirective {
	readonly variant = input<ButtonVariant>("primary", { alias: "bqButton" });
	readonly size = input<ButtonSize>("md");
	readonly block = input(false);
}
