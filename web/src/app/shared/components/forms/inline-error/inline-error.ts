import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { Icon } from "@bq/shared/components/icon/icon";

/** Assertive error line rendered under a control. */
@Component({
	selector: "bq-inline-error",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon],
	templateUrl: "./inline-error.html",
	styleUrl: "./inline-error.scss",
})
export class InlineError {
	readonly message = input("");
	readonly errorId = input<string>();
}
