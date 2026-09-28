import { ChangeDetectionStrategy, Component } from "@angular/core";

import { PROCESS_SECTION, PROCESS_STEPS } from "@bq/core/data/atelier.data";
import { Icon } from "@bq/shared/components/icon/icon";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-process-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, RevealDirective, TranslatePipe],
	templateUrl: "./process-section.html",
	styleUrl: "./process-section.scss",
})
export class ProcessSection {
	protected readonly section = PROCESS_SECTION;
	protected readonly steps = PROCESS_STEPS;
}
