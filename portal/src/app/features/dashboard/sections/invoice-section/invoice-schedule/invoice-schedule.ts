import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";

import { INVOICE, INVOICE_TOTAL } from "@bq/core/data/project.data";
import { TranslationKey } from "@bq/core/i18n/en";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { InstalmentState } from "@bq/core/models/project.model";
import { money } from "@bq/core/utilities/money";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

/**
 * Paid, due and scheduled differ only by colour in the design, which is no
 * difference at all to a screen reader or to a client with a print-out.
 */
const STATE_LABEL: Readonly<Record<InstalmentState, TranslationKey>> = {
	paid: "invoice.instalment.paid",
	due: "invoice.instalment.due",
	scheduled: "invoice.instalment.scheduled",
};

/**
 * The instalment plan, and what falls due now.
 *
 * Split out of `InvoiceSection` alongside the ledger: the phase breakdown is
 * self-contained and carries no state, leaving the parent to own the header
 * band and the two controls that act on it.
 */
@Component({
	selector: "bq-invoice-schedule",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RevealDirective, TranslatePipe],
	templateUrl: "./invoice-schedule.html",
	styleUrl: "./invoice-schedule.scss",
})
export class InvoiceSchedule {
	readonly #i18n = inject(TranslationService);

	protected readonly instalments = computed(() =>
		INVOICE.instalments.map((instalment) => ({
			id: instalment.id,
			label: instalment.label,
			state: instalment.state,
			stateLabel: STATE_LABEL[instalment.state],
			amount: money(instalment.amount, this.#i18n),
		})),
	);

	protected readonly total = computed(() => money(INVOICE_TOTAL, this.#i18n));
}
