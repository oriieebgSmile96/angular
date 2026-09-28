import { ChangeDetectionStrategy, Component, output } from "@angular/core";

import { HERO, STATS } from "@bq/core/data/atelier.data";
import { PhotoFrame } from "@bq/shared/components/photo/photo-frame";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-hero-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PhotoFrame, ButtonDirective, RevealDirective, TranslatePipe],
	templateUrl: "./hero-section.html",
	styleUrl: "./hero-section.scss",
})
export class HeroSection {
	readonly bookRequested = output<void>();
	readonly portfolioRequested = output<void>();

	protected readonly hero = HERO;
	protected readonly stats = STATS;
}
