import { ChangeDetectionStrategy, Component } from "@angular/core";

import { ATELIER } from "@bq/core/data/project.data";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-portal-footer",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RevealDirective, TranslatePipe],
	templateUrl: "./portal-footer.html",
	styleUrl: "./portal-footer.scss",
})
export class PortalFooter {
	protected readonly atelier = ATELIER;
}
