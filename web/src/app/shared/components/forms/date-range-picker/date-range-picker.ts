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
import { fromDateValue, isSameDay, startOfDay, toDateValue, toDisplayDate, toDisplayDateRange } from "@bq/core/utilities/date";
import { ReactiveFormControlBase } from "@bq/shared/base/reactive-form-control-base";
import { DateBound } from "@bq/shared/components/forms/datepicker/datepicker.model";
import { FieldLabel } from "@bq/shared/components/forms/field-label/field-label";
import { InlineError } from "@bq/shared/components/forms/inline-error/inline-error";
import { MonthCalendar } from "@bq/shared/components/forms/month-calendar/month-calendar";
import { Icon } from "@bq/shared/components/icon/icon";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";
import { ValidationMessagePipe } from "@bq/shared/pipes/validation-message.pipe";

import {
	DateRangeValue,
	EMPTY_DATE_RANGE,
	dateRangeRequired,
	isDateRangeComplete,
} from "./date-range.model";

export type { DateRangeValue } from "./date-range.model";

/**
 * Preferred-date range with a single calendar.
 *
 * The client taps a start day, then an end day; both must fall on working days
 * when `businessDaysOnly` is on. The trigger shows long-form dates in the
 * active locale — e.g. "Tuesday, 17 November 2026" or the Arabic equivalent.
 */
@Component({
	selector: "bq-date-range-picker",
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
	templateUrl: "./date-range-picker.html",
	styleUrl: "./date-range-picker.scss",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DateRangePicker),
			multi: true,
		},
	],
})
export class DateRangePicker extends ReactiveFormControlBase {
	readonly #i18n = inject(TranslationService);

	override get isRequired(): boolean {
		if (super.isRequired) return true;

		const control = this.controlOrNull;
		if (!control || control.disabled) return false;

		return control.hasValidator(dateRangeRequired);
	}

	readonly label = input.required<string>();
	readonly placeholder = input("");
	readonly hint = input("");
	readonly minDate = input<DateBound>(null);
	readonly maxDate = input<DateBound>(null);
	readonly showClear = input(true);
	/** Excludes Friday and Saturday, the atelier's closed days. */
	readonly businessDaysOnly = input(false);

	readonly rangeSelected = output<DateRangeValue>();

	protected readonly isOpen = signal(false);
	readonly #draftFrom = signal<Date | null>(null);
	readonly #draftTo = signal<Date | null>(null);

	protected readonly calendar = viewChild(MonthCalendar);

	protected readonly panelPositions: ConnectedPosition[] = [
		{ originX: "start", originY: "bottom", overlayX: "start", overlayY: "top", offsetY: 8 },
		{ originX: "start", originY: "top", overlayX: "start", overlayY: "bottom", offsetY: -8 },
		{ originX: "end", originY: "bottom", overlayX: "end", overlayY: "top", offsetY: 8 },
	];

	protected readonly resolvedMin = computed(() => fromDateValue(this.minDate()));
	protected readonly resolvedMax = computed(() => fromDateValue(this.maxDate()));

	protected readonly rangeFrom = computed(() => {
		const draft = this.#draftFrom();
		if (this.isOpen()) return draft;
		return fromDateValue(this.value().from);
	});

	protected readonly rangeTo = computed(() => {
		const draft = this.#draftTo();
		if (this.isOpen()) return draft;
		return fromDateValue(this.value().to);
	});

	protected readonly dayFilter = (date: Date): boolean => {
		if (!this.businessDaysOnly()) return true;
		const day = date.getDay();
		return day !== 5 && day !== 6;
	};

	protected get displayValue(): string {
		const { from, to } = this.value();
		const fromDate = fromDateValue(from);
		const toDate = fromDateValue(to);
		const locale = this.#i18n.locale();

		if (fromDate && toDate) return toDisplayDateRange(fromDate, toDate, locale);
		if (fromDate) return toDisplayDate(fromDate, locale);

		return "";
	}

	protected open(): void {
		if (this.isDisabled) return;

		const current = this.value();
		this.#draftFrom.set(fromDateValue(current.from));
		this.#draftTo.set(fromDateValue(current.to));
		this.isOpen.set(true);
		queueMicrotask(() => this.calendar()?.setViewToSelected());
	}

	protected close(markTouched = true): void {
		if (!this.isOpen()) return;
		this.isOpen.set(false);
		this.#draftFrom.set(null);
		this.#draftTo.set(null);
		if (markTouched) this.markControlTouched();
	}

	protected toggle(): void {
		if (this.isOpen()) this.close();
		else this.open();
	}

	protected onDayPicked(date: Date): void {
		const from = this.#draftFrom();
		const to = this.#draftTo();

		// Tap the lone start day again to cancel before choosing an end.
		if (from && !to && isSameDay(from, date)) {
			this.#draftFrom.set(null);
			return;
		}

		if (!from || to) {
			this.#draftFrom.set(date);
			this.#draftTo.set(null);
			return;
		}

		let start = from;
		let end = date;
		if (startOfDay(end) < startOfDay(start)) [start, end] = [end, start];

		const value: DateRangeValue = { from: toDateValue(start), to: toDateValue(end) };
		const control = this.controlOrNull;

		control?.setValue(value);
		control?.markAsDirty();
		this.rangeSelected.emit(value);
		this.close();
	}

	protected clear(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const control = this.controlOrNull;
		control?.setValue(EMPTY_DATE_RANGE);
		control?.markAsDirty();
		this.#draftFrom.set(null);
		this.#draftTo.set(null);
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

	private value(): DateRangeValue {
		const raw = this.controlOrNull?.value;
		if (isDateRangeComplete(raw)) return raw;

		if (raw && typeof raw === "object") {
			const partial = raw as DateRangeValue;
			return { from: partial.from ?? "", to: partial.to ?? "" };
		}

		return EMPTY_DATE_RANGE;
	}
}
