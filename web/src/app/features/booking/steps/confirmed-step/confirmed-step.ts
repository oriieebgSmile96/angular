import { ChangeDetectionStrategy, Component, output } from "@angular/core";

import { Icon } from "@bq/shared/components/icon/icon";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-confirmed-step",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonDirective, Icon, TranslatePipe],
	templateUrl: "./confirmed-step.html",
	styleUrl: "./confirmed-step.scss",
})
export class ConfirmedStep {
	readonly dismissed = output<void>();
	readonly detailsRequested = output<void>();
}
