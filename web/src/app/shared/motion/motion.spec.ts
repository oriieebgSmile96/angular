import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import {
	STAGGER_MAX_MS,
	STAGGER_STEP_MS,
	ScrollRevealService,
	staggerDelay,
} from "@bq/shared/motion/scroll-reveal.service";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RevealDirective],
	template: `
		<p class="plain" bqReveal>plain</p>
		<p class="scaled" bqReveal="scale">scaled</p>
		<p class="third" bqReveal [bqRevealIndex]="2">third</p>
		<p class="held" bqReveal [bqRevealIndex]="1" [bqRevealDelay]="200">held</p>
	`,
})
class HostComponent {}

describe("staggerDelay", () => {
	it("spaces siblings a step apart", () => {
		expect(staggerDelay(0)).toBe(0);
		expect(staggerDelay(3)).toBe(3 * STAGGER_STEP_MS);
	});

	/**
	 * Without the cap, the sixth invoice row would still be waiting to move most
	 * of a second after the first one did, which reads as jank rather than as
	 * sequence.
	 */
	it("caps a long run so the last item is not left behind", () => {
		expect(staggerDelay(50)).toBe(STAGGER_MAX_MS);
	});

	it("adds the extra delay on top of the cap", () => {
		expect(staggerDelay(50, 120)).toBe(STAGGER_MAX_MS + 120);
	});

	it("treats a negative index as the first item", () => {
		expect(staggerDelay(-3)).toBe(0);
	});
});

describe("RevealDirective", () => {
	let fixture: ComponentFixture<HostComponent>;

	function element(selector: string): HTMLElement {
		return fixture.nativeElement.querySelector(selector);
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
	});

	it("defaults a bare attribute to the standard lift", () => {
		expect(element(".plain").dataset["bqReveal"]).toBe("up");
	});

	it("carries the named variant through to the attribute the stylesheet reads", () => {
		expect(element(".scaled").dataset["bqReveal"]).toBe("scale");
	});

	it("writes the stagger onto the element as a custom property", () => {
		expect(element(".third").style.getPropertyValue("--bq-reveal-delay")).toBe(
			`${2 * STAGGER_STEP_MS}ms`,
		);
	});

	it("adds an explicit delay on top of the stagger", () => {
		expect(element(".held").style.getPropertyValue("--bq-reveal-delay")).toBe(
			`${STAGGER_STEP_MS + 200}ms`,
		);
	});

	/**
	 * The whole mechanism hides content and waits for a callback to show it
	 * again, so the one unacceptable outcome is content that never arrives. In
	 * jsdom there is no IntersectionObserver, which is exactly the fallback path
	 * a visitor on an old browser takes: everything must be revealed at once.
	 */
	it("reveals immediately when the environment cannot observe", () => {
		expect(TestBed.inject(ScrollRevealService).animatable).toBe(false);

		for (const selector of [".plain", ".scaled", ".third", ".held"]) {
			expect(element(selector).classList.contains("is-inview")).toBe(true);
		}
	});
});
