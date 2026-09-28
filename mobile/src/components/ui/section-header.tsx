import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppThemeValue, useThemedStyles } from "@/theme/app-theme";

interface SectionHeaderProps {
	title: string;
	actionLabel?: string;
	onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
	const styles = useThemedStyles(createStyles);

	return (
		<View style={styles.row}>
			<Text style={styles.title}>{title}</Text>
			{actionLabel && onAction ? (
				<Pressable accessibilityRole="button" hitSlop={8} onPress={onAction}>
					<Text style={styles.action}>{actionLabel}</Text>
				</Pressable>
			) : null}
		</View>
	);
}

const createStyles = ({ theme, type, row }: AppThemeValue) =>
	StyleSheet.create({
		row: {
			flexDirection: row,
			alignItems: "center",
			justifyContent: "space-between",
			marginBottom: theme.space[2],
		},
		title: type.title,
		action: type.action,
	});
