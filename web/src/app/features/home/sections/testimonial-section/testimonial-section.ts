import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";

import { TESTIMONIAL_SECTION, TESTIMONIALS } from "@bq/core/data/atelier.data";
import { Icon } from "@bq/shared/components/icon/icon";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-testimonial-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, RevealDirective, TranslatePipe],
	templateUrl: "./testimonial-section.html",
	styleUrl: "./testimonial-section.scss",
})
export class TestimonialSection {
	protected readonly section = TESTIMONIAL_SECTION;
	protected readonly testimonials = TESTIMONIALS;
	protected readonly index = signal(0);
	protected readonly current = computed(() => this.testimonials[this.index()]);
}
