import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ar } from "@bq/core/i18n/ar";
import { TranslationKey, en } from "@bq/core/i18n/en";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { ThemeService } from "@bq/core/theme/theme.service";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

const GREETING = { en: "Good evening", ar: "مساء الخير" };

/**
 * Keys whose Arabic is deliberately identical to the English. Both are sample
 * data rather than prose — an address and a dialling format that a client types
 * over — so translating them would be wrong, not merely unnecessary.
 */
const INTENTIONALLY_UNTRANSLATED: readonly TranslationKey[] = [
	"booking.details.emailPlaceholder",
	"booking.details.mobilePlaceholder",
];

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TranslatePipe],
	template: `
		<p class="key">{{ "header.bookNow" | t }}</p>
		<p class="data">{{ greeting | t }}</p>
		<p class="params">{{ "booking.verify.lede" | t: { length: 6 } }}</p>
	`,
})
class HostComponent {
	readonly greeting = GREETING;
}

describe("translation dictionaries", () => {
	it("translates every English key into Arabic", () => {
		const untranslated = (Object.keys(en) as TranslationKey[]).filter(
			(key) => !INTENTIONALLY_UNTRANSLATED.includes(key) && (!ar[key]?.trim() || ar[key] === en[key]),
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

describe("TranslationService", () => {
	let i18n: TranslationService;

	beforeEach(() => {
		i18n = TestBed.inject(TranslationService);
		i18n.use("en");
	});

	it("fills interpolation parameters", () => {
		expect(i18n.translate("booking.verify.lede", { length: 6 })).toContain("6-digit");
	});

	it("leaves an unknown placeholder in place rather than printing undefined", () => {
		expect(i18n.translate("booking.verify.lede")).toContain("{length}");
	});

	it("switches direction and writes it onto the document", () => {
		i18n.use("ar");
		TestBed.tick();

		expect(i18n.direction()).toBe("rtl");
		expect(document.documentElement.dir).toBe("rtl");
		expect(document.documentElement.lang).toBe("ar");
	});

	it("resolves localized content data", () => {
		i18n.use("ar");
		expect(i18n.resolve(GREETING)).toBe("مساء الخير");
	});
});

describe("the t pipe", () => {
	let fixture: ComponentFixture<HostComponent>;
	let i18n: TranslationService;

	function text(selector: string): string {
		return fixture.nativeElement.querySelector(selector).textContent.trim();
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

		i18n = TestBed.inject(TranslationService);
		i18n.use("en");

		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
	});

	it("renders dictionary keys, localized data and parameters", () => {
		expect(text(".key")).toBe(en["header.bookNow"]);
		expect(text(".data")).toBe(GREETING.en);
		expect(text(".params")).toContain("6-digit");
	});

	/**
	 * The pipe is impure precisely so this passes: a pure pipe memoizes on its
	 * argument, which never changes here, and would keep serving English.
	 */
	it("re-renders when the language changes", () => {
		i18n.use("ar");
		fixture.detectChanges();

		expect(text(".key")).toBe(ar["header.bookNow"]);
		expect(text(".data")).toBe(GREETING.ar);
	});
});

describe("ThemeService", () => {
	let theme: ThemeService;

	beforeEach(() => {
		theme = TestBed.inject(ThemeService);
	});

	it("paints the chosen theme onto the document", () => {
		theme.prefer("light");
		TestBed.tick();

		expect(theme.theme()).toBe("light");
		expect(theme.isDark()).toBe(false);
		expect(document.documentElement.dataset["theme"]).toBe("light");
	});

	it("toggles to the opposite of what is on screen", () => {
		theme.prefer("light");
		theme.toggle();
		TestBed.tick();

		expect(theme.theme()).toBe("dark");
		expect(document.documentElement.dataset["theme"]).toBe("dark");
	});
});
