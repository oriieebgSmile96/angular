import { Localized } from "@bq/core/i18n/language.model";
import { BoardSample, Invoice, ProjectStage, ProjectSummary } from "@bq/core/models/project.model";

/**
 * The Villa Al Nehal project, transcribed from the Figma file
 * "Luxury client portal Dashboard" (Vet8GHmC20x6XOiEuwC8rn).
 *
 * Frontend only: this is the shape a project API would return, so pointing the
 * portal at a real backend is a change to one module.
 */

export const ATELIER = {
	legalName: {
		en: "Bariq Al Aqeeq Artistic Works",
		ar: "بريق العقيق للأعمال الفنية",
	} satisfies Localized,
	registration: {
		en: "Bariq Al Aqeeq Artistic Works, Dubai, UAE , TRN: 000 0000 0000 003",
		ar: "بريق العقيق للأعمال الفنية، دبي، الإمارات العربية المتحدة، الرقم الضريبي: 000 0000 0000 003",
	} satisfies Localized,
	confidentiality: {
		en: "Confidential Client Portal 2026",
		ar: "بوابة العملاء السرية ٢٠٢٦",
	} satisfies Localized,
} as const;

export const PROJECT: ProjectSummary = {
	nameLead: { en: "Villa", ar: "فيلا" },
	name: { en: "Al Nehal", ar: "النهال" },
	location: { en: "Emirates Hills, Dubai", ar: "تلال الإمارات، دبي" },
	contractRef: "VLR-2026-0143",
	phase: { en: "Phase 2", ar: "المرحلة ٢" },
	phaseDetail: { en: "Framing & Structure", ar: "الهيكل والتقسيمات" },
	timelinePercent: 55,
	timelineNote: { en: "On time", ar: "ضمن الجدول" },
	clientName: { en: "Mr. Latif", ar: "السيد لطيف" },
	clientRole: { en: "Villa Owner", ar: "مالك الفيلا" },
};

const STAGE_SUMMARY: Localized = {
	en: "Lorem ipsum dolor sit amet consectetur.",
	ar: "لوريم إيبسوم دولور سيت أميت.",
};

export const STAGES: readonly ProjectStage[] = [
	{
		id: "swatch-approval",
		title: {
			en: "Stage 1: Material & Colour Swatch Approval",
			ar: "المرحلة ١: اعتماد الخامات وعينات الألوان",
		},
		summary: STAGE_SUMMARY,
		status: "completed",
		completion: 100,
		date: "2026-07-04",
	},
	{
		id: "metal-framing",
		title: {
			en: "Stage 2: Metal Framing And Framing Structure",
			ar: "المرحلة ٢: الهيكل المعدني والتقسيمات",
		},
		summary: STAGE_SUMMARY,
		status: "in-progress",
		completion: 68,
		date: "2026-07-22",
	},
	{
		id: "gypsum-fixing",
		title: {
			en: "Stage 3: Gypsum Board Fixing & Bulkheads",
			ar: "المرحلة ٣: تركيب ألواح الجبس والأسقف المعلقة",
		},
		summary: STAGE_SUMMARY,
		status: "upcoming",
		completion: 0,
		date: "2026-08-30",
	},
	{
		id: "handover",
		title: {
			en: "Stage 4: Skimming, Painting & Official Handover",
			ar: "المرحلة ٤: التنعيم والدهان والتسليم الرسمي",
		},
		summary: STAGE_SUMMARY,
		status: "upcoming",
		completion: 0,
		date: "2026-10-05",
	},
];

const GYPROC: Localized = { en: "GYPROC GRB", ar: "جيبروك GRB" };

const SPEC_12_5: Localized = { en: "12.5mm", ar: "١٢٫٥ مم" };
const SPEC_MOISTURE: Localized = { en: "Moisture-Res", ar: "مقاوم للرطوبة" };
const SPEC_F60: Localized = { en: "F60", ar: "F60" };

const MOISTURE_BOARD: Localized = {
	en: "Moisture-Resistant Board",
	ar: "لوح مقاوم للرطوبة",
};

export const BOARDS: readonly BoardSample[] = [
	{
		id: "board-forest",
		brand: GYPROC,
		name: MOISTURE_BOARD,
		finish: { en: "Forest", ar: "أخضر داكن" },
		swatch: "board-forest",
		specs: [SPEC_12_5, SPEC_MOISTURE],
		state: "approved",
		approvedOn: "2026-07-04",
	},
	{
		id: "board-crimson",
		brand: GYPROC,
		name: MOISTURE_BOARD,
		finish: { en: "Crimson", ar: "قرمزي" },
		swatch: "board-crimson",
		specs: [SPEC_12_5, SPEC_MOISTURE, SPEC_F60],
		state: "pending",
		approvedOn: null,
	},
	{
		id: "board-olive",
		brand: GYPROC,
		name: MOISTURE_BOARD,
		finish: { en: "Olive", ar: "زيتوني" },
		swatch: "board-olive",
		specs: [SPEC_12_5, SPEC_MOISTURE],
		state: "approved",
		approvedOn: "2026-07-04",
	},
	{
		id: "board-navy",
		brand: GYPROC,
		name: MOISTURE_BOARD,
		finish: { en: "Navy", ar: "كحلي" },
		swatch: "board-navy",
		specs: [SPEC_12_5, SPEC_MOISTURE],
		state: "pending",
		approvedOn: null,
	},
];

const STUD_FRAMING: Localized = {
	en: "GI Metal Stud Framing — 75mm Track & Stud System",
	ar: "هيكل معدني مجلفن — نظام قوائم ومسارات ٧٥ مم",
};

const LINE_METRES: Localized = { en: "1240 LM", ar: "١٢٤٠ متر طولي" };

/**
 * Six identical rows, exactly as the Figma file draws them.
 *
 * A real invoice would itemise differently, but inventing six distinct line
 * items would be inventing scope the design does not show.
 */
const LINES = Array.from({ length: 6 }, (_, index) => ({
	id: `line-${index + 1}`,
	description: STUD_FRAMING,
	unit: LINE_METRES,
	rate: 38,
	amount: 56120,
}));

export const INVOICE: Invoice = {
	number: "ANV-2026-P2-047",
	issuedOn: "2026-08-12",
	dueOn: "2026-08-26",
	lines: LINES,
	vatRate: 0.06,
	instalments: [
		{
			id: "phase-1",
			label: { en: "Phase 1 - Mobilisation (Paid)", ar: "المرحلة ١ - التجهيز (مدفوعة)" },
			amount: 100910,
			state: "paid",
		},
		{
			id: "phase-2",
			label: { en: "Phase 2 - 40% Progress", ar: "المرحلة ٢ - إنجاز ٤٠٪" },
			amount: 10100,
			state: "due",
		},
		{
			id: "phase-3",
			label: {
				en: "Phase 3 - Completion & Handover",
				ar: "المرحلة ٣ - الإنجاز والتسليم",
			},
			amount: 10100,
			state: "scheduled",
		},
	],
	payment: {
		bank: { en: "Emirates NBD", ar: "بنك الإمارات دبي الوطني" },
		iban: "AE07 0260 0010 2030 2003 9",
		company: { en: "Nehal Premium Interiors", ar: "النهال للديكورات الفاخرة" },
		reference: "ANV-2026-P2-047",
	},
};

/** The figure the header quotes and the invoice card repeats. */
export const INVOICE_TOTAL = 167005;
