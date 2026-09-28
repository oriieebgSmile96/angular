import { ConnectedPosition, OverlayModule } from "@angular/cdk/overlay";
import { ChangeDetectionStrategy, Component, forwardRef, input, output, signal } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { SelectOption } from "@bq/core/models/form.model";
import { ReactiveFormControlBase } from "@bq/shared/base/reactive-form-control-base";
import { FieldLabel } from "@bq/shared/components/forms/field-label/field-label";
import { InlineError } from "@bq/shared/components/forms/inline-error/inline-error";
import { Icon } from "@bq/shared/components/icon/icon";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";
import { ValidationMessagePipe } from "@bq/shared/pipes/validation-message.pipe";

/**
 * Listbox select built on a CDK connected overlay rather than a native `<select>`,
 * so the panel can carry the atelier's type and gold selection state.
 */
@Component({
	selector: "bq-select",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [OverlayModule, FieldLabel, InlineError, Icon, ValidationMessagePipe, TranslatePipe],
	templateUrl: "./select.html",
	styleUrl: "./select.scss",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => Select),
			multi: true,
		},
	],
})
export class Select extends ReactiveFormControlBase {
	readonly label = input.required<string>();
	readonly options = input.required<readonly SelectOption[]>();
	/** Left empty to fall back to the translated default in the template. */
	readonly placeholder = input("");
	readonly hint = input("");
	readonly showClear = input(false);

	readonly selectionChange = output<string | null>();

	protected readonly isOpen = signal(false);
	protected readonly activeIndex = signal(-1);

	protected readonly panelPositions: ConnectedPosition[] = [
		{ originX: "start", originY: "bottom", overlayX: "start", overlayY: "top", offsetY: 6 },
		{ originX: "start", originY: "top", overlayX: "start", overlayY: "bottom", offsetY: -6 },
	];

	/**
	 * Read straight off the control rather than mirroring into a signal: the base
	 * class already marks this component for check whenever the control changes,
	 * so a reset from the host form is reflected without a second source of truth.
	 */
	protected get selected(): SelectOption | null {
		const value = this.controlOrNull?.value;
		return this.options().find((option) => option.id === value) ?? null;
	}

	protected open(): void {
		if (this.isDisabled) return;
		this.activeIndex.set(this.options().findIndex((option) => option.id === this.selected?.id));
		this.isOpen.set(true);
	}

	protected close(markTouched = true): void {
		if (!this.isOpen()) return;
		this.isOpen.set(false);
		if (markTouched) this.markControlTouched();
	}

	protected toggle(): void {
		if (this.isOpen()) this.close();
		else this.open();
	}

	protected choose(option: SelectOption): void {
		if (option.disabled) return;

		const control = this.controlOrNull;
		control?.setValue(option.id);
		control?.markAsDirty();
		this.selectionChange.emit(option.id);
		this.close();
	}

	protected clear(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const control = this.controlOrNull;
		control?.setValue(null);
		control?.markAsDirty();
		this.selectionChange.emit(null);
		this.isOpen.set(false);
		this.markControlTouched();
	}

	protected onTriggerKeydown(event: KeyboardEvent): void {
		if (!this.isOpen()) {
			if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
				event.preventDefault();
				this.open();
			}
			return;
		}

		const options = this.options();

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				this.activeIndex.update((index) => Math.min(index + 1, options.length - 1));
				break;
			case "ArrowUp":
				event.preventDefault();
				this.activeIndex.update((index) => Math.max(index - 1, 0));
				break;
			case "Home":
				event.preventDefault();
				this.activeIndex.set(0);
				break;
			case "End":
				event.preventDefault();
				this.activeIndex.set(options.length - 1);
				break;
			case "Enter":
			case " ": {
				event.preventDefault();
				const option = options[this.activeIndex()];
				if (option) this.choose(option);
				break;
			}
			case "Escape":
				event.preventDefault();
				this.close();
				break;
		}
	}

	protected optionId(index: number): string {
		return `${this.listboxId}-option-${index}`;
	}
}
