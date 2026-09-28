import { DOCUMENT } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { BookingLauncher } from "@bq/features/booking/booking-launcher.service";
import { CtaSection } from "@bq/features/home/sections/cta-section/cta-section";
import { HeroSection } from "@bq/features/home/sections/hero-section/hero-section";
import { MaterialsSection } from "@bq/features/home/sections/materials-section/materials-section";
import { PortfolioSection } from "@bq/features/home/sections/portfolio-section/portfolio-section";
import { ProcessSection } from "@bq/features/home/sections/process-section/process-section";
import { TestimonialSection } from "@bq/features/home/sections/testimonial-section/testimonial-section";

@Component({
	selector: "bq-home",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HeroSection,
		PortfolioSection,
		ProcessSection,
		MaterialsSection,
		TestimonialSection,
		CtaSection,
	],
	templateUrl: "./home.html",
	styleUrl: "./home.scss",
})
export class Home {
	readonly #booking = inject(BookingLauncher);
	readonly #destroyRef = inject(DestroyRef);
	readonly #document = inject(DOCUMENT);

	protected book(): void {
		this.#booking
			.open()
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((result) => {
				if (result?.navigateTo === "portfolio") this.scrollTo("projects");
			});
	}

	protected scrollTo(elementId: string): void {
		this.#document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "start" });
	}
}
