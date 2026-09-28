import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

import { IconName } from "./icon-name";

/**
 * Draws one icon from the sprite at `public/icons/sprite.svg`.
 *
 * The sprite is built from the individual files in `public/icons/` by
 * `npm run icons`. Referencing it with `<use>` keeps every icon a single cached
 * request while still inheriting `currentColor` and the stroke weight from here,
 * so an icon takes the colour of whatever text it sits beside.
 */
@Component({
	selector: "bq-icon",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./icon.html",
	styleUrl: "./icon.scss",
})
export class Icon {
	readonly name = input.required<IconName>();
	readonly size = input(20);
	readonly strokeWidth = input(1.5);

	protected readonly href = computed(() => `icons/sprite.svg#${this.name()}`);
}
