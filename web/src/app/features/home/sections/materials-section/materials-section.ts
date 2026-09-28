import { ChangeDetectionStrategy, Component, output } from "@angular/core";

import { MATERIALS } from "@bq/core/data/atelier.data";
import { Icon } from "@bq/shared/components/icon/icon";
import { PhotoFrame } from "@bq/shared/components/photo/photo-frame";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-materials-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PhotoFrame, Icon, ButtonDirective, RevealDirective, TranslatePipe],
	templateUrl: "./materials-section.html",
	styleUrl: "./materials-section.scss",
})
export class MaterialsSection {
	readonly consultationRequested = output<void>();

	protected readonly materials = MATERIALS;
	protected readonly highlights = MATERIALS.highlights;
}
