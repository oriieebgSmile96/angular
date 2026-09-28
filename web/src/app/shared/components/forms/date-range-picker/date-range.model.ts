import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** Stored as two local calendar days — no timezone to shift them. */
export interface DateRangeValue {
	readonly from: string;
	readonly to: string;
}

export const EMPTY_DATE_RANGE: DateRangeValue = { from: "", to: "" };

export function isDateRangeComplete(value: unknown): value is DateRangeValue {
	if (!value || typeof value !== "object") return false;
	const range = value as DateRangeValue;
	return typeof range.from === "string" && range.from !== "" && typeof range.to === "string" && range.to !== "";
}

/** Both ends of the range must be chosen before the form can move on. */
export const dateRangeRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
	isDateRangeComplete(control.value) ? null : { required: true };

