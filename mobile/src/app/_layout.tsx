import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CollectionProvider } from "@/features/collection/collection-store";
import { AppThemeProvider, useAppTheme } from "@/theme/app-theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	// These keys are the `fontFamily` values in `theme.ts` — keep them in step.
	const [fontsLoaded] = useFonts({
		PlayfairDisplay_400Regular: require("../../assets/fonts/PlayfairDisplay_400Regular.ttf"),
		PlayfairDisplay_600SemiBold: require("../../assets/fonts/PlayfairDisplay_600SemiBold.ttf"),
		PlayfairDisplay_700Bold: require("../../assets/fonts/PlayfairDisplay_700Bold.ttf"),
		Poppins_400Regular: require("../../assets/fonts/Poppins_400Regular.ttf"),
		Poppins_500Medium: require("../../assets/fonts/Poppins_500Medium.ttf"),
		Poppins_600SemiBold: require("../../assets/fonts/Poppins_600SemiBold.ttf"),
		Poppins_700Bold: require("../../assets/fonts/Poppins_700Bold.ttf"),
		Amiri_400Regular: require("../../assets/fonts/Amiri_400Regular.ttf"),
		Amiri_700Bold: require("../../assets/fonts/Amiri_700Bold.ttf"),
		Tajawal_400Regular: require("../../assets/fonts/Tajawal_400Regular.ttf"),
		Tajawal_500Medium: require("../../assets/fonts/Tajawal_500Medium.ttf"),
		Tajawal_700Bold: require("../../assets/fonts/Tajawal_700Bold.ttf"),
	});

	useEffect(() => {
		if (fontsLoaded) void SplashScreen.hideAsync();
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return (
		<SafeAreaProvider>
			<AppThemeProvider>
				<CollectionProvider>
					<ThemedStack />
				</CollectionProvider>
			</AppThemeProvider>
		</SafeAreaProvider>
	);
}

/** Split out so it sits below the provider and can read the active theme. */
function ThemedStack() {
	const { theme, isDark } = useAppTheme();

	return (
		<>
			<StatusBar style={isDark ? "light" : "dark"} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: theme.color.background },
				}}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="product/[id]" options={{ presentation: "card" }} />
				<Stack.Screen name="booking" options={{ presentation: "card" }} />
			</Stack>
		</>
	);
}
