import { ChangeDetectionStrategy, Component } from "@angular/core";

import { Dashboard } from "@bq/features/dashboard/dashboard";
import { PortalFooter } from "@bq/layout/portal-footer/portal-footer";
import { PortalHeader } from "@bq/layout/portal-header/portal-header";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Dashboard, PortalFooter, PortalHeader, TranslatePipe],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {}
