import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Chip } from "@/components/ui/chip";
import { CATEGORIES, PRODUCTS } from "@/data/catalogue";
import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

export default function SearchScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { theme, type, isRtl, locale, t } = useAppTheme();
	const styles = useThemedStyles(createStyles);
	const chipTrack = useRef<FlatList>(null);

	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");

	const results = useMemo(() => {
		const term = query.trim().toLowerCase();
		return PRODUCTS.filter((product) => {
			const matchesTerm = term
				? `${t(product.name)} ${t(product.category)} ${t(product.description)}`
						.toLowerCase()
						.includes(term)
				: true;
			const matchesCategory = category === "all" ? true : product.categoryId === category;
			return matchesTerm && matchesCategory;
		});
	}, [query, category, t]);

	return (
		<View style={[styles.screen, { paddingTop: insets.top + theme.space[4] }]}>
			<Text style={type.title}>{t("search.title")}</Text>

			<View style={styles.search}>
				<Feather name="search" size={18} color={theme.color.textSecondary} />
				<TextInput
					accessibilityLabel={t("search.label")}
					placeholder={t("search.placeholder")}
					placeholderTextColor={theme.color.textSecondary}
					value={query}
					onChangeText={setQuery}
					style={styles.input}
				/>
			</View>

			<FlatList
				ref={chipTrack}
				horizontal
				data={CATEGORIES}
				keyExtractor={(item) => item.id}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.chips}
				style={styles.chipList}
				// The filter row reads with the script: in Arabic it runs right to
				// left and has to open on its right-hand edge, which React Native
				// only does by itself under native RTL.
				onContentSizeChange={() => {
					if (isRtl) chipTrack.current?.scrollToEnd({ animated: false });
				}}
				renderItem={({ item }) => (
					<Chip
						label={t(item.label)}
						selected={category === item.id}
						onPress={() => setCategory(item.id)}
					/>
				)}
			/>

			<FlatList
				data={results}
				keyExtractor={(item) => item.id}
				numColumns={2}
				columnWrapperStyle={styles.column}
				contentContainerStyle={styles.grid}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Text style={type.bodyMuted}>{t("search.empty")}</Text>
						<Text style={type.caption}>{t("search.emptyHint")}</Text>
					</View>
				}
				renderItem={({ item }) => (
					<Pressable
						accessibilityRole="button"
						onPress={() => router.push(`/product/${item.id}`)}
						style={styles.card}>
						<Image
							source={item.image}
							style={styles.cardImage}
							contentFit="cover"
							transition={200}
						/>
						<Text style={type.headingSmall}>{t(item.name)}</Text>
						<Text style={styles.cardPrice}>
							{item.price.toLocaleString(locale)} {t(item.currency)}
						</Text>
					</Pressable>
				)}
			/>
		</View>
	);
}

const createStyles = ({ theme, type, fonts, row, isRtl }: AppThemeValue) =>
	StyleSheet.create({
		screen: {
			flex: 1,
			gap: theme.space[4],
			paddingHorizontal: theme.space[5],
			backgroundColor: theme.color.background,
		},
		search: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[3],
			height: 56,
			paddingHorizontal: theme.space[4],
			borderRadius: theme.radius.lg,
			backgroundColor: theme.color.surfaceMuted,
		},
		input: {
			flex: 1,
			fontFamily: fonts.bodyRegular,
			fontSize: 14,
			color: theme.color.textPrimary,
			textAlign: isRtl ? "right" : "left",
			writingDirection: isRtl ? "rtl" : "ltr",
		},
		chipList: {
			flexGrow: 0,
		},
		chips: {
			flexDirection: row,
			gap: theme.space[2],
			paddingEnd: theme.space[4],
		},
		grid: {
			gap: theme.space[4],
			paddingBottom: theme.space[8],
		},
		column: {
			flexDirection: row,
			gap: theme.space[4],
		},
		card: {
			flex: 1,
			gap: theme.space[1],
		},
		cardImage: {
			width: "100%",
			height: 180,
			borderRadius: theme.radius.lg,
			backgroundColor: theme.color.surfaceMuted,
		},
		cardPrice: {
			...type.caption,
			color: theme.color.gold,
		},
		empty: {
			gap: theme.space[1],
		},
	});
