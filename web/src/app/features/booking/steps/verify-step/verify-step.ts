import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	computed,
	effect,
	input,
	output,
	signal,
} from "@angular/core";

import { TranslationKey } from "@bq/core/i18n/en";
import { VERIFICATION_CODE_LENGTH } from "@bq/core/services/consultation.service";
import { Icon } from "@bq/shared/components/icon/icon";
import { OtpInput } from "@bq/shared/components/otp-input/otp-input";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

const TICK_MS = 1000;

@Component({
	selector: "bq-verify-step",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [OtpInput, ButtonDirective, Icon, TranslatePipe],
	templateUrl: "./verify-step.html",
	styleUrl: "./verify-step.scss",
})
export class VerifyStep implements OnDestroy {
	readonly maskedMobile = input.required<string>();
	/** Epoch milliseconds at which the current challenge lapses. */
	readonly expiresAt = input.required<number>();
	readonly pending = input(false);
	readonly error = input<TranslationKey | null>(null);
	/** Demo affordance only — the code an SMS gateway would have delivered. */
	readonly demoCode = input<string | null>(null);

	readonly verified = output<string>();
	readonly resendRequested = output<void>();
	readonly editRequested = output<void>();

	readonly codeLength = VERIFICATION_CODE_LENGTH;
	protected readonly code = signal("");
	protected readonly complete = computed(() => this.code().length === this.codeLength);

	readonly #now = signal(Date.now());
	readonly #timer = setInterval(() => this.#now.set(Date.now()), TICK_MS);

	protected readonly secondsLeft = computed(() =>
		Math.max(0, Math.ceil((this.expiresAt() - this.#now()) / 1000)),
	);
	protected readonly expired = computed(() => this.secondsLeft() === 0);
	protected readonly countdown = computed(() => {
		const total = this.secondsLeft();
		const minutes = Math.floor(total / 60);
		const seconds = total % 60;
		return `${pad(minutes)}:${pad(seconds)}`;
	});

	constructor() {
		// A resend issues a new challenge: clear whatever was half-typed.
		effect(() => {
			this.expiresAt();
			this.code.set("");
		});
	}

	ngOnDestroy(): void {
		clearInterval(this.#timer);
	}

	protected submit(): void {
		if (!this.complete() || this.pending()) return;
		this.verified.emit(this.code());
	}
}

function pad(value: number): string {
	return value.toString().padStart(2, "0");
}
