import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { ATELIER } from "@bq/core/data/atelier.data";

/**
 * The atelier's lock-up: gold seal exported from Figma, Latin wordmark, Arabic name.
 *
 * Both scripts show in both languages — the lock-up is a mark, not a sentence,
 * so it is not translated. The Latin line is pinned to `ltr` so it keeps its
 * word order when the rest of the page reads right to left.
 */
@Component({
	selector: "bq-brand-mark",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./brand-mark.html",
	styleUrl: "./brand-mark.scss",
})
export class BrandMark {
	readonly showWords = input(true);

	protected readonly atelier = ATELIER;
}
