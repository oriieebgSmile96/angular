import { StyleSheet, Text, View } from "react-native";

import { AppThemeValue, useThemedStyles } from "@/theme/app-theme";

interface BadgeProps {
	label: string;
	tone?: "gold" | "surface";
}

export function Badge({ label, tone = "gold" }: BadgeProps) {
	const styles = useThemedStyles(createStyles);

	return (
		<View style={[styles.base, tone === "surface" && styles.surface]}>
			<Text style={styles.label}>{label}</Text>
		</View>
	);
}

const createStyles = ({ theme, type, isRtl }: AppThemeValue) =>
	StyleSheet.create({
		base: {
			alignSelf: "flex-start",
			paddingHorizontal: theme.space[3],
			paddingVertical: 6,
			borderRadius: theme.radius.sm,
			backgroundColor: theme.color.gold,
		},
		/** Deliberately not themed: this pill sits over a photograph, not the page. */
		surface: {
			backgroundColor: "rgba(255, 255, 255, 0.9)",
		},
		label: {
			...type.badge,
			textTransform: isRtl ? "none" : "uppercase",
		},
	});
