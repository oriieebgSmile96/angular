import { ChangeDetectionStrategy, Component, input, signal } from "@angular/core";

/**
 * Photography frame with a designed fallback.
 *
 * Interior photography is loaded from a remote library; if a shot fails to load
 * (offline, blocked CDN) the frame keeps its brushed-bronze gradient instead of
 * collapsing to a broken-image icon.
 */
@Component({
	selector: "bq-photo",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./photo-frame.html",
	styleUrl: "./photo-frame.scss",
	host: {
		"[style.aspect-ratio]": "ratio()",
	},
})
export class PhotoFrame {
	readonly src = input.required<string>();
	readonly alt = input.required<string>();
	readonly ratio = input("4 / 3");
	readonly eager = input(false);

	protected readonly loaded = signal(false);
	protected readonly failed = signal(false);
}
