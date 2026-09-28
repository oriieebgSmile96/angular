import { TranslationKey } from "@/i18n/en";

/**
 * Frontend-only consultation booking.
 *
 * Mirrors the web app's service contract so both clients can be pointed at the
 * same API later. `issueCode` returns the code it "sent" purely so the demo
 * build can show it — a real gateway would return nothing.
 */

export const CODE_LENGTH = 6;
const LATENCY_MS = 700;

export interface ConsultationDraft {
	fullName: string;
	mobile: string;
	email: string;
	projectSite: string;
}

export interface ConsultationBooking extends ConsultationDraft {
	reference: string;
}

export type FieldName = keyof ConsultationDraft | "code";

/**
 * Validation failures as dictionary keys rather than sentences.
 *
 * The screen decides which language to render them in, so an error already on
 * screen re-reads correctly when the visitor switches language.
 */
export type ValidationErrors = Partial<Record<FieldName, TranslationKey>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE = /^\+?[\d\s-]{9,17}$/;

export function validateDraft(
	draft: ConsultationDraft,
	code: string,
	expected: string | null,
): ValidationErrors {
	const errors: ValidationErrors = {};

	if (draft.fullName.trim().length < 2) errors.fullName = "validation.fullName";
	if (!MOBILE.test(draft.mobile.trim())) errors.mobile = "validation.mobile";
	if (!EMAIL.test(draft.email.trim())) errors.email = "validation.email";
	if (draft.projectSite.trim().length < 3) errors.projectSite = "validation.projectSite";

	if (!expected) errors.code = "validation.codeMissing";
	else if (code.trim().length !== CODE_LENGTH) errors.code = "validation.codeLength";
	else if (code.trim() !== expected) errors.code = "validation.codeMismatch";

	return errors;
}

export async function issueCode(): Promise<string> {
	await wait(LATENCY_MS);
	return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * 10)).join("");
}

export async function confirmBooking(draft: ConsultationDraft): Promise<ConsultationBooking> {
	await wait(LATENCY_MS);
	const block = () => Math.floor(1000 + Math.random() * 8999);
	return { ...draft, reference: `BAQ-${block()}-${String(block()).slice(0, 3)}` };
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
