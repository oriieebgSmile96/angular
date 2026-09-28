import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import { NAV_LINKS } from "@bq/core/data/atelier.data";
import { LANGUAGE_LABEL } from "@bq/core/i18n/language.model";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { ThemeService } from "@bq/core/theme/theme.service";
import { BookingLauncher } from "@bq/features/booking/booking-launcher.service";
import { BrandMark } from "@bq/shared/components/brand-mark/brand-mark";
import { Icon } from "@bq/shared/components/icon/icon";
import { ButtonDirective } from "@bq/shared/directives/button.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

const CONDENSE_AFTER_PX = 40;

@Component({
	selector: "bq-site-header",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, BrandMark, Icon, ButtonDirective, TranslatePipe],
	templateUrl: "./site-header.html",
	styleUrl: "./site-header.scss",
	host: {
		"[class.is-condensed]": "condensed()",
		"[class.is-open]": "menuOpen()",
		// While the bar is transparent it floats over the hero photograph, which is
		// dark in either theme. Pinning it to the dark palette keeps the nav legible
		// until it condenses onto a surface of its own.
		"[class.bq-theme-dark]": "!condensed() && !menuOpen()",
		"(window:scroll)": "onScroll()",
	},
})
export class SiteHeader {
	readonly #booking = inject(BookingLauncher);

	protected readonly theme = inject(ThemeService);
	protected readonly i18n = inject(TranslationService);

	protected readonly links = NAV_LINKS;
	protected readonly condensed = signal(false);
	protected readonly menuOpen = signal(false);

	/** The switch is labelled with the language it leads to, not the one in use. */
	protected readonly nextLanguage = computed(() => (this.i18n.language() === "en" ? "ar" : "en"));
	protected readonly nextLanguageLabel = computed(() => LANGUAGE_LABEL[this.nextLanguage()]);

	protected onScroll(): void {
		this.condensed.set(window.scrollY > CONDENSE_AFTER_PX);
	}

	protected toggleMenu(): void {
		this.menuOpen.update((open) => !open);
	}

	protected bookConsultation(): void {
		this.menuOpen.set(false);
		this.#booking.open().subscribe();
	}
}
