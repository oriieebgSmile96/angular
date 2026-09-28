import { TranslationService } from "@bq/core/i18n/translation.service";
import { formatAmount } from "@bq/core/utilities/format";

/**
 * `AED 56,120` — `Intl` sets the figure, the dictionary puts the label on the
 * side the script wants it.
 *
 * Anything showing a dirham figure goes through here, so the currency key is
 * named in one place rather than in every component that prints money.
 */
export function money(value: number, i18n: TranslationService): string {
	return i18n.translate("currency.aed", { amount: formatAmount(value, i18n.locale()) });
}
