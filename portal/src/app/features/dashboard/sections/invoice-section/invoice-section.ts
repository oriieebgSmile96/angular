import { DOCUMENT } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";

import { INVOICE, INVOICE_TOTAL, PROJECT } from "@bq/core/data/project.data";
import { TranslationKey } from "@bq/core/i18n/en";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { formatDate } from "@bq/core/utilities/format";
import { money } from "@bq/core/utilities/money";
import { InvoiceLedger } from "@bq/features/dashboard/sections/invoice-section/invoice-ledger/invoice-ledger";
import { InvoiceSchedule } from "@bq/features/dashboard/sections/invoice-section/invoice-schedule/invoice-schedule";
import { Icon } from "@bq/shared/components/icon/icon";
import { SectionDivider } from "@bq/shared/components/section-divider/section-divider";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-invoice-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, InvoiceLedger, InvoiceSchedule, RevealDirective, SectionDivider, TranslatePipe],
	templateUrl: "./invoice-section.html",
	styleUrl: "./invoice-section.scss",
})
export class InvoiceSection {
	readonly #i18n = inject(TranslationService);
	readonly #window = inject(DOCUMENT).defaultView;

	protected readonly project = PROJECT;
	protected readonly invoice = INVOICE;
	protected readonly payment = INVOICE.payment;

	protected readonly issuedOn = computed(() =>
		this.#i18n.translate("invoice.issued", {
			date: formatDate(INVOICE.issuedOn, this.#i18n.locale()),
		}),
	);

	protected readonly dueOn = computed(() => formatDate(INVOICE.dueOn, this.#i18n.locale()));

	/** The headline figure in the band. The ledger and the schedule repeat it. */
	protected readonly total = computed(() => money(INVOICE_TOTAL, this.#i18n));

	readonly #paymentConfirmed = signal(false);

	protected readonly paymentConfirmed = this.#paymentConfirmed.asReadonly();

	protected readonly statusLabel = computed<TranslationKey>(() =>
		this.#paymentConfirmed() ? "invoice.paymentConfirmed" : "invoice.awaitingPayment",
	);

	protected readonly confirmLabel = computed<TranslationKey>(() =>
		this.#paymentConfirmed() ? "invoice.paymentConfirmed" : "invoice.confirmPayment",
	);

	/**
	 * Frontend only: there is no payments endpoint, so the client's word that the
	 * transfer has left their bank is held here and would become the request body.
	 * The chip in the header band is the live region that reports it, and the
	 * button stays focusable rather than going `disabled`, so a keyboard user is
	 * not dropped back to the top of the document by their own click.
	 */
	protected confirmPayment(): void {
		this.#paymentConfirmed.set(true);
	}

	/**
	 * There is no document service to fetch a rendered invoice from, and a control
	 * that quietly does nothing is worse than one that does less than its label
	 * promises. The browser already renders this page to PDF, and its print
	 * dialogue offers exactly that destination, so that is what the button calls
	 * until there is a signed PDF on a server. Swapping it for a download is a
	 * change to this method.
	 */
	protected downloadPdf(): void {
		this.#window?.print();
	}
}
