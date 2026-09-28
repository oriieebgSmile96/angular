import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

interface RatingProps {
	value: number;
	reviews: string;
}

const MAX_STARS = 5;

export function Rating({ value, reviews }: RatingProps) {
	const { theme, t } = useAppTheme();
	const styles = useThemedStyles(createStyles);
	const filled = Math.round(value);

	return (
		<View
			accessibilityRole="text"
			accessibilityLabel={t("rating.label", { value, count: reviews })}
			style={styles.row}>
			<View style={styles.stars}>
				{Array.from({ length: MAX_STARS }, (_, index) => (
					<FontAwesome
						key={index}
						name="star"
						size={13}
						color={index < filled ? theme.color.goldStrong : theme.color.border}
					/>
				))}
			</View>
			<Text style={styles.summary}>{t("rating.summary", { value, count: reviews })}</Text>
		</View>
	);
}

const createStyles = ({ theme, type, row }: AppThemeValue) =>
	StyleSheet.create({
		row: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[2],
		},
		/** Mirrors too: the filled stars run from the side the reader starts on. */
		stars: {
			flexDirection: row,
			gap: 2,
		},
		summary: type.caption,
	});
