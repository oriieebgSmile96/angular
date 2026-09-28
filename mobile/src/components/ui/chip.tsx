import { Pressable, StyleSheet, Text } from "react-native";

import { AppThemeValue, useThemedStyles } from "@/theme/app-theme";

interface ChipProps {
	label: string;
	selected: boolean;
	onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
	const styles = useThemedStyles(createStyles);

	return (
		<Pressable
			accessibilityRole="tab"
			accessibilityState={{ selected }}
			onPress={onPress}
			style={({ pressed }) => [styles.base, selected && styles.selected, pressed && styles.pressed]}>
			<Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
		</Pressable>
	);
}

const createStyles = ({ theme, type }: AppThemeValue) =>
	StyleSheet.create({
		base: {
			minHeight: 40,
			justifyContent: "center",
			paddingHorizontal: theme.space[5],
			borderRadius: theme.radius.pill,
			backgroundColor: theme.color.surfaceMuted,
		},
		selected: {
			backgroundColor: theme.color.surfaceInverse,
		},
		pressed: {
			opacity: 0.8,
		},
		label: {
			...type.control,
			color: theme.color.textSecondary,
		},
		labelSelected: {
			color: theme.color.textInverse,
		},
	});
