import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";

import { TranslationService } from "@bq/core/i18n/translation.service";
import { ConsultationBooking } from "@bq/core/models/consultation.model";
import { isSameDay, startOfDay, toDisplayDateRange } from "@bq/core/utilities/date";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
	hour: "numeric",
	minute: "2-digit",
};

@Component({
	selector: "bq-summary-step",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonDirective, TranslatePipe],
	templateUrl: "./summary-step.html",
	styleUrl: "./summary-step.scss",
})
export class SummaryStep {
	readonly #i18n = inject(TranslationService);

	readonly booking = input.required<ConsultationBooking>();

	readonly portfolioRequested = output<void>();
	readonly calendarRequested = output<void>();

	// `DatePipe` would need a locale registered per language; `Intl` already has them.
	protected readonly scheduledAt = computed(() => {
		const booking = this.booking();
		const locale = this.#i18n.locale();
		const start = booking.scheduledAt;
		const until = booking.preferredUntil;
		const time = this.#i18n.formatDate(start, TIME_FORMAT);

		if (!until || isSameDay(start, until)) {
			return `${this.#i18n.formatDate(start, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ${time}`;
		}

		return `${toDisplayDateRange(startOfDay(start), startOfDay(until), locale)} · ${time}`;
	});
}
