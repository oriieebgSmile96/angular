import { ChangeDetectionStrategy, Component } from "@angular/core";

import { BoardsSection } from "@bq/features/dashboard/sections/boards-section/boards-section";
import { InvoiceSection } from "@bq/features/dashboard/sections/invoice-section/invoice-section";
import { TimelineSection } from "@bq/features/dashboard/sections/timeline-section/timeline-section";
import { SectionDivider } from "@bq/shared/components/section-divider/section-divider";

/**
 * The one view the portal has: everything the client needs about their project,
 * in the order they ask for it — where the build has got to, what needs their
 * sign-off, and what they owe.
 */
@Component({
	selector: "bq-dashboard",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [BoardsSection, InvoiceSection, SectionDivider, TimelineSection],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard {}
