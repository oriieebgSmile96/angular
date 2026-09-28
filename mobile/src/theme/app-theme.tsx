import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useColorScheme } from "react-native";

import { ar } from "@/i18n/ar";
import { Dictionary, TranslationKey, en } from "@/i18n/en";
import { DIRECTION, LOCALE, Language, Localized, isLanguage } from "@/i18n/language";
import { Theme, TypeRamp, createPalette, createType, fontsByLanguage } from "@/theme/theme";
import { ThemeName } from "@/theme/tokens";

const THEME_KEY = "bq.theme";
const LANGUAGE_KEY = "bq.language";

const DICTIONARY: Readonly<Record<Language, Dictionary>> = { en, ar };

/** `system` tracks the OS setting for as long as the visitor leaves it alone. */
export type ThemePreference = ThemeName | "system";

export type TranslationParams = Readonly<Record<string, string | number>>;

export interface AppThemeValue {
	readonly theme: Theme;
	readonly type: TypeRamp;
	readonly fonts: (typeof fontsByLanguage)[Language];
	readonly themeName: ThemeName;
	readonly themePreference: ThemePreference;
	readonly isDark: boolean;

	readonly language: Language;
	readonly locale: string;
	readonly isRtl: boolean;
	/** `row-reverse` in Arabic, so a `flexDirection: "row"` mirrors with the script. */
	readonly row: "row" | "row-reverse";

	setThemePreference: (preference: ThemePreference) => void;
	toggleTheme: () => void;
	setLanguage: (language: Language) => void;
	toggleLanguage: () => void;
	/** Resolves a dictionary key, or a `Localized` value straight from the catalogue. */
	t: (value: TranslationKey | Localized, params?: TranslationParams) => string;
}

const AppThemeContext = createContext<AppThemeValue | null>(null);

/**
 * Holds the two preferences that restyle the whole app: palette and language.
 *
 * They live together because they are both read on nearly every render — a
 * component needs the palette for its colours and the language for its faces —
 * and splitting them would mean two context reads and two re-render paths for
 * what a visitor experiences as one setting screen.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
	const systemScheme = useColorScheme();
	const [themePreference, setStoredPreference] = useState<ThemePreference>("system");
	const [language, setStoredLanguage] = useState<Language>("en");

	useEffect(() => {
		void (async () => {
			const [theme, stored] = await AsyncStorage.multiGet([THEME_KEY, LANGUAGE_KEY]);
			const preference = theme[1];
			if (preference === "dark" || preference === "light" || preference === "system") {
				setStoredPreference(preference);
			}
			if (isLanguage(stored[1])) setStoredLanguage(stored[1]);
		})();
	}, []);

	const setThemePreference = useCallback((preference: ThemePreference) => {
		setStoredPreference(preference);
		void AsyncStorage.setItem(THEME_KEY, preference);
	}, []);

	const setLanguage = useCallback((next: Language) => {
		setStoredLanguage(next);
		void AsyncStorage.setItem(LANGUAGE_KEY, next);
	}, []);

	const value = useMemo<AppThemeValue>(() => {
		const themeName: ThemeName =
			themePreference === "system" ? (systemScheme === "light" ? "light" : "dark") : themePreference;

		const theme = createPalette(themeName);
		const dictionary = DICTIONARY[language];
		const isRtl = DIRECTION[language] === "rtl";

		return {
			theme,
			type: createType(theme, language),
			fonts: fontsByLanguage[language],
			themeName,
			themePreference,
			isDark: themeName === "dark",

			language,
			locale: LOCALE[language],
			isRtl,
			row: isRtl ? "row-reverse" : "row",

			setThemePreference,
			toggleTheme: () => setThemePreference(themeName === "dark" ? "light" : "dark"),
			setLanguage,
			toggleLanguage: () => setLanguage(language === "en" ? "ar" : "en"),
			t: (key, params) =>
				typeof key === "string"
					? interpolate(dictionary[key] ?? key, params)
					: key[language],
		};
	}, [themePreference, systemScheme, language, setThemePreference, setLanguage]);

	return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeValue {
	const value = useContext(AppThemeContext);
	if (!value) throw new Error("useAppTheme must be used inside <AppThemeProvider>");
	return value;
}

/**
 * Builds a stylesheet from the active theme, rebuilding it only when the theme
 * or language changes.
 *
 * `factory` must be declared at module scope so its identity is stable; passing
 * an inline arrow would rebuild the sheet on every render.
 */
export function useThemedStyles<T>(factory: (context: AppThemeValue) => T): T {
	const context = useAppTheme();
	return useMemo(() => factory(context), [factory, context]);
}

function interpolate(template: string, params?: TranslationParams): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in params ? String(params[name]) : match,
	);
}
