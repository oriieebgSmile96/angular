import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ReactNode, useMemo, useRef, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleProp,
	StyleSheet,
	Text,
	TextInput,
	View,
	ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { AVATAR, CATEGORIES, COLLECTIONS, FEATURED, PRODUCTS } from "@/data/catalogue";
import { useCollection } from "@/features/collection/collection-store";
import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

export default function HomeScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { isSaved, toggle } = useCollection();
	const { theme, type, isRtl, locale, t } = useAppTheme();
	const styles = useThemedStyles(createStyles);

	const [category, setCategory] = useState("all");
	const [query, setQuery] = useState("");

	const pieces = useMemo(() => {
		const term = query.trim().toLowerCase();
		const byCategory =
			category === "all" ? PRODUCTS : PRODUCTS.filter((product) => product.categoryId === category);
		if (!term) return byCategory;
		return byCategory.filter((product) =>
			`${t(product.name)} ${t(product.categoryPath)}`.toLowerCase().includes(term),
		);
	}, [category, query, t]);

	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.space[4] }]}
			showsVerticalScrollIndicator={false}>
			<View style={styles.greetingRow}>
				<View style={styles.greetingCopy}>
					<Text style={type.eyebrow}>{t("home.welcome")}</Text>
					<Text style={styles.greetingTitle}>{t("home.title")}</Text>
				</View>
				<View style={styles.greetingActions}>
					<IconButton
						icon="bell"
						label={t("common.bookConsultation")}
						tone="outline"
						onPress={() => router.push("/booking")}
					/>
					<Image source={AVATAR} style={styles.avatar} contentFit="cover" transition={200} />
				</View>
			</View>

			<View style={styles.search}>
				<Feather name="search" size={18} color={theme.color.textSecondary} />
				<TextInput
					accessibilityLabel={t("home.searchLabel")}
					placeholder={t("home.searchPlaceholder")}
					placeholderTextColor={theme.color.textSecondary}
					value={query}
					onChangeText={setQuery}
					style={styles.searchInput}
				/>
			</View>

			<Carousel contentStyle={styles.chipRow}>
				{CATEGORIES.map((item) => (
					<Chip
						key={item.id}
						label={t(item.label)}
						selected={category === item.id}
						onPress={() => setCategory(item.id)}
					/>
				))}
			</Carousel>

			<View style={styles.featured}>
				<Image
					source={FEATURED.image}
					style={StyleSheet.absoluteFill}
					contentFit="cover"
					transition={250}
				/>
				<LinearGradient
					colors={["rgba(10,10,12,0.05)", "rgba(10,10,12,0.78)"]}
					style={StyleSheet.absoluteFill}
				/>
				<View style={styles.featuredTop}>
					<Badge label={t(FEATURED.badge)} />
					<IconButton
						icon="heart"
						label={t("home.saveFeatured")}
						tone="outline"
						color={isSaved("featured") ? theme.color.gold : theme.color.textInverse}
						onPress={() => toggle("featured")}
					/>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel={t("home.featuredLabel", { title: t(FEATURED.title) })}
					onPress={() => router.push(`/product/${PRODUCTS[0].id}`)}
					style={styles.featuredBottom}>
					<View style={styles.featuredCopy}>
						<Text style={styles.featuredSeason}>{t(FEATURED.season)}</Text>
						<Text style={styles.featuredTitle}>{t(FEATURED.title)}</Text>
					</View>
					<View style={styles.featuredCue}>
						<Feather
							name={isRtl ? "arrow-left" : "arrow-right"}
							size={20}
							color={theme.color.textOnGold}
						/>
					</View>
				</Pressable>
			</View>

			<View style={styles.section}>
				<SectionHeader
					title={t("home.collections")}
					actionLabel={t("common.seeAll")}
					onAction={() => router.push("/search")}
				/>
				<Carousel contentStyle={styles.cardRow}>
					{COLLECTIONS.map((collection) => (
						<Pressable
							key={collection.id}
							accessibilityRole="button"
							accessibilityLabel={t("home.collectionLabel", {
								title: t(collection.title),
								count: collection.pieces,
							})}
							onPress={() => router.push("/search")}
							style={styles.collectionCard}>
							<Image
								source={collection.image}
								style={styles.collectionImage}
								contentFit="cover"
								transition={200}
							/>
							<View style={styles.collectionBadge}>
								<Badge label={t(collection.badge)} />
							</View>
							<Text style={type.headingSmall}>{t(collection.title)}</Text>
							<Text style={styles.collectionMeta}>
								{t("common.pieces", { count: collection.pieces })}
							</Text>
						</Pressable>
					))}
				</Carousel>
			</View>

			<View style={styles.section}>
				<SectionHeader
					title={t("home.forYou")}
					actionLabel={t("common.seeAll")}
					onAction={() => router.push("/search")}
				/>
				<Carousel contentStyle={styles.cardRow}>
					{pieces.map((product) => (
						<Pressable
							key={product.id}
							accessibilityRole="button"
							accessibilityLabel={t("home.pieceLabel", {
								name: t(product.name),
								price: product.price.toLocaleString(locale),
								currency: t(product.currency),
							})}
							onPress={() => router.push(`/product/${product.id}`)}
							style={styles.pieceCard}>
							<Image
								source={product.image}
								style={styles.pieceImage}
								contentFit="cover"
								transition={200}
							/>
							<Text style={type.kicker}>{t(product.category).toUpperCase()}</Text>
							<Text style={type.heading}>{t(product.name)}</Text>
							<Text style={type.heading}>
								{product.price.toLocaleString(locale)} {t(product.currency)}
							</Text>
						</Pressable>
					))}
				</Carousel>
			</View>
		</ScrollView>
	);
}

