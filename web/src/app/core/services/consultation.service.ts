import { Injectable, signal } from "@angular/core";
import { Observable, delay, of, throwError } from "rxjs";

import { TranslationKey } from "@bq/core/i18n/en";
import {
	ConsultationBooking,
	ConsultationRequest,
	VerificationChallenge,
	formatLabel,
	projectTypeLabel,
} from "@bq/core/models/consultation.model";
import { fromDateValue, isSameDay, startOfDay } from "@bq/core/utilities/date";

/**
 * Thrown when the client submits a code that does not match the issued one.
 *
 * Carries a dictionary key rather than a sentence: the view decides which
 * language to render it in, and the message survives a mid-flow switch.
 */
export class InvalidVerificationCodeError extends Error {
	readonly messageKey: TranslationKey = "booking.verify.invalidCode";

	constructor() {
		super("The verification code is incorrect or has expired.");
		this.name = "InvalidVerificationCodeError";
	}
}

export const VERIFICATION_CODE_LENGTH = 6;
const CHALLENGE_TTL_SECONDS = 120;
const NETWORK_LATENCY_MS = 700;

/**
 * Frontend-only stand-in for the atelier's booking API.
 *
 * Every method returns an observable with simulated latency so that swapping in
 * `HttpClient` later is a change to this file alone. The one-time code is
 * generated in the browser and surfaced through `issuedCode()` purely so the
 * flow is demonstrable without an SMS gateway.
 */
@Injectable({ providedIn: "root" })
export class ConsultationService {
	readonly #issuedCode = signal<string | null>(null);

	/** Demo affordance: the code that "was sent by SMS". Never ship this to production. */
	readonly issuedCode = this.#issuedCode.asReadonly();

	requestVerification(mobile: string): Observable<VerificationChallenge> {
		this.#issuedCode.set(randomCode());

		return of<VerificationChallenge>({
			maskedMobile: maskMobile(mobile),
			expiresInSeconds: CHALLENGE_TTL_SECONDS,
		}).pipe(delay(NETWORK_LATENCY_MS));
	}

	confirm(request: ConsultationRequest, code: string): Observable<ConsultationBooking> {
		if (code !== this.#issuedCode()) {
			return throwError(() => new InvalidVerificationCodeError()).pipe(delay(NETWORK_LATENCY_MS));
		}

		this.#issuedCode.set(null);

		return of<ConsultationBooking>({
			reference: randomReference(),
			format: request.format,
			formatLabel: formatLabel(request.format),
			fullName: request.fullName,
			email: request.email,
			mobile: request.mobile,
			projectTypeLabel: projectTypeLabel(request.projectType),
			scheduledAt: new Date(request.preferredAt),
			preferredUntil: preferredUntilDate(request),
		}).pipe(delay(NETWORK_LATENCY_MS));
	}
}

function preferredUntilDate(request: ConsultationRequest): Date | null {
	const from = fromDateValue(request.preferredDateFrom);
	const to = fromDateValue(request.preferredDateTo);
	if (!from || !to || isSameDay(from, to)) return null;

	return startOfDay(to);
}

function randomCode(): string {
	return Array.from({ length: VERIFICATION_CODE_LENGTH }, () => Math.floor(Math.random() * 10)).join("");
}

function randomReference(): string {
	const block = () => Math.floor(1000 + Math.random() * 8999);
	return `BAQ-${block()}-${String(block()).slice(0, 3)}`;
}

/** `+971 50 123 4500` becomes `+97******00`, matching the SMS provider's masking. */
export function maskMobile(mobile: string): string {
	const digits = mobile.replace(/[^\d+]/g, "");
	if (digits.length <= 5) return digits;

	return `${digits.slice(0, 3)}${"*".repeat(Math.max(digits.length - 5, 2))}${digits.slice(-2)}`;
}
