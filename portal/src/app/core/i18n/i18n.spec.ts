import { ar } from "@bq/core/i18n/ar";
import { TranslationKey, en } from "@bq/core/i18n/en";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { BOARDS, INVOICE, PROJECT, STAGES } from "@bq/core/data/project.data";
import { Localized } from "@bq/core/i18n/language.model";
import { formatAmount, formatDate } from "@bq/core/utilities/format";
import { TestBed } from "@angular/core/testing";

describe("translation dictionaries", () => {
	it("translates every English key into Arabic", () => {
		const untranslated = (Object.keys(en) as TranslationKey[]).filter(
			(key) => !ar[key]?.trim() || ar[key] === en[key],
		);

		expect(untranslated).toEqual([]);
	});

	it("keeps every interpolation placeholder across both languages", () => {
		const placeholders = (value: string) => (value.match(/\{(\w+)\}/g) ?? []).sort();

		for (const key of Object.keys(en) as TranslationKey[]) {
			expect(placeholders(ar[key])).toEqual(placeholders(en[key]));
		}
	});
});

/**
 * The portal issues documents a client may act on financially, so a half-
 * translated invoice is worse than an untranslated one. These walk the fixtures
 * rather than the dictionary, because project content carries its own copy.
 */
describe("project content", () => {
	function localizedValues(): Localized[] {
		return [
			PROJECT.name,
			PROJECT.nameLead,
			PROJECT.location,
			PROJECT.phase,
			PROJECT.phaseDetail,
			PROJECT.timelineNote,
			PROJECT.clientName,
			PROJECT.clientRole,
			...STAGES.flatMap((stage) => [stage.title, stage.summary]),
			...BOARDS.flatMap((board) => [board.brand, board.name, board.finish, ...board.specs]),
			...INVOICE.lines.flatMap((line) => [line.description, line.unit]),
			...INVOICE.instalments.map((instalment) => instalment.label),
			INVOICE.payment.bank,
			INVOICE.payment.company,
		];
	}

	it("carries both languages for every editorial string", () => {
		for (const value of localizedValues()) {
			expect(value.en.trim()).not.toBe("");
			expect(value.ar.trim()).not.toBe("");
		}
	});

	it("gives each board sample a distinguishing finish", () => {
		const finishes = BOARDS.map((board) => board.finish.en);

		expect(new Set(finishes).size).toBe(BOARDS.length);
	});
});

describe("formatting", () => {
	/**
	 * The Arabic locale is pinned to Latin digits in `language.model.ts`, matching
	 * the Figma file. If that ever regresses to Eastern Arabic numerals, a dirham
	 * figure stops matching the contract it is quoted against.
	 */
	it("keeps Latin digits in Arabic", () => {
		expect(formatAmount(56120, "ar-AE-u-nu-latn")).toContain("56");
		expect(formatDate("2026-07-04", "ar-AE-u-nu-latn")).toContain("2026");
	});

	it("groups thousands in English", () => {
		expect(formatAmount(167005, "en-AE")).toBe("167,005");
	});
});

describe("TranslationService", () => {
	let i18n: TranslationService;

	beforeEach(() => {
		i18n = TestBed.inject(TranslationService);
		i18n.use("en");
	});

	it("fills interpolation parameters", () => {
		expect(i18n.translate("header.contractRef", { ref: "VLR-2026-0143" })).toContain("VLR-2026-0143");
	});

	it("switches direction and writes it onto the document", () => {
		i18n.use("ar");
		TestBed.tick();

		expect(i18n.direction()).toBe("rtl");
		expect(document.documentElement.dir).toBe("rtl");
	});

	it("resolves localized project content", () => {
		i18n.use("ar");
		expect(i18n.resolve(PROJECT.clientRole)).toBe("مالك الفيلا");
	});
});
