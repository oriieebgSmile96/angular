import { FormControl, FormGroup, Validators } from "@angular/forms";

import { ConsultationFormat, ConsultationRequest, ProjectType } from "@bq/core/models/consultation.model";
import {
	DateRangeValue,
	EMPTY_DATE_RANGE,
	dateRangeRequired,
} from "@bq/shared/components/forms/date-range-picker/date-range.model";

export interface BookingFormControls {
	format: FormControl<ConsultationFormat>;
	fullName: FormControl<string>;
	email: FormControl<string>;
	mobile: FormControl<string>;
	projectType: FormControl<ProjectType>;
	/** Preferred availability window, as written by the date-range picker. */
	preferredDateRange: FormControl<DateRangeValue>;
	/** `HH:mm`, one of the atelier's published slots. */
	preferredTime: FormControl<string>;
	consent: FormControl<boolean>;
}

export type BookingForm = FormGroup<BookingFormControls>;

/** UAE mobile numbers, written with or without spaces: +971 5x xxx xxxx. */
const UAE_MOBILE = /^\+?[\d\s-]{9,17}$/;

export function createBookingForm(): BookingForm {
	return new FormGroup<BookingFormControls>({
		format: new FormControl<ConsultationFormat>("in-atelier", { nonNullable: true }),
		fullName: new FormControl("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(2)],
		}),
		email: new FormControl("", {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		mobile: new FormControl("", {
			nonNullable: true,
			validators: [Validators.required, Validators.pattern(UAE_MOBILE)],
		}),
		projectType: new FormControl<ProjectType>("full-residence", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		preferredDateRange: new FormControl(EMPTY_DATE_RANGE, {
			nonNullable: true,
			validators: [dateRangeRequired],
		}),
		preferredTime: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
		consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
	});
}

export function toConsultationRequest(form: BookingForm): ConsultationRequest {
	const { preferredDateRange, preferredTime, ...rest } = form.getRawValue();

	return {
		...rest,
		preferredDateFrom: preferredDateRange.from,
		preferredDateTo: preferredDateRange.to,
		preferredTime,
		preferredAt: `${preferredDateRange.from}T${preferredTime}`,
	};
}
