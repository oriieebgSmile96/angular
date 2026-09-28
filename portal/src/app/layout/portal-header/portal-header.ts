import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";

import { PROJECT, ATELIER } from "@bq/core/data/project.data";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { LANGUAGE_LABEL } from "@bq/core/i18n/language.model";
import { ThemeService } from "@bq/core/theme/theme.service";
import { Icon } from "@bq/shared/components/icon/icon";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

/**
 * Identifies the project and states its three headline facts.
 *
 * The stat cards are a definition list rather than three divs: each is a term
 * and its value, and a screen reader should be able to enumerate them as the
 * project's status rather than as unrelated fragments of text.
 */
@Component({
	selector: "bq-portal-header",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, RevealDirective, TranslatePipe],
	templateUrl: "./portal-header.html",
	styleUrl: "./portal-header.scss",
})
export class PortalHeader {
	readonly #theme = inject(ThemeService);
	readonly #i18n = inject(TranslationService);

	protected readonly atelier = ATELIER;
	protected readonly project = PROJECT;
	protected readonly isDark = this.#theme.isDark;

	protected readonly nextLanguageLabel = computed(() =>
		this.#i18n.language() === "en" ? LANGUAGE_LABEL.ar : LANGUAGE_LABEL.en,
	);

	protected toggleTheme(): void {
		this.#theme.toggle();
	}

	protected toggleLanguage(): void {
		this.#i18n.toggle();
	}
}
