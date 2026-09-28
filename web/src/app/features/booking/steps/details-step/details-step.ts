import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import {
	CONSULTATION_FORMATS,
	CONSULTATION_TIME_SLOTS,
	PROJECT_TYPES,
} from "@bq/core/models/consultation.model";
import { toDateValue } from "@bq/core/utilities/date";
import { BookingForm } from "@bq/features/booking/booking-form";
import { Checkbox } from "@bq/shared/components/forms/checkbox/checkbox";
import { DateRangePicker } from "@bq/shared/components/forms/date-range-picker/date-range-picker";
import { InputField } from "@bq/shared/components/forms/input/input";
import { RadioGroup } from "@bq/shared/components/forms/radio-group/radio-group";
import { Select } from "@bq/shared/components/forms/select/select";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-details-step",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ReactiveFormsModule,
		ButtonDirective,
		InputField,
		Select,
		DateRangePicker,
		RadioGroup,
		Checkbox,
		TranslatePipe,
	],
	templateUrl: "./details-step.html",
	styleUrl: "./details-step.scss",
})
export class DetailsStep {
	readonly form = input.required<BookingForm>();
	readonly pending = input(false);

	readonly submitted = output<void>();

	protected readonly formats = CONSULTATION_FORMATS;
	protected readonly projectTypes = PROJECT_TYPES;
	protected readonly timeSlots = CONSULTATION_TIME_SLOTS;

	/** Same-day bookings are not offered; the atelier prepares the day before. */
	protected readonly earliestDate = toDateValue(addDays(new Date(), 1));

	protected onSubmit(): void {
		this.submitted.emit();
	}
}

function addDays(date: Date, days: number): Date {
	const shifted = new Date(date);
	shifted.setDate(shifted.getDate() + days);
	return shifted;
}
