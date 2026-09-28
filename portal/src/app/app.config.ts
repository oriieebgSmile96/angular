import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";

/**
 * The portal is a single dashboard, so there is no router here.
 *
 * When it grows a second view — documents, messages, an invoice archive —
 * add `provideRouter` and lift `Dashboard` into a route. Nothing else changes.
 */
export const appConfig: ApplicationConfig = {
	providers: [provideBrowserGlobalErrorListeners()],
};
