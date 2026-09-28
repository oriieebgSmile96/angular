import { ChangeDetectionStrategy, Component, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { SelectOption } from "@bq/core/models/form.model";
import { ReactiveFormControlBase } from "@bq/shared/base/reactive-form-control-base";
import { FieldLabel } from "@bq/shared/components/forms/field-label/field-label";
import { InlineError } from "@bq/shared/components/forms/inline-error/inline-error";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";
import { ValidationMessagePipe } from "@bq/shared/pipes/validation-message.pipe";

import { RadioLayout } from "./radio-group.model";

export type { RadioLayout } from "./radio-group.model";

/** Radio group for a handful of visible choices — service type, budget band. */
@Component({
	selector: "bq-radio-group",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FieldLabel, InlineError, ValidationMessagePipe, TranslatePipe],
	templateUrl: "./radio-group.html",
	styleUrl: "./radio-group.scss",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => RadioGroup),
			multi: true,
		},
	],
})
export class RadioGroup extends ReactiveFormControlBase {
	readonly label = input.required<string>();
	readonly options = input.required<readonly SelectOption[]>();
	readonly layout = input<RadioLayout>("stack");
	readonly hint = input("");

	readonly selectionChange = output<string>();

	protected get selectedId(): string | null {
		const value = this.controlOrNull?.value;
		return typeof value === "string" ? value : null;
	}

	protected choose(option: SelectOption): void {
		if (option.disabled) return;

		const control = this.controlOrNull;
		control?.setValue(option.id);
		control?.markAsDirty();
		this.selectionChange.emit(option.id);
		this.markControlTouched();
	}

	protected optionId(index: number): string {
		return `${this.inputId}-option-${index}`;
	}
}
