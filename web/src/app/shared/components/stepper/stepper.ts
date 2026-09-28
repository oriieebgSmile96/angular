import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

import { TranslationKey } from "@bq/core/i18n/en";
import { Icon } from "@bq/shared/components/icon/icon";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

/** Horizontal progress indicator: numbered seals joined by hairlines. */
@Component({
	selector: "bq-stepper",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, TranslatePipe],
	templateUrl: "./stepper.html",
	styleUrl: "./stepper.scss",
})
export class Stepper {
	/** Dictionary keys rather than text, so the rail follows a mid-flow language switch. */
	readonly labels = input.required<readonly TranslationKey[]>();
	readonly activeIndex = input.required<number>();

	protected readonly currentLabel = computed(() => this.labels()[this.activeIndex()] ?? null);
}
