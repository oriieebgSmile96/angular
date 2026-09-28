import { DOCUMENT } from "@angular/common";
import { Injectable, OnDestroy, inject } from "@angular/core";

/** How far apart two siblings in a stagger start moving. */
export const STAGGER_STEP_MS = 60;
/** Ceiling on a stagger, so the tenth invoice row is not still waiting a second in. */
export const STAGGER_MAX_MS = 300;

/** Longest we will leave content hidden waiting on an observer that never fires. */
const FAILSAFE_MS = 2500;

export function staggerDelay(index: number, extra = 0): number {
	return extra + Math.min(Math.max(index, 0) * STAGGER_STEP_MS, STAGGER_MAX_MS);
}

/**
 * One IntersectionObserver for every revealing element on the page.
 *
 * A dashboard reveals a few dozen things — four stages, four board cards, six
 * invoice rows — and giving each its own observer means a few dozen separate
 * callbacks competing on the same scroll. One observer with a map of callbacks
 * costs the same as one element's worth.
 *
 * When motion is unavailable — no observer, or the visitor asked for less of it
 * — `animatable` is false and callers show their content immediately rather
 * than registering at all.
 */
@Injectable({ providedIn: "root" })
export class ScrollRevealService implements OnDestroy {
	readonly #document = inject(DOCUMENT);
	readonly #callbacks = new Map<Element, () => void>();

	#observer: IntersectionObserver | null = null;
	#failsafe: ReturnType<typeof setTimeout> | null = null;

	readonly animatable = this.#canAnimate();

	ngOnDestroy(): void {
		this.#observer?.disconnect();
		if (this.#failsafe !== null) clearTimeout(this.#failsafe);
	}

	observe(element: Element, onEnter: () => void): void {
		if (!this.animatable) {
			onEnter();
			return;
		}

		this.#callbacks.set(element, onEnter);
		this.#ensureObserver().observe(element);
		this.#armFailsafe();
	}

	unobserve(element: Element): void {
		this.#callbacks.delete(element);
		this.#observer?.unobserve(element);
	}

	#ensureObserver(): IntersectionObserver {
		this.#observer ??= new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					this.#release(entry.target);
				}
			},
			// Fires a little before the element is fully on screen, so the motion
			// reads as the page settling rather than as a reaction to the scroll.
			{ threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
		);

		return this.#observer;
	}

	#release(element: Element): void {
		this.#callbacks.get(element)?.();
		this.unobserve(element);
	}

	/**
	 * Content that is hidden until an observer fires is content one failed
	 * callback away from being invisible. If anything is still waiting after a
	 * couple of seconds, show all of it and stop pretending.
	 */
	#armFailsafe(): void {
		if (this.#failsafe !== null) return;

		this.#failsafe = setTimeout(() => {
			for (const element of [...this.#callbacks.keys()]) this.#release(element);
			this.#failsafe = null;
		}, FAILSAFE_MS);
	}

	#canAnimate(): boolean {
		const view = this.#document.defaultView;
		if (!view || !("IntersectionObserver" in view)) return false;

		return !view.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
}
