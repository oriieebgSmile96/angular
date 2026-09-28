import { Localized } from "@bq/core/i18n/language.model";

export interface SelectOption {
	readonly id: string;
	readonly label: Localized;
	readonly description?: Localized;
	readonly disabled?: boolean;
}
