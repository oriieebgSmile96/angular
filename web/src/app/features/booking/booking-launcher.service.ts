import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { DialogService } from "@bq/core/services/dialog.service";
import { BookingDialog, BookingDialogResult } from "@bq/features/booking/booking-dialog";

/**
 * Single entry point for opening the consultation flow.
 *
 * The dialog class is imported statically at the top of this file — never with
 * a dynamic `import()` — so the overlay opens in the same frame it is asked for.
 */
@Injectable({ providedIn: "root" })
export class BookingLauncher {
	readonly #dialogs = inject(DialogService);

	open(): Observable<BookingDialogResult | undefined> {
		return this.#dialogs.open<BookingDialogResult, undefined, BookingDialog>(BookingDialog).closed;
	}
}
