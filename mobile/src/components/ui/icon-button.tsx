import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, ViewStyle } from "react-native";

import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

interface IconButtonProps {
	icon: FeatherName;
	label: string;
	onPress: () => void;
	size?: number;
	/** Overrides the glyph colour. Defaults to the active theme's primary text. */
	color?: string;
	tone?: "surface" | "outline" | "gold";
	style?: ViewStyle;
	/**
	 * Set when this control sits beside — not inside — a larger press target.
	 * On web, `Pressable` with `accessibilityRole="button"` renders a `<button>`,
	 * and HTML forbids nesting buttons.
	 */
	nested?: boolean;
}

/** Circular tap target used for back, favourite and notification affordances. */
export function IconButton({
	icon,
	label,
	onPress,
	size = 20,
	color,
	tone = "surface",
	style,
	nested = false,
}: IconButtonProps) {
	const { theme } = useAppTheme();
	const styles = useThemedStyles(createStyles);
	const webSafe = nested || Platform.OS === "web";

	const handlePress: NonNullable<React.ComponentProps<typeof Pressable>["onPress"]> = (event) => {
		event?.stopPropagation?.();
		onPress();
	};

	return (
		<Pressable
			// Web maps `accessibilityRole="button"` to a real `<button>`; skip it so
			// overlapping press targets never produce nested-button DOM errors.
			accessibilityRole={webSafe ? undefined : "button"}
			accessibilityLabel={label}
			hitSlop={8}
			onPress={handlePress}
			style={({ pressed }) => [styles.base, styles[tone], pressed && styles.pressed, style]}>
			<Feather
				name={icon}
				size={size}
				color={tone === "gold" ? theme.color.textOnGold : (color ?? theme.color.textPrimary)}
			/>
		</Pressable>
	);
}

const createStyles = ({ theme }: AppThemeValue) =>
	StyleSheet.create({
		base: {
			width: 44,
			height: 44,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: theme.radius.pill,
		},
		surface: {
			backgroundColor: theme.color.surface,
		},
		outline: {
			borderWidth: 1,
			borderColor: theme.color.border,
			backgroundColor: theme.color.surface,
		},
		gold: {
			backgroundColor: theme.color.gold,
		},
		pressed: {
			opacity: 0.75,
		},
	});
