import {
	ChangeDetectorRef,
	DestroyRef,
	Directive,
	Injector,
	computed,
	effect,
	inject,
	input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
	ControlContainer,
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NgControl,
	Validators,
} from "@angular/forms";

/**
 * Shared plumbing for every reactive form control in the kit.
 *
 * Controls register as a `ControlValueAccessor` so `formControlName` binds the
 * way Angular expects, but they also resolve the real `FormControl` off the
 * parent `FormGroup`. Reading the control directly is what lets a control render
 * its own label, required marker and error text without the host passing them in
 * — which is the whole point of the kit.
 *
 * Because value flows through that shared `FormControl`, `writeValue` is a no-op.
 */
@Directive()
export abstract class ReactiveFormControlBase implements ControlValueAccessor {
	readonly #controlContainer = inject(ControlContainer, { optional: true, skipSelf: true });
	readonly #injector = inject(Injector);
	readonly #cdr = inject(ChangeDetectorRef);
	readonly #destroyRef = inject(DestroyRef);

	#syncedControl: FormControl | null = null;

	/** Accepts either `controlName` or Angular's own `formControlName`. */
	readonly controlName = input("");
	readonly formControlName = input("");
	readonly showValidationErrors = input(true);

	readonly fieldName = computed(() => this.controlName() || this.formControlName());

	constructor() {
		effect(() => {
			this.fieldName();
			queueMicrotask(() => this.#bindControlToChangeDetection());
		});
	}

	get form(): FormGroup {
		const parent = this.#controlContainer?.control;
		if (!(parent instanceof FormGroup)) throw new Error("bq form control: no parent FormGroup");
		return parent;
	}

	get control(): FormControl {
		const control = this.controlOrNull;
		if (!control) throw new Error(`bq form control: no FormControl named "${this.fieldName()}"`);
		return control;
	}

	protected get controlOrNull(): FormControl | null {
		const parent = this.#controlContainer?.control;
		if (parent && "get" in parent) {
			const fromGroup = parent.get(this.fieldName());
			if (fromGroup instanceof FormControl) return fromGroup;
		}

		const ngControl = this.#injector.get(NgControl, null, { optional: true });
		return ngControl?.control instanceof FormControl ? ngControl.control : null;
	}

	get isRequired(): boolean {
		const control = this.controlOrNull;
		if (!control || control.disabled) return false;
		return control.hasValidator(Validators.required) || control.hasValidator(Validators.requiredTrue);
	}

	get isDisabled(): boolean {
		return this.controlOrNull?.disabled ?? false;
	}

	/** Errors stay hidden until the field has been touched, so typing is never punished. */
	get isInvalid(): boolean {
		const control = this.controlOrNull;
		return this.showValidationErrors() && !!control?.errors && control.touched;
	}

	get inputId(): string {
		return `bq-field-${this.fieldName()}`;
	}

	get errorId(): string {
		return `${this.inputId}-error`;
	}

	get hintId(): string {
		return `${this.inputId}-hint`;
	}

	get listboxId(): string {
		return `${this.inputId}-listbox`;
	}

	get describedBy(): string | null {
		return this.isInvalid ? this.errorId : null;
	}

	protected markControlTouched(): void {
		const control = this.controlOrNull;
		control?.markAsTouched();
		control?.updateValueAndValidity();
		this.onTouched();
		this.#cdr.markForCheck();
	}

	onChange: (value: unknown) => void = () => {
		// Replaced by Angular when the directive registers.
	};

	onTouched: () => void = () => {
		// Replaced by Angular when the directive registers.
	};

	/** Intentionally inert: the value lives on the shared `FormControl`. */
	writeValue: (value: unknown) => void = () => {
		// No-op.
	};

	registerOnChange(fn: (value: unknown) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	/**
	 * The control is mutated from outside this component — validators, a reset, or
	 * the host calling `markAllAsTouched()` on submit — so OnPush needs an explicit
	 * nudge. `events` covers value, status, touched and pristine in one stream.
	 */
	#bindControlToChangeDetection(): void {
		const control = this.controlOrNull;
		if (!control || control === this.#syncedControl) return;

		this.#syncedControl = control;

		control.events.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => this.#cdr.markForCheck());
	}
}
