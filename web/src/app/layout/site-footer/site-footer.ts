import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { ATELIER, FOOTER_LINKS } from "@bq/core/data/atelier.data";
import { BrandMark } from "@bq/shared/components/brand-mark/brand-mark";
import { RevealDirective } from "@bq/shared/motion/reveal.directive";
import { TranslatePipe } from "@bq/shared/pipes/translate.pipe";

@Component({
	selector: "bq-site-footer",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, BrandMark, RevealDirective, TranslatePipe],
	templateUrl: "./site-footer.html",
	styleUrl: "./site-footer.scss",
})
export class SiteFooter {
	protected readonly atelier = ATELIER;
	protected readonly quickLinks = FOOTER_LINKS.quickLinks;
}
