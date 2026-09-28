import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";

import { PROJECT, STAGES } from "@bq/core/data/project.data";
import { TranslationKey } from "@bq/core/i18n/en";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { StageStatus } from "@bq/core/models/project.model";
import { formatDate } from "@bq/core/utilities/format";
import { Icon } from "@bq/shared/components/icon/icon";
import { IconName } from "@bq/shared/components/icon/icon-name";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

const STATUS_LABEL: Readonly<Record<StageStatus, TranslationKey>> = {
	completed: "timeline.status.completed",
	"in-progress": "timeline.status.inProgress",
	upcoming: "timeline.status.upcoming",
};

const STATUS_ICON: Readonly<Record<StageStatus, IconName>> = {
	completed: "check",
	"in-progress": "dot",
	upcoming: "dot",
};

@Component({
	selector: "bq-timeline-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, RevealDirective, TranslatePipe],
	templateUrl: "./timeline-section.html",
	styleUrl: "./timeline-section.scss",
})
export class TimelineSection {
	readonly #i18n = inject(TranslationService);

	protected readonly project = PROJECT;

	/**
	 * Each stage with its display concerns resolved once, rather than three
	 * lookups repeated inside the template's loop.
	 */
	protected readonly stages = computed(() =>
		STAGES.map((stage, index) => ({
			...stage,
			ordinal: String(index + 1).padStart(2, "0"),
			statusLabel: STATUS_LABEL[stage.status],
			statusIcon: STATUS_ICON[stage.status],
			// A finished stage reports the day it closed; the rest are forecasts.
			date:
				stage.status === "completed"
					? formatDate(stage.date, this.#i18n.locale())
					: this.#i18n.translate("timeline.estimated", {
							date: formatDate(stage.date, this.#i18n.locale()),
						}),
			showProgress: stage.status !== "upcoming",
		})),
	);
}
