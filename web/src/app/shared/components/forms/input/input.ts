import {
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	output,
	signal,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

import { ReactiveFormControlBase } from "@bq/shared/base/reactive-form-control-base";
import { FieldLabel } from "@bq/shared/components/forms/field-label/field-label";
import { InlineError } from "@bq/shared/components/forms/inline-error/inline-error";
import { Icon } from "@bq/shared/components/icon/icon";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";
import { ValidationMessagePipe } from "@bq/shared/pipes/validation-message.pipe";

import { InputContentType, InputKind } from "./input.model";

export type { InputContentType, InputKind } from "./input.model";

/**
 * Text, email, telephone, password and multi-line field.
 *
 * Label, required marker, character counter and error text are all derived from
 * the bound `FormControl`, so a host only supplies the label and the control name.
 */
@Component({
	selector: "bq-input",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, FieldLabel, InlineError, Icon, ValidationMessagePipe, TranslatePipe],
	templateUrl: "./input.html",
	styleUrl: "./input.scss",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputField),
			multi: true,
		},
	],
})
export class InputField extends ReactiveFormControlBase {
	readonly label = input.required<string>();
	readonly kind = input<InputKind>("textbox");
	readonly contentType = input<InputContentType>("text");
	readonly placeholder = input("");
	readonly hint = input("");
	readonly autocomplete = input("off");
	readonly readonly = input(false);
	readonly rows = input(4);
	readonly maxLength = input<number | null>(null);
	readonly showCharCount = input(false);

	readonly committed = output<string>();

	protected readonly passwordVisible = signal(false);

	protected readonly isPassword = computed(() => this.contentType() === "password");

	protected readonly htmlType = computed(() => {
		if (this.isPassword()) return this.passwordVisible() ? "text" : "password";
		return this.contentType();
	});

	protected readonly inputMode = computed(() => {
		switch (this.contentType()) {
			case "email":
				return "email";
			case "tel":
				return "tel";
			case "number":
				return "numeric";
			default:
				return null;
		}
	});

	protected get charCount(): number {
		return String(this.controlOrNull?.value ?? "").length;
	}

	protected togglePasswordVisibility(): void {
		this.passwordVisible.update((visible) => !visible);
	}

	protected onBlur(): void {
		this.markControlTouched();
	}
}
