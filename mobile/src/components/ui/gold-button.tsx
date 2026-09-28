import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

type Variant = "primary" | "outline";

interface GoldButtonProps {
	label: string;
	onPress: () => void;
	variant?: Variant;
	disabled?: boolean;
	loading?: boolean;
	style?: ViewStyle;
}

export function GoldButton({
	label,
	onPress,
	variant = "primary",
	disabled = false,
	loading = false,
	style,
}: GoldButtonProps) {
	const { theme } = useAppTheme();
	const styles = useThemedStyles(createStyles);
	const inactive = disabled || loading;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled: inactive, busy: loading }}
			disabled={inactive}
			onPress={onPress}
			style={({ pressed }) => [
				styles.base,
				variant === "primary" ? styles.primary : styles.outline,
				pressed && !inactive && styles.pressed,
				inactive && styles.disabled,
				style,
			]}>
			{loading ? (
				<ActivityIndicator
					color={variant === "primary" ? theme.color.textOnGold : theme.color.goldStrong}
				/>
			) : (
				<Text style={[styles.label, variant === "outline" && styles.labelOutline]}>{label}</Text>
			)}
		</Pressable>
	);
}

const createStyles = ({ theme, type }: AppThemeValue) =>
	StyleSheet.create({
		base: {
			minHeight: 48,
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: theme.space[6],
			borderRadius: theme.radius.control,
			borderWidth: 1,
		},
		primary: {
			backgroundColor: theme.color.gold,
			borderColor: theme.color.gold,
		},
		outline: {
			backgroundColor: "transparent",
			borderColor: theme.color.goldStrong,
		},
		pressed: {
			opacity: 0.86,
		},
		disabled: {
			opacity: 0.45,
		},
		label: {
			...type.button,
			color: theme.color.textOnGold,
		},
		labelOutline: {
			color: theme.color.goldStrong,
		},
	});
