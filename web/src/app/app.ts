import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { SiteFooter } from "@bq/layout/site-footer/site-footer";
import { SiteHeader } from "@bq/layout/site-header/site-header";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet, SiteHeader, SiteFooter, TranslatePipe],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {}
