import { DialogRef } from "@angular/cdk/dialog";
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { ATELIER } from "@bq/core/data/atelier.data";
import { TranslationKey } from "@bq/core/i18n/en";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { ConsultationBooking } from "@bq/core/models/consultation.model";
import { ConsultationService, InvalidVerificationCodeError } from "@bq/core/services/consultation.service";
import { downloadConsultationInvite } from "@bq/core/utilities/calendar";
import { createBookingForm, toConsultationRequest } from "@bq/features/booking/booking-form";
import { ConfirmedStep } from "@bq/features/booking/steps/confirmed-step/confirmed-step";
import { DetailsStep } from "@bq/features/booking/steps/details-step/details-step";
import { SummaryStep } from "@bq/features/booking/steps/summary-step/summary-step";
import { VerifyStep } from "@bq/features/booking/steps/verify-step/verify-step";
import { Icon } from "@bq/shared/components/icon/icon";
import { Stepper } from "@bq/shared/components/stepper/stepper";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

type BookingStep = "details" | "verify" | "confirmed" | "summary";

/** What the caller learns when the dialog closes. */
export interface BookingDialogResult {
	readonly booking: ConsultationBooking | null;
	/** Set when the visitor asked to be taken somewhere after booking. */
	readonly navigateTo?: "portfolio";
}

const STEP_LABELS: readonly TranslationKey[] = [
	"booking.step.details",
	"booking.step.verify",
	"booking.step.confirmed",
];
const STEP_INDEX: Record<BookingStep, number> = { details: 0, verify: 1, confirmed: 2, summary: 2 };

@Component({
	selector: "bq-booking-dialog",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Stepper, DetailsStep, VerifyStep, ConfirmedStep, SummaryStep, Icon, TranslatePipe],
	templateUrl: "./booking-dialog.html",
	styleUrl: "./booking-dialog.scss",
})
export class BookingDialog {
	readonly #dialogRef = inject<DialogRef<BookingDialogResult>>(DialogRef);
	readonly #consultations = inject(ConsultationService);
	readonly #destroyRef = inject(DestroyRef);
	readonly #i18n = inject(TranslationService);

	protected readonly form = createBookingForm();
	protected readonly step = signal<BookingStep>("details");
	protected readonly pending = signal(false);
	protected readonly error = signal<TranslationKey | null>(null);
	protected readonly maskedMobile = signal("");
	protected readonly expiresAt = signal(0);
	protected readonly booking = signal<ConsultationBooking | null>(null);

	protected readonly stepLabels = STEP_LABELS;
	protected readonly activeIndex = computed(() => STEP_INDEX[this.step()]);
	protected readonly demoCode = this.#consultations.issuedCode;

	protected sendCode(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.#requestChallenge(() => this.step.set("verify"));
	}

	protected resendCode(): void {
		this.#requestChallenge();
	}

	protected verify(code: string): void {
		if (this.pending()) return;

		this.pending.set(true);
		this.error.set(null);

		this.#consultations
			.confirm(toConsultationRequest(this.form), code)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe({
				next: (booking) => {
					this.booking.set(booking);
					this.step.set("confirmed");
					this.pending.set(false);
				},
				error: (failure: InvalidVerificationCodeError) => {
					this.error.set(failure.messageKey);
					this.pending.set(false);
				},
			});
	}

	protected editNumber(): void {
		this.error.set(null);
		this.step.set("details");
	}

	protected showSummary(): void {
		this.step.set("summary");
	}

	protected addToCalendar(): void {
		const booking = this.booking();
		if (!booking) return;

		downloadConsultationInvite(booking, {
			location: this.#i18n.resolve(ATELIER.location),
			formatLabel: this.#i18n.resolve(booking.formatLabel),
			projectTypeLabel: this.#i18n.resolve(booking.projectTypeLabel),
		});
	}

	protected close(navigateTo?: "portfolio"): void {
		this.#dialogRef.close({ booking: this.booking(), navigateTo });
	}

	#requestChallenge(onSuccess?: () => void): void {
		this.pending.set(true);
		this.error.set(null);

		this.#consultations
			.requestVerification(this.form.controls.mobile.value)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((challenge) => {
				this.maskedMobile.set(challenge.maskedMobile);
				this.expiresAt.set(Date.now() + challenge.expiresInSeconds * 1000);
				this.pending.set(false);
				onSuccess?.();
			});
	}
}
