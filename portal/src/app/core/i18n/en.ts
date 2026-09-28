/**
 * English copy for the portal's chrome.
 *
 * Project content — stage names, board specs, invoice lines — is not here. It
 * lives in `core/data/project.data.ts` as `Localized` values, because it is data
 * the atelier issues per project rather than interface text. Both are read
 * through the same `t` pipe.
 *
 * This object defines the key set; `ar.ts` is typed against it, so a missing
 * Arabic key is a compile error rather than a blank line on screen.
 */
export const en = {
	"app.skipToContent": "Skip to project detail",
	"app.mainLabel": "Project dashboard",

	"header.clientPortal": "Client Portal",
	"header.contractRef": "Contract Ref. {ref}",
	"header.statsLabel": "Project status",
	"header.projectStage": "Project Stage",
	"header.timeline": "Timeline",
	"header.client": "Client",

	"theme.toDark": "Switch to dark theme",
	"theme.toLight": "Switch to light theme",
	"language.switch": "التبديل إلى العربية",

	"timeline.eyebrow": "Project Execution",
	"timeline.heading": "Construction Timeline",
	"timeline.lede": "Live progress tracking across all stages for {project}, {location}.",
	"timeline.status.completed": "Completed",
	"timeline.status.inProgress": "In progress",
	"timeline.status.upcoming": "Upcoming",
	"timeline.completion": "Completion",
	"timeline.estimated": "Est {date}",
	"timeline.progressLabel": "{stage} — {percent}% complete",

	"boards.eyebrow": "Material Sign-off",
	"boards.heading": "Board Sample Approvals",
	"boards.lede":
		"Review each premium board specification and issue digital approval before procurement begins",
	"boards.approved": "Approved",
	"boards.approvedOn": "Approved - {date}",
	"boards.approve": "Approve material",
	"boards.approveLabel": "Approve {name}",
	"boards.specsLabel": "Specification",
	"boards.approvedAnnouncement": "{name} approved on {date}",

	"invoice.eyebrow": "Progressive Incoming",
	"invoice.heading": "Phase 2 Progress Invoice",
	"invoice.lede": "Billing board {project}, {location}.",
	"invoice.number": "Invoice No.",
	"invoice.issued": "Issue Date: {date}",
	"invoice.due": "Due Date:",
	"invoice.total": "Invoice Total",
	"invoice.awaitingPayment": "Awaiting payment",
	"invoice.linesLabel": "Invoice line items",
	"invoice.description": "Description",
	"invoice.unit": "Unit",
	"invoice.rate": "Rate (AED)",
	"invoice.amount": "Amount",
	"invoice.subtotal": "Subtotal",
	"invoice.vat": "VAT ({rate}%)",
	"invoice.schedule": "Payment Schedule",
	"invoice.method": "Payment Method",
	"invoice.balanceDue": "Balance Due Now",
	"invoice.instalment.paid": "Paid",
	"invoice.instalment.due": "Due now",
	"invoice.instalment.scheduled": "Scheduled",
	"invoice.bankTransfer": "Bank Transfer",
	"invoice.company": "Company",
	"invoice.reference": "Reference",
	"invoice.confirmPayment": "Confirm payment sent",
	"invoice.paymentConfirmed": "Payment confirmation received",
	"invoice.downloadPdf": "Download PDF invoice",

	"currency.aed": "AED {amount}",
} as const;

export type TranslationKey = keyof typeof en;
export type Dictionary = Readonly<Record<TranslationKey, string>>;
