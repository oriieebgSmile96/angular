import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";

import { INVOICE, INVOICE_TOTAL } from "@bq/core/data/project.data";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { formatAmount } from "@bq/core/utilities/format";
import { money } from "@bq/core/utilities/money";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

/**
 * What the six line items come to, and the VAT on that.
 *
 * The Figma file's figures do not reconcile: six lines of 56,120 sum to 336,720,
 * yet it prints a subtotal of 280,600 (five lines), VAT of 14,030 (5% of that
 * subtotal, not the 6% it labels) and a total of 167,005 that follows from
 * neither. Transcribing those would bake a costing error into the portal, so the
 * two derivable figures are derived and `INVOICE_TOTAL` stays what it is — the
 * amount the atelier has quoted and asks for. The gap between them is the
 * atelier's to settle with the client, not this component's to paper over.
 */
const SUBTOTAL = INVOICE.lines.reduce((sum, line) => sum + line.amount, 0);
const VAT = SUBTOTAL * INVOICE.vatRate;

/**
 * The invoice's line items and what they add up to.
 *
 * Split out of `InvoiceSection` because the table and its totals are the one
 * part of that view with no state and no interaction — everything else on the
 * card is either the header the client reads first or the controls they act on.
 */
@Component({
	selector: "bq-invoice-ledger",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RevealDirective, TranslatePipe],
	templateUrl: "./invoice-ledger.html",
	styleUrl: "./invoice-ledger.scss",
})
export class InvoiceLedger {
	readonly #i18n = inject(TranslationService);

	// 0.06 × 100 is 6.000000000000001 in binary floating point, and the key sets
	// the per-cent sign itself.
	protected readonly vatPercent = Math.round(INVOICE.vatRate * 100);

	protected readonly lines = computed(() =>
		INVOICE.lines.map((line) => ({
			id: line.id,
			description: line.description,
			unit: line.unit,
			// The rate column names its currency in its header; the amount column
			// does not, so it carries the label.
			rate: formatAmount(line.rate, this.#i18n.locale()),
			amount: money(line.amount, this.#i18n),
		})),
	);

	protected readonly subtotal = computed(() => money(SUBTOTAL, this.#i18n));
	protected readonly vat = computed(() => money(VAT, this.#i18n));
	protected readonly total = computed(() => money(INVOICE_TOTAL, this.#i18n));
}
