import { ChangeDetectionStrategy, Component, output } from "@angular/core";

import { CTA } from "@bq/core/data/atelier.data";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-cta-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonDirective, RevealDirective, TranslatePipe],
	templateUrl: "./cta-section.html",
	styleUrl: "./cta-section.scss",
})
export class CtaSection {
	readonly bookRequested = output<void>();

	protected readonly cta = CTA;
}
