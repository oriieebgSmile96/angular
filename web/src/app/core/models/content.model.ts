import { Localized } from "@bq/core/i18n/language.model";
import { IconName } from "@bq/shared/components/icon/icon-name";

export interface Photo {
	readonly src: string;
	readonly alt: Localized;
}

export interface Stat {
	/** Figures read the same in both languages, so they are not localized. */
	readonly value: string;
	readonly label: Localized;
}

/** Mirrors the five tiles of the Figma portfolio grid: one wide, one tall, three small. */
export type PortfolioTile = "wide" | "tall" | "small";

export interface PortfolioProject {
	readonly id: string;
	readonly title: Localized;
	readonly location: Localized;
	readonly tag: Localized;
	readonly tile: PortfolioTile;
	readonly photo: Photo;
}

export interface ProcessStep {
	readonly icon: IconName;
	readonly title: Localized;
}

export interface Testimonial {
	readonly quote: Localized;
	readonly author: Localized;
	readonly role: Localized;
}

export interface NavLink {
	readonly label: Localized;
	readonly fragment: string;
}
