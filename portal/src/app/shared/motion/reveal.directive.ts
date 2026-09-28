import {
	Directive,
	ElementRef,
	OnDestroy,
	afterNextRender,
	inject,
	input,
	numberAttribute,
	signal,
} from "@angular/core";

import { ScrollRevealService, staggerDelay } from "@bq/shared/motion/scroll-reveal.service";
import { RevealVariant } from "@bq/shared/motion/reveal.model";

export type { RevealVariant } from "@bq/shared/motion/reveal.model";

/**
 * Reveals an element the first time it scrolls into view.
 *
 * ```html
 * <li bqReveal="scale" [bqRevealIndex]="$index">…</li>
 * ```
 *
 * The hidden state lives under `.bq-motion` on `<html>`, which the inline script
 * in `index.html` sets before first paint and only when the visitor has not
 * asked for reduced motion. So if this directive never runs — no JavaScript, a
 * thrown error, an observer that never fires — nothing is left invisible.
 */
@Directive({
	selector: "[bqReveal]",
	host: {
		"[attr.data-bq-reveal]": "variant()",
		"[class.is-inview]": "revealed()",
		"[style.--bq-reveal-delay.ms]": "delay()",
	},
})
export class RevealDirective implements OnDestroy {
	/**
	 * The variant, e.g. `bqReveal="scale"`.
	 *
	 * A bare `bqReveal` is the common case and reads better than
	 * `bqReveal="up"`, but Angular hands a valueless attribute through as `""`,
	 * so the transform is what lets both spellings mean the same thing.
	 */
	readonly variant = input<RevealVariant, RevealVariant | "">("up", {
		alias: "bqReveal",
		transform: (value) => value || "up",
	});

	/** Position in a run of siblings. Turns into the stagger. */
	readonly index = input(0, { alias: "bqRevealIndex", transform: numberAttribute });

	/** Added on top of the stagger, to hold a whole group back behind another. */
	readonly extraDelay = input(0, { alias: "bqRevealDelay", transform: numberAttribute });

	readonly #element = inject<ElementRef<HTMLElement>>(ElementRef);
	readonly #reveal = inject(ScrollRevealService);
	readonly #revealed = signal(false);

	protected readonly revealed = this.#revealed.asReadonly();
	protected readonly delay = () => staggerDelay(this.index(), this.extraDelay());

	constructor() {
		afterNextRender(() => {
			this.#reveal.observe(this.#element.nativeElement, () => this.#revealed.set(true));
		});
	}

	ngOnDestroy(): void {
		this.#reveal.unobserve(this.#element.nativeElement);
	}
}
