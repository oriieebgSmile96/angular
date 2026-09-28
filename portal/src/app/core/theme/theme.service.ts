import { DOCUMENT } from "@angular/common";
import { Injectable, computed, effect, inject, signal } from "@angular/core";

export type Theme = "dark" | "light";
/** `system` tracks the OS setting for as long as the visitor leaves it alone. */
export type ThemePreference = Theme | "system";

const STORAGE_KEY = "bq.theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Kept in step with `theme.*.surface.page` in the design tokens. */
const BROWSER_CHROME: Readonly<Record<Theme, string>> = {
	dark: "#0A0A0C",
	light: "#FDFCFA",
};

/**
 * Owns which palette the document is painted in.
 *
 * The service only writes `data-theme` on `<html>`; the colours themselves come
 * from the generated token blocks, so nothing here needs to know a hex value
 * beyond the one the browser paints its own chrome with.
 */
@Injectable({ providedIn: "root" })
export class ThemeService {
	readonly #document = inject(DOCUMENT);
	readonly #preference = signal<ThemePreference>(readStoredPreference());
	readonly #systemPrefersDark = signal(matchesDark());

	readonly preference = this.#preference.asReadonly();

	readonly theme = computed<Theme>(() => {
		const preference = this.#preference();
		if (preference !== "system") return preference;

		return this.#systemPrefersDark() ? "dark" : "light";
	});

	readonly isDark = computed(() => this.theme() === "dark");

	constructor() {
		this.#watchSystemPreference();

		effect(() => {
			const theme = this.theme();
			this.#document.documentElement.dataset["theme"] = theme;
			this.#document
				.querySelector('meta[name="theme-color"]')
				?.setAttribute("content", BROWSER_CHROME[theme]);
		});

		effect(() => {
			const preference = this.#preference();
			try {
				localStorage.setItem(STORAGE_KEY, preference);
			} catch {
				// Private browsing denies writes; the choice just will not survive a reload.
			}
		});
	}

	prefer(preference: ThemePreference): void {
		this.#preference.set(preference);
	}

	/** Flips to the opposite of what is currently on screen, pinning the choice. */
	toggle(): void {
		this.#preference.set(this.theme() === "dark" ? "light" : "dark");
	}

	#watchSystemPreference(): void {
		const media = this.#document.defaultView?.matchMedia?.(DARK_QUERY);
		media?.addEventListener("change", (event) => this.#systemPrefersDark.set(event.matches));
	}
}

function matchesDark(): boolean {
	return globalThis.matchMedia?.(DARK_QUERY).matches ?? true;
}

function readStoredPreference(): ThemePreference {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "dark" || stored === "light" || stored === "system") return stored;
	} catch {
		// Storage unavailable: fall through to the OS setting.
	}

	return "system";
}
