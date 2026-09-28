import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslationService } from "@bq/core/i18n/translation.service";
import { SelectOption } from "@bq/core/models/form.model";
import { Checkbox } from "@bq/shared/components/forms/checkbox/checkbox";
import { Datepicker } from "@bq/shared/components/forms/datepicker/datepicker";
import {
	DateRangePicker,
} from "@bq/shared/components/forms/date-range-picker/date-range-picker";
import {
	EMPTY_DATE_RANGE,
	dateRangeRequired,
} from "@bq/shared/components/forms/date-range-picker/date-range.model";
import { InputField } from "@bq/shared/components/forms/input/input";
import { RadioGroup } from "@bq/shared/components/forms/radio-group/radio-group";
import { Select } from "@bq/shared/components/forms/select/select";

const PROJECT_TYPES: readonly SelectOption[] = [
	{ id: "villa", label: { en: "Villa", ar: "فيلا" } },
	{ id: "majlis", label: { en: "Majlis", ar: "مجلس" } },
];

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, InputField, Select, Datepicker, DateRangePicker, RadioGroup, Checkbox],
	template: `
		<form [formGroup]="form">
			<bq-input label="Full Name" formControlName="fullName" placeholder="e.g Younis" />
			<bq-select label="Project Type" formControlName="projectType" [options]="options" />
			<bq-datepicker label="Preferred Date" formControlName="preferredDate" />
			<bq-date-range-picker label="Preferred Window" formControlName="preferredDateRange" />
			<bq-radio-group label="Format" formControlName="format" [options]="options" />
			<bq-checkbox label="I agree" formControlName="consent" />
		</form>
	`,
})
class HostComponent {
	readonly options = PROJECT_TYPES;

	readonly form = new FormGroup({
		fullName: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
		projectType: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
		preferredDate: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
		preferredDateRange: new FormControl(EMPTY_DATE_RANGE, {
			nonNullable: true,
			validators: [dateRangeRequired],
		}),
		format: new FormControl("", { nonNullable: true }),
		consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
	});
}

describe("shared form controls", () => {
	let fixture: ComponentFixture<HostComponent>;
	let host: HostComponent;

	function query<T extends Element>(selector: string): T {
		const element = fixture.nativeElement.querySelector(selector);
		if (!element) throw new Error(`no element matching "${selector}"`);
		return element as T;
	}

	function queryOverlay<T extends Element>(selector: string): T {
		const element = document.querySelector(selector);
		if (!element) throw new Error(`no overlay element matching "${selector}"`);
		return element as T;
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

		// The service otherwise picks up the runner's browser language, which would
		// make the assertions below depend on where the suite happens to run.
		TestBed.inject(TranslationService).use("en");

		fixture = TestBed.createComponent(HostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("derives the label and required marker from the bound control", () => {
		const label = query<HTMLLabelElement>("bq-input .bq-field-label__text");

		expect(label.textContent).toContain("Full Name");
		expect(label.querySelector(".bq-field-label__star")).not.toBeNull();
	});

	it("writes typed text through to the control", () => {
		const input = query<HTMLInputElement>("bq-input input");

		input.value = "Younis Al Farsi";
		input.dispatchEvent(new Event("input"));
		fixture.detectChanges();

		expect(host.form.controls.fullName.value).toBe("Younis Al Farsi");
	});

	it("keeps errors hidden until the field is touched", () => {
		expect(fixture.nativeElement.querySelector("bq-input bq-inline-error")).toBeNull();

		host.form.markAllAsTouched();
		fixture.detectChanges();

		expect(query("bq-input bq-inline-error").textContent).toContain("This field is required.");
	});

	it("sets the control value when a select option is chosen", () => {
		query<HTMLButtonElement>("bq-select .bq-select__trigger").click();
		fixture.detectChanges();

		const options = document.querySelectorAll<HTMLElement>(".bq-select__option");
		expect(options.length).toBe(2);

		options[1].click();
		fixture.detectChanges();

		expect(host.form.controls.projectType.value).toBe("majlis");
		expect(query("bq-select .bq-select__value").textContent?.trim()).toBe("Majlis");
	});

	it("stores a calendar pick as a plain YYYY-MM-DD day", () => {
		query<HTMLButtonElement>("bq-datepicker .bq-datepicker__trigger").click();
		fixture.detectChanges();

		const day = queryOverlay<HTMLButtonElement>(".bq-calendar__day:not(.is-outside)");
		day.click();
		fixture.detectChanges();

		expect(host.form.controls.preferredDate.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(document.querySelector(".bq-datepicker__panel")).toBeNull();
	});

	it("stores a date range as two YYYY-MM-DD days", () => {
		query<HTMLButtonElement>("bq-date-range-picker .bq-date-range-picker__trigger").click();
		fixture.detectChanges();

		const days = document.querySelectorAll<HTMLButtonElement>(".bq-calendar__day:not(.is-outside):not(:disabled)");
		days[0].click();
		fixture.detectChanges();

		days[4].click();
		fixture.detectChanges();

		const range = host.form.controls.preferredDateRange.value;
		expect(range.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(range.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(document.querySelector(".bq-date-range-picker__panel")).toBeNull();
	});

	it("toggles the checkbox control", () => {
		const checkbox = query<HTMLInputElement>("bq-checkbox input");

		checkbox.click();
		fixture.detectChanges();

		expect(host.form.controls.consent.value).toBe(true);
	});

	it("selects a radio option", () => {
		const radios = fixture.nativeElement.querySelectorAll("bq-radio-group input");

		(radios[0] as HTMLInputElement).click();
		fixture.detectChanges();

		expect(host.form.controls.format.value).toBe("villa");
	});
});
