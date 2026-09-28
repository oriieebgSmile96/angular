import { ConnectedPosition, OverlayModule } from "@angular/cdk/overlay";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	inject,
	input,
	output,
	signal,
	viewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { TranslationService } from "@bq/core/i18n/translation.service";
import { fromDateValue, toDateValue, toDisplayDate } from "@bq/core/utilities/date";
import { ReactiveFormControlBase } from "@bq/shared/base/reactive-form-control-base";
import { FieldLabel } from "@bq/shared/components/forms/field-label/field-label";
import { InlineError } from "@bq/shared/components/forms/inline-error/inline-error";
import { MonthCalendar } from "@bq/shared/components/forms/month-calendar/month-calendar";
import { Icon } from "@bq/shared/components/icon/icon";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";
import { ValidationMessagePipe } from "@bq/shared/pipes/validation-message.pipe";

import { DateBound } from "./datepicker.model";

export type { DateBound } from "./datepicker.model";

/**
 * Date field with a CDK overlay calendar.
 *
 * The trigger is read-only by design: consultations are booked from the calendar
 * so the stored value is always a real, in-range day. The control holds a
 * `YYYY-MM-DD` string; the trigger shows the long form.
 */
@Component({
	selector: "bq-datepicker",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		OverlayModule,
		FieldLabel,
		InlineError,
		Icon,
		MonthCalendar,
		ValidationMessagePipe,
		TranslatePipe,
	],
	templateUrl: "./datepicker.html",
	styleUrl: "./datepicker.scss",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => Datepicker),
			multi: true,
		},
	],
})
export class Datepicker extends ReactiveFormControlBase {
	readonly #i18n = inject(TranslationService);

	readonly label = input.required<string>();
	/** Left empty to fall back to the translated default in the template. */
	readonly placeholder = input("");
	readonly hint = input("");
	readonly minDate = input<DateBound>(null);
	readonly maxDate = input<DateBound>(null);
	readonly showClear = input(true);
	/** Excludes Friday and Saturday, the atelier's closed days. */
	readonly businessDaysOnly = input(false);

	readonly dateSelected = output<string>();

	protected readonly isOpen = signal(false);

	protected readonly calendar = viewChild(MonthCalendar);

	protected readonly panelPositions: ConnectedPosition[] = [
		{ originX: "start", originY: "bottom", overlayX: "start", overlayY: "top", offsetY: 8 },
		{ originX: "start", originY: "top", overlayX: "start", overlayY: "bottom", offsetY: -8 },
		{ originX: "end", originY: "bottom", overlayX: "end", overlayY: "top", offsetY: 8 },
	];

	protected readonly resolvedMin = computed(() => fromDateValue(this.minDate()));
	protected readonly resolvedMax = computed(() => fromDateValue(this.maxDate()));

	protected readonly dayFilter = (date: Date): boolean => {
		if (!this.businessDaysOnly()) return true;
		const day = date.getDay();
		return day !== 5 && day !== 6;
	};

	protected get selectedDate(): Date | null {
		return fromDateValue(this.controlOrNull?.value);
	}

	protected get displayValue(): string {
		const date = this.selectedDate;
		return date ? toDisplayDate(date, this.#i18n.locale()) : "";
	}

	protected open(): void {
		if (this.isDisabled) return;
		this.isOpen.set(true);
		queueMicrotask(() => this.calendar()?.setViewToSelected());
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

	protected onDayPicked(date: Date): void {
		const value = toDateValue(date);
		const control = this.controlOrNull;

		control?.setValue(value);
		control?.markAsDirty();
		this.dateSelected.emit(value);
		this.close();
	}

	protected clear(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const control = this.controlOrNull;
		control?.setValue(null);
		control?.markAsDirty();
		this.isOpen.set(false);
		this.markControlTouched();
	}

	protected onTriggerKeydown(event: KeyboardEvent): void {
		if (event.key === "Escape" && this.isOpen()) {
			event.preventDefault();
			this.close();
			return;
		}

		if (!this.isOpen() && ["ArrowDown", "Enter", " "].includes(event.key)) {
			event.preventDefault();
			this.open();
		}
	}
}
