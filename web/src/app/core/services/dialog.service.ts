import { Dialog, DialogConfig, DialogRef } from "@angular/cdk/dialog";
import { ComponentType } from "@angular/cdk/portal";
import { Injectable, inject } from "@angular/core";

/**
 * Thin wrapper over the CDK `Dialog` that applies the atelier's overlay styling.
 *
 * Dialog components are always imported statically at the top of the calling
 * file and passed in as a class — never loaded with a dynamic `import()`.
 */
@Injectable({ providedIn: "root" })
export class DialogService {
	readonly #dialog = inject(Dialog);

	open<TResult, TData, TComponent>(
		component: ComponentType<TComponent>,
		config?: DialogConfig<TData, DialogRef<TResult, TComponent>>,
	): DialogRef<TResult, TComponent> {
		return this.#dialog.open<TResult, TData, TComponent>(component, {
			backdropClass: "bq-overlay-backdrop",
			panelClass: "bq-dialog-pane",
			autoFocus: "first-tabbable",
			restoreFocus: true,
			hasBackdrop: true,
			...config,
		});
	}

	closeAll(): void {
		this.#dialog.closeAll();
	}
}
