import { ChangeDetectionStrategy, Component } from "@angular/core";

import { RevealDirective } from "@bq/shared/motion/reveal.directive";

/**
 * The gold rule with a bead at its centre that separates the dashboard's
 * sections.
 *
 * Figma exports this as a 1320×6 SVG, but at that width the file is mostly two
 * gradients that CSS already has, and a raster or fixed-colour asset would not
 * re-tint between themes. Two gradient rules and a dot cost nothing — and can
 * draw themselves outward from the bead as the section arrives.
 */
@Component({
	selector: "bq-section-divider",
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [RevealDirective],
	templateUrl: "./section-divider.html",
	styleUrl: "./section-divider.scss",
	host: { role: "separator" },
})
export class SectionDivider {}
