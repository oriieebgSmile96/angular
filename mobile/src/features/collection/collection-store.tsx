import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";

interface CollectionContextValue {
	saved: readonly string[];
	isSaved: (productId: string) => boolean;
	toggle: (productId: string) => void;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

/**
 * In-memory list of saved pieces.
 *
 * Frontend-only: swap the `useState` for persisted storage or an account API
 * without touching any screen.
 */
export function CollectionProvider({ children }: { children: ReactNode }) {
	const [saved, setSaved] = useState<readonly string[]>([]);

	const toggle = useCallback((productId: string) => {
		setSaved((current) =>
			current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
		);
	}, []);

	const value = useMemo<CollectionContextValue>(
		() => ({ saved, toggle, isSaved: (productId) => saved.includes(productId) }),
		[saved, toggle],
	);

	return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection(): CollectionContextValue {
	const context = useContext(CollectionContext);
	if (!context) throw new Error("useCollection must be used inside a CollectionProvider");
	return context;
}
