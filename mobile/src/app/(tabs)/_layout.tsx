import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";
import { tokens } from "@/theme/tokens";

export default function TabsLayout() {
	const { theme, t } = useAppTheme();
	const styles = useThemedStyles(createStyles);

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.color.textPrimary,
				tabBarInactiveTintColor: theme.color.textSecondary,
				tabBarStyle: styles.bar,
				tabBarLabelStyle: styles.label,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: t("tab.home"),
					tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: t("tab.search"),
					tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="saved"
				options={{
					title: t("tab.saved"),
					tabBarIcon: ({ color, size }) => <Feather name="heart" color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: t("tab.profile"),
					tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
				}}
			/>
		</Tabs>
	);
}

const createStyles = ({ theme, fonts }: AppThemeValue) =>
	StyleSheet.create({
		bar: {
			height: tokens.layout["tabbar-height"] + 18,
			paddingTop: theme.space[2],
			borderTopColor: theme.color.border,
			backgroundColor: theme.color.surface,
		},
		label: {
			fontFamily: fonts.bodyMedium,
			fontSize: 12,
		},
	});
