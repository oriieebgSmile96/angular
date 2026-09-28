export interface CalendarDay {
	readonly date: Date;
	readonly label: number;
	readonly inMonth: boolean;
	readonly isToday: boolean;
	readonly isSelected: boolean;
	readonly isRangeStart: boolean;
	readonly isRangeEnd: boolean;
	readonly isInRange: boolean;
	readonly disabled: boolean;
}
