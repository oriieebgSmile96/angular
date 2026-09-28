import { Localized } from "@bq/core/i18n/language.model";

/**
 * The shapes a project API would return.
 *
 * Editorial fields are `Localized` because the atelier issues its documents in
 * both languages; identifiers, references and money are not, because a contract
 * reference and a dirham figure read the same in either script.
 */

/** Where a construction stage has got to. Drives its medallion and its chip. */
export type StageStatus = "completed" | "in-progress" | "upcoming";

export interface ProjectStage {
	readonly id: string;
	readonly title: Localized;
	readonly summary: Localized;
	readonly status: StageStatus;
	/** 0–100. Upcoming stages report 0 and hide the bar. */
	readonly completion: number;
	/** ISO date. Actual for finished stages, forecast for the rest. */
	readonly date: string;
}

export interface ProjectSummary {
	readonly name: Localized;
	/** The word set in white ahead of the rest of the name, per the Figma header. */
	readonly nameLead: Localized;
	readonly location: Localized;
	readonly contractRef: string;
	readonly phase: Localized;
	readonly phaseDetail: Localized;
	readonly timelinePercent: number;
	readonly timelineNote: Localized;
	readonly clientName: Localized;
	readonly clientRole: Localized;
}

/** Whether the client has signed off a board sample yet. */
export type ApprovalState = "approved" | "pending";

export interface BoardSample {
	readonly id: string;
	readonly brand: Localized;
	readonly name: Localized;
	/**
	 * The finish, e.g. "Forest". Every sample shares the same product name, so
	 * this is the only thing that tells two cards apart — without it the four
	 * approve buttons are indistinguishable to anyone not seeing the colour.
	 */
	readonly finish: Localized;
	/** Painted colour of the physical sample; a `color.board` token, not a theme colour. */
	readonly swatch: string;
	readonly specs: readonly Localized[];
	readonly state: ApprovalState;
	/** ISO date, present only once approved. */
	readonly approvedOn: string | null;
}

export interface InvoiceLine {
	readonly id: string;
	readonly description: Localized;
	readonly unit: Localized;
	readonly rate: number;
	readonly amount: number;
}

/** Where an instalment sits in the payment plan. */
export type InstalmentState = "paid" | "due" | "scheduled";

export interface Instalment {
	readonly id: string;
	readonly label: Localized;
	readonly amount: number;
	readonly state: InstalmentState;
}

export interface PaymentMethod {
	readonly bank: Localized;
	readonly iban: string;
	readonly company: Localized;
	readonly reference: string;
}

export interface Invoice {
	readonly number: string;
	readonly issuedOn: string;
	readonly dueOn: string;
	readonly lines: readonly InvoiceLine[];
	readonly vatRate: number;
	readonly instalments: readonly Instalment[];
	readonly payment: PaymentMethod;
}
