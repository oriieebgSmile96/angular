import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GoldButton } from "@/components/ui/gold-button";
import { IconButton } from "@/components/ui/icon-button";
import { PRODUCTS } from "@/data/catalogue";
import { useCollection } from "@/features/collection/collection-store";
import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

export default function SavedScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { saved, toggle } = useCollection();
	const { theme, type, locale, t } = useAppTheme();
	const styles = useThemedStyles(createStyles);

	const pieces = PRODUCTS.filter((product) => saved.includes(product.id));

	return (
		<View style={[styles.screen, { paddingTop: insets.top + theme.space[4] }]}>
			<Text style={type.eyebrow}>{t("saved.eyebrow")}</Text>
			<Text style={type.title}>{t("saved.title")}</Text>

			<FlatList
				data={pieces}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.empty}>
						<View style={styles.emptyCopy}>
							<Text style={[type.heading, styles.centered]}>{t("saved.empty")}</Text>
							<Text style={[type.bodyMuted, styles.centered]}>{t("saved.emptyHint")}</Text>
						</View>
						<GoldButton
							label={t("saved.browse")}
							variant="outline"
							onPress={() => router.push("/")}
						/>
					</View>
				}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("home.pieceLabel", {
								name: t(item.name),
								price: item.price.toLocaleString(locale),
								currency: t(item.currency),
							})}
							onPress={() => router.push(`/product/${item.id}`)}
							style={styles.rowMain}>
							<Image source={item.image} style={styles.image} contentFit="cover" transition={200} />
							<View style={styles.copy}>
								<Text style={type.kicker}>{t(item.category).toUpperCase()}</Text>
								<Text style={type.heading}>{t(item.name)}</Text>
								<Text style={styles.price}>
									{item.price.toLocaleString(locale)} {t(item.currency)}
								</Text>
							</View>
						</Pressable>
						<IconButton
							icon="x"
							label={t("saved.remove", { name: t(item.name) })}
							tone="outline"
							onPress={() => toggle(item.id)}
						/>
					</View>
				)}
			/>
		</View>
	);
}

const createStyles = ({ theme, type, row }: AppThemeValue) =>
	StyleSheet.create({
		screen: {
			flex: 1,
			gap: theme.space[2],
			paddingHorizontal: theme.space[5],
			backgroundColor: theme.color.background,
		},
		list: {
			gap: theme.space[3],
			paddingTop: theme.space[4],
			paddingBottom: theme.space[8],
		},
		row: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[4],
			padding: theme.space[3],
			borderRadius: theme.radius.lg,
			backgroundColor: theme.color.surfaceMuted,
		},
		rowMain: {
			flex: 1,
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[4],
		},
		image: {
			width: 76,
			height: 76,
			borderRadius: theme.radius.md,
			backgroundColor: theme.color.border,
		},
		copy: {
			flex: 1,
			gap: 2,
		},
		price: {
			...type.caption,
			color: theme.color.gold,
		},
		empty: {
			gap: theme.space[5],
			paddingTop: theme.space[9],
		},
		emptyCopy: {
			gap: theme.space[2],
		},
		centered: {
			textAlign: "center",
		},
	});
