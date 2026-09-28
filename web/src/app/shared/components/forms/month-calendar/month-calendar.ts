import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	model,
	output,
	signal,
} from "@angular/core";

import { TranslationService } from "@bq/core/i18n/translation.service";
import {
	addMonths,
	isSameDay,
	startOfDay,
	startOfMonth,
	toMonthLabel,
	weekdayInitials,
} from "@bq/core/utilities/date";
import { Icon } from "@bq/shared/components/icon/icon";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

import { CalendarDay } from "./month-calendar.model";

export type { CalendarDay } from "./month-calendar.model";

const GRID_DAYS = 42;

/**
 * A single-month grid. Owns only the view month and emits picks — the datepicker
 * keeps the value, so the calendar can be reused anywhere a month view is wanted.
 */
@Component({
	selector: "bq-month-calendar",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, TranslatePipe],
	templateUrl: "./month-calendar.html",
	styleUrl: "./month-calendar.scss",
})
export class MonthCalendar {
	readonly #i18n = inject(TranslationService);

	readonly selected = model<Date | null>(null);
	readonly rangeFrom = input<Date | null>(null);
	readonly rangeTo = input<Date | null>(null);
	readonly min = input<Date | null>(null);
	readonly max = input<Date | null>(null);
	/** Return false to grey out a day, e.g. to exclude the weekend. */
	readonly dayFilter = input<(date: Date) => boolean>(() => true);

	readonly daySelected = output<Date>();

	protected readonly viewMonth = signal(startOfMonth(new Date()));

	protected readonly weekdays = computed(() => weekdayInitials(this.#i18n.locale()));
	protected readonly monthLabel = computed(() => toMonthLabel(this.viewMonth(), this.#i18n.locale()));

	protected readonly weeks = computed<CalendarDay[][]>(() => {
		const month = this.viewMonth();
		const selected = this.selected();
		const rangeFrom = this.rangeFrom();
		const rangeTo = this.rangeTo();
		const today = startOfDay(new Date());

		const gridStart = new Date(month);
		gridStart.setDate(1 - month.getDay());

		const days: CalendarDay[] = [];
		for (let offset = 0; offset < GRID_DAYS; offset += 1) {
			const date = new Date(gridStart);
			date.setDate(gridStart.getDate() + offset);
			const day = startOfDay(date);

			const isRangeStart = !!rangeFrom && isSameDay(day, rangeFrom);
			const isRangeEnd = !!rangeTo && isSameDay(day, rangeTo);
			const isInRange =
				!!rangeFrom &&
				!!rangeTo &&
				day > startOfDay(rangeFrom) &&
				day < startOfDay(rangeTo);

			days.push({
				date,
				label: date.getDate(),
				inMonth: date.getMonth() === month.getMonth(),
				isToday: isSameDay(date, today),
				isSelected: (!!selected && isSameDay(date, selected)) || isRangeStart || isRangeEnd,
				isRangeStart,
				isRangeEnd,
				isInRange,
				disabled: this.isDisabled(date),
			});
		}

		return Array.from({ length: 6 }, (_, week) => days.slice(week * 7, week * 7 + 7));
	});

	/** Jump the view to the range start, a single selection, or today when cleared. */
	setViewToSelected(): void {
		this.viewMonth.set(startOfMonth(this.rangeFrom() ?? this.selected() ?? new Date()));
	}

	protected shiftMonth(delta: number): void {
		this.viewMonth.update((month) => addMonths(month, delta));
	}

	protected pick(day: CalendarDay): void {
		if (day.disabled) return;
		this.selected.set(day.date);
		this.daySelected.emit(day.date);
	}

	private isDisabled(date: Date): boolean {
		const min = this.min();
		const max = this.max();
		const day = startOfDay(date);

		if (min && day < startOfDay(min)) return true;
		if (max && day > startOfDay(max)) return true;
		return !this.dayFilter()(day);
	}
}
