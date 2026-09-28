import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

/** Label row shared by every control: text, required marker, optional sub-text. */
@Component({
	selector: "bq-field-label",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TranslatePipe],
	templateUrl: "./field-label.html",
	styleUrl: "./field-label.scss",
})
export class FieldLabel {
	readonly text = input.required<string>();
	readonly subText = input("");
	readonly required = input(false);
	readonly htmlFor = input<string>();
	readonly labelId = input<string>();
}
