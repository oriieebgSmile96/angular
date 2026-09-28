import { Localized } from "@bq/core/i18n/language.model";
import { SelectOption } from "@bq/core/models/form.model";

export type ConsultationFormat = "in-atelier" | "video-call" | "site-visit";

export type ProjectType = "full-residence" | "living-spaces" | "kitchen-dining" | "majlis" | "commercial";

export interface ConsultationFormatOption extends SelectOption {
	readonly id: ConsultationFormat;
	readonly description: Localized;
}

export interface ProjectTypeOption extends SelectOption {
	readonly id: ProjectType;
}

/** What the client fills in on step one of the booking dialog. */
export interface ConsultationRequest {
	readonly format: ConsultationFormat;
	readonly fullName: string;
	readonly email: string;
	readonly mobile: string;
	readonly projectType: ProjectType;
	readonly preferredDateFrom: string;
	readonly preferredDateTo: string;
	readonly preferredTime: string;
	readonly preferredAt: string;
	readonly consent: boolean;
}

/** The verification challenge issued for a mobile number. */
export interface VerificationChallenge {
	readonly maskedMobile: string;
	readonly expiresInSeconds: number;
}

/**
 * A confirmed consultation, as it would come back from the atelier's CRM.
 *
 * The labels stay localized rather than resolved: a client who books in English
 * and then switches to Arabic should see the summary follow them.
 */
export interface ConsultationBooking {
	readonly reference: string;
	readonly format: ConsultationFormat;
	readonly formatLabel: Localized;
	readonly fullName: string;
	readonly email: string;
	readonly mobile: string;
	readonly projectTypeLabel: Localized;
	readonly scheduledAt: Date;
	/** Last day of the client's preferred window, when it spans more than one day. */
	readonly preferredUntil: Date | null;
}

export const CONSULTATION_FORMATS: readonly ConsultationFormatOption[] = [
	{
		id: "in-atelier",
		label: { en: "In-Atelier", ar: "في الأتيليه" },
		description: {
			en: "Meet our designers at the Dubai atelier.",
			ar: "قابل مصممينا في أتيليه دبي.",
		},
	},
	{
		id: "video-call",
		label: { en: "Video Call", ar: "مكالمة مرئية" },
		description: {
			en: "A live walkthrough from anywhere.",
			ar: "جولة مباشرة من أي مكان.",
		},
	},
	{
		id: "site-visit",
		label: { en: "Site Visit", ar: "زيارة الموقع" },
		description: {
			en: "Our team visits your residence.",
			ar: "يزور فريقنا مسكنك.",
		},
	},
];

/** The atelier receives clients on the hour, Sunday to Thursday. */
export const CONSULTATION_TIME_SLOTS: readonly SelectOption[] = [
	{ id: "10:00", label: { en: "10:00 — Morning", ar: "١٠:٠٠ — صباحاً" } },
	{ id: "11:30", label: { en: "11:30 — Late morning", ar: "١١:٣٠ — قبل الظهر" } },
	{ id: "13:00", label: { en: "13:00 — Early afternoon", ar: "١:٠٠ — بعد الظهر" } },
	{ id: "15:00", label: { en: "15:00 — Afternoon", ar: "٣:٠٠ — العصر" } },
	{ id: "17:00", label: { en: "17:00 — Evening", ar: "٥:٠٠ — المساء" } },
];

export const PROJECT_TYPES: readonly ProjectTypeOption[] = [
	{ id: "full-residence", label: { en: "Full residence", ar: "مسكن متكامل" } },
	{ id: "living-spaces", label: { en: "Living spaces", ar: "مساحات المعيشة" } },
	{ id: "kitchen-dining", label: { en: "Kitchen & dining", ar: "المطبخ والطعام" } },
	{ id: "majlis", label: { en: "Majlis & reception", ar: "المجلس والاستقبال" } },
	{ id: "commercial", label: { en: "Commercial space", ar: "مساحة تجارية" } },
];

const FALLBACK_FORMAT: Localized = { en: "Consultation", ar: "استشارة" };
const FALLBACK_PROJECT: Localized = { en: "Residence", ar: "مسكن" };

export function formatLabel(format: ConsultationFormat): Localized {
	return CONSULTATION_FORMATS.find((option) => option.id === format)?.label ?? FALLBACK_FORMAT;
}

export function projectTypeLabel(projectType: ProjectType): Localized {
	return PROJECT_TYPES.find((option) => option.id === projectType)?.label ?? FALLBACK_PROJECT;
}
