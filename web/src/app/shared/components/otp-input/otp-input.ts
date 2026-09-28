import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	computed,
	input,
	model,
	output,
	viewChildren,
} from "@angular/core";

/**
 * Six-box one-time-code entry.
 *
 * Entry is strictly sequential: clearing a box also clears everything after it,
 * so the bound value can never contain holes and the caller only ever sees a
 * prefix of the final code.
 */
@Component({
	selector: "bq-otp-input",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./otp-input.html",
	styleUrl: "./otp-input.scss",
	host: {
		"[class.is-invalid]": "invalid()",
	},
})
export class OtpInput {
	readonly length = input(6);
	readonly disabled = input(false);
	readonly invalid = input(false);
	readonly ariaLabel = input("One-time verification code");

	readonly value = model("");
	readonly completed = output<string>();

	protected readonly slots = computed(() => {
		const digits = this.value().split("");
		return Array.from({ length: this.length() }, (_, index) => digits[index] ?? "");
	});

	// Signal queries cannot live on ES private fields, so this one stays TS-private.
	private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>("box");

	focusFirstEmpty(): void {
		this.#focus(Math.min(this.value().length, this.length() - 1));
	}

	protected onInput(index: number, event: Event): void {
		const element = event.target as HTMLInputElement;
		const digits = element.value.replace(/\D/g, "");
		element.value = digits.slice(-1);

		if (digits === "") {
			this.#commit(this.value().slice(0, index));
			return;
		}

		this.#write(index, digits.slice(-1));
	}

	protected onKeydown(index: number, event: KeyboardEvent): void {
		switch (event.key) {
			case "Backspace": {
				if ((event.target as HTMLInputElement).value !== "") return;
				event.preventDefault();
				this.#commit(this.value().slice(0, Math.max(index - 1, 0)));
				this.#focus(index - 1);
				return;
			}
			case "ArrowLeft":
				event.preventDefault();
				this.#focus(index - 1);
				return;
			case "ArrowRight":
				event.preventDefault();
				this.#focus(index + 1);
				return;
			default:
				return;
		}
	}

	protected onPaste(index: number, event: ClipboardEvent): void {
		const pasted = event.clipboardData?.getData("text").replace(/\D/g, "") ?? "";
		if (pasted === "") return;

		event.preventDefault();
		const next = `${this.value().slice(0, index)}${pasted}`.slice(0, this.length());
		this.#commit(next);
		this.#focus(next.length);
	}

	protected onFocus(event: FocusEvent): void {
		(event.target as HTMLInputElement).select();
	}

	#write(index: number, digit: string): void {
		const next = `${this.value().slice(0, index)}${digit}`.slice(0, this.length());
		this.#commit(next);
		this.#focus(index + 1);
	}

	#commit(next: string): void {
		this.value.set(next);
		if (next.length === this.length()) this.completed.emit(next);
	}

	#focus(index: number): void {
		const boxes = this.boxes();
		const clamped = Math.min(Math.max(index, 0), boxes.length - 1);
		boxes[clamped]?.nativeElement.focus();
	}
}
