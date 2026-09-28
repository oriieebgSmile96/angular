import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Injector,
	afterNextRender,
	computed,
	inject,
	signal,
	viewChildren,
} from "@angular/core";

import { BOARDS } from "@bq/core/data/project.data";
import { TranslationService } from "@bq/core/i18n/translation.service";
import { BoardSample } from "@bq/core/models/project.model";
import { formatDate } from "@bq/core/utilities/format";
import { Icon } from "@bq/shared/components/icon/icon";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

/** Board id to the day it was signed off. A missing entry means still pending. */
type Approvals = ReadonlyMap<string, string>;

const SEEDED: Approvals = new Map(
	BOARDS.flatMap((board) => (board.approvedOn ? [[board.id, board.approvedOn] as const] : [])),
);

/** The card's footer element, whichever state it is in. */
function actionId(boardId: string): string {
	return `${boardId}-action`;
}

/** Local `YYYY-MM-DD`. `toISOString` would date a Gulf evening to the day before. */
function today(): string {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");

	return `${now.getFullYear()}-${month}-${day}`;
}

@Component({
	selector: "bq-boards-section",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, RevealDirective, TranslatePipe],
	templateUrl: "./boards-section.html",
	styleUrl: "./boards-section.scss",
})
export class BoardsSection {
	readonly #i18n = inject(TranslationService);
	readonly #injector = inject(Injector);

	/**
	 * There is no backend to post a sign-off to, so this signal is the record of
	 * what the client has approved; `project.data.ts` only seeds it.
	 */
	readonly #approvals = signal(SEEDED);
	readonly #announcement = signal("");

	/**
	 * Boards signed off in this session, as opposed to ones that arrived already
	 * approved. Only these get the tick animation: replaying it for a sign-off
	 * made last month would claim something just happened when nothing did.
	 */
	readonly #justApproved = signal<ReadonlySet<string>>(new Set());

	/**
	 * Kept as resolved text rather than recomputed from the approval, so that
	 * switching language does not re-announce a sign-off made minutes ago.
	 */
	protected readonly announcement = this.#announcement.asReadonly();

	private readonly actions = viewChildren<ElementRef<HTMLElement>>("action");

	/**
	 * Each sample with its display concerns resolved once, rather than the same
	 * lookups repeated inside the template's loop.
	 */
	protected readonly cards = computed(() => {
		const approvals = this.#approvals();
		const justApproved = this.#justApproved();
		const locale = this.#i18n.locale();

		return BOARDS.map((board) => {
			const approvedOn = approvals.get(board.id);

			return {
				...board,
				// The sample is a physical product, so its colour comes from the board
				// ramp and stays put when the page theme flips.
				swatchColor: `var(--bq-color-${board.swatch})`,
				approved: approvedOn !== undefined,
				justApproved: justApproved.has(board.id),
				approvedOn: approvedOn ? formatDate(approvedOn, locale) : "",
				nameId: `${board.id}-name`,
				actionId: actionId(board.id),
				// "Approve material" alone repeats across all four buttons. Naming the
				// button by its own text plus the heading keeps the visible label
				// inside the accessible name, which a voice control user speaks.
				labelledBy: `${actionId(board.id)} ${board.id}-name`,
			};
		});
	});

	protected approve(board: BoardSample): void {
		const approvedOn = today();

		this.#approvals.update((current) => new Map(current).set(board.id, approvedOn));
		this.#justApproved.update((current) => new Set(current).add(board.id));
		this.#announcement.set(
			this.#i18n.translate("boards.approvedAnnouncement", {
				name: `${this.#i18n.resolve(board.name)} ${this.#i18n.resolve(board.finish)}`,
				date: formatDate(approvedOn, this.#i18n.locale()),
			}),
		);

		// The button the client just pressed is replaced by the confirmation bar,
		// so without this focus would drop back to the top of the document.
		afterNextRender(
			() => {
				const target = this.actions().find((ref) => ref.nativeElement.id === actionId(board.id));
				target?.nativeElement.focus();
			},
			{ injector: this.#injector },
		);
	}
}
