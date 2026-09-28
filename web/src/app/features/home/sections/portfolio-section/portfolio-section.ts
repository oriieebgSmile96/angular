import { ChangeDetectionStrategy, Component, output } from "@angular/core";

import { PORTFOLIO, PORTFOLIO_SECTION } from "@bq/core/data/atelier.data";
import { Icon } from "@bq/shared/components/icon/icon";
import { PhotoFrame } from "@bq/shared/components/photo/photo-frame";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-portfolio-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PhotoFrame, Icon, ButtonDirective, RevealDirective, TranslatePipe],
	templateUrl: "./portfolio-section.html",
	styleUrl: "./portfolio-section.scss",
})
export class PortfolioSection {
	readonly viewAllRequested = output<void>();

	protected readonly section = PORTFOLIO_SECTION;
	protected readonly projects = PORTFOLIO;
}
