import { Platform } from "react-native";
import { useRouter } from "expo-router";

type AppRouter = ReturnType<typeof useRouter>;

/**
 * Returns to the previous screen, or home when there is nowhere to go.
 *
 * On web, `canGoBack()` can stay true after a reload even though the React
 * Navigation stack is empty — calling `back()` then logs an unhandled GO_BACK.
 */
export function goBackOrHome(router: AppRouter): void {
	if (Platform.OS === "web") {
		if (hasSameOriginHistory() && router.canGoBack()) {
			router.back();
			return;
		}

		router.replace("/");
		return;
	}

	if (router.canGoBack()) {
		router.back();
		return;
	}

	router.replace("/");
}

function hasSameOriginHistory(): boolean {
	if (typeof window === "undefined") return false;

	const nav = (
		window as Window & {
			navigation?: {
				currentEntry?: { index: number };
				entries?: () => readonly { url: string }[];
			};
		}
	).navigation;

	if (nav?.currentEntry && typeof nav.currentEntry.index === "number") {
		if (nav.currentEntry.index <= 0) return false;

		const previous = nav.entries?.()[nav.currentEntry.index - 1];
		if (!previous?.url) return false;

		try {
			return new URL(previous.url).origin === window.location.origin;
		} catch {
			return false;
		}
	}

	const idx = (window.history.state as { idx?: number } | null)?.idx;
	return typeof idx === "number" && idx > 0;
}