/**
 * A carousel is a sequence the reader follows, so in Arabic it lays out right
 * to left and opens on its right-hand edge.
 *
 * React Native only flips a scroll axis when native RTL is switched on, which
 * needs a reload and which this app avoids — mirroring is done in JS through
 * `row`. So the opening offset is placed by hand: with the content reversed,
 * the far end of the track is where the first card sits.
 */
function Carousel({
	contentStyle,
	children,
}: {
	contentStyle: StyleProp<ViewStyle>;
	children: ReactNode;
}) {
	const { isRtl } = useAppTheme();
	const styles = useThemedStyles(createCarouselStyles);
	const track = useRef<ScrollView>(null);

	return (
		<ScrollView
			ref={track}
			horizontal
			showsHorizontalScrollIndicator={false}
			onContentSizeChange={() => {
				if (isRtl) track.current?.scrollToEnd({ animated: false });
			}}
			contentContainerStyle={[contentStyle, styles.track]}>
			{children}
		</ScrollView>
	);
}

const createCarouselStyles = ({ row }: AppThemeValue) =>
	StyleSheet.create({
		track: {
			flexDirection: row,
		},
	});

const createStyles = ({ theme, type, fonts, row, isRtl }: AppThemeValue) =>
	StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.color.background,
		},
		content: {
			paddingHorizontal: theme.space[5],
			paddingBottom: theme.space[10],
			gap: theme.space[5],
		},
		greetingRow: {
			flexDirection: row,
			alignItems: "flex-start",
			justifyContent: "space-between",
			gap: theme.space[4],
		},
		greetingCopy: {
			flex: 1,
			gap: theme.space[1],
		},
		greetingTitle: {
			...type.title,
			color: theme.color.goldStrong,
		},
		greetingActions: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[3],
		},
		avatar: {
			width: 40,
			height: 40,
			borderRadius: theme.radius.pill,
			backgroundColor: theme.color.surfaceMuted,
		},
		search: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[3],
			height: 50,
			paddingHorizontal: theme.space[4],
			borderRadius: theme.radius.control,
			backgroundColor: theme.color.surfaceMuted,
		},
		searchInput: {
			flex: 1,
			fontFamily: fonts.bodyRegular,
			fontSize: 14,
			color: theme.color.textPrimary,
			textAlign: isRtl ? "right" : "left",
			writingDirection: isRtl ? "rtl" : "ltr",
		},
		chipRow: {
			gap: theme.space[2],
			paddingEnd: theme.space[4],
		},
		featured: {
			position: "relative",
			height: 272,
			borderRadius: theme.radius.lg,
			overflow: "hidden",
			justifyContent: "space-between",
			padding: theme.space[4],
			backgroundColor: theme.color.surfaceMuted,
		},
		featuredTop: {
			flexDirection: row,
			alignItems: "flex-start",
			justifyContent: "space-between",
		},
		featuredBottom: {
			flexDirection: row,
			alignItems: "flex-end",
			justifyContent: "space-between",
		},
		featuredCopy: {
			flex: 1,
			gap: theme.space[1],
		},
		featuredSeason: {
			fontFamily: fonts.bodySemiBold,
			fontSize: 16,
			lineHeight: 24,
			letterSpacing: isRtl ? 0 : 0.64,
			textTransform: isRtl ? "none" : "uppercase",
			textAlign: isRtl ? "right" : "left",
			writingDirection: isRtl ? "rtl" : "ltr",
			color: theme.color.textSecondary,
		},
		featuredTitle: {
			...type.title,
			color: theme.color.gold,
		},
		featuredCue: {
			width: 48,
			height: 48,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: theme.radius.pill,
			backgroundColor: theme.color.gold,
		},
		section: {
			gap: theme.space[3],
		},
		cardRow: {
			gap: theme.space[3],
			paddingEnd: theme.space[4],
		},
		collectionCard: {
			width: 166,
			gap: theme.space[1],
		},
		collectionImage: {
			width: "100%",
			height: 200,
			marginBottom: theme.space[2],
			borderRadius: theme.radius.lg,
			backgroundColor: theme.color.surfaceMuted,
		},
		collectionBadge: {
			position: "absolute",
			top: theme.space[3],
			start: theme.space[3],
		},
		collectionMeta: {
			...type.caption,
			color: theme.color.gold,
		},
		pieceCard: {
			width: 145,
			gap: 2,
		},
		pieceImage: {
			width: "100%",
			height: 133,
			marginBottom: theme.space[2],
			borderRadius: theme.radius.md,
			backgroundColor: theme.color.surfaceMuted,
		},
	});
