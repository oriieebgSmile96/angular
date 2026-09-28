import { ChangeDetectionStrategy, Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { ReactiveFormControlBase } from "@bq/shared/base/reactive-form-control-base";
import { InlineError } from "@bq/shared/components/forms/inline-error/inline-error";
import { Icon } from "@bq/shared/components/icon/icon";
import { ValidationMessagePipe } from "@bq/shared/pipes/validation-message.pipe";

/** Single boolean checkbox — consent, opt-in, terms. */
@Component({
	selector: "bq-checkbox",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [InlineError, Icon, ValidationMessagePipe],
	templateUrl: "./checkbox.html",
	styleUrl: "./checkbox.scss",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => Checkbox),
			multi: true,
		},
	],
})
export class Checkbox extends ReactiveFormControlBase {
	readonly label = input.required<string>();
	readonly description = input("");

	protected get isChecked(): boolean {
		return !!this.controlOrNull?.value;
	}

	protected onToggle(event: Event): void {
		const control = this.controlOrNull;
		control?.setValue((event.target as HTMLInputElement).checked);
		control?.markAsDirty();
		this.markControlTouched();
	}
}
