import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GoldButton } from "@/components/ui/gold-button";
import { IconButton } from "@/components/ui/icon-button";
import { Rating } from "@/components/ui/rating";
import { findProduct } from "@/data/catalogue";
import { useCollection } from "@/features/collection/collection-store";
import { TranslationKey } from "@/i18n/en";
import { goBackOrHome } from "@/lib/navigation";
import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

export default function ProductScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { isSaved, toggle } = useCollection();
	const { theme, type, locale, isRtl, row, t } = useAppTheme();
	const styles = useThemedStyles(createStyles);

	const product = findProduct(id);
	const [finishId, setFinishId] = useState(product?.finishes[0]?.id ?? "");

	if (!product) {
		return (
			<View style={[styles.missing, { paddingTop: insets.top + theme.space[8] }]}>
				<Text style={type.heading}>{t("product.missing")}</Text>
				<GoldButton
					label={t("common.backToCollections")}
					variant="outline"
					onPress={() => router.replace("/")}
				/>
			</View>
		);
	}

	const finish = product.finishes.find((option) => option.id === finishId) ?? product.finishes[0];
	const saved = isSaved(product.id);
	const attributes: readonly { key: TranslationKey; value: string }[] = [
		{ key: "product.collection", value: t(product.collection) },
		{ key: "product.finish", value: t(product.finishType) },
		{ key: "product.reference", value: product.reference },
	];

	return (
		<View style={styles.screen}>
			<Stack.Screen options={{ title: t(product.name) }} />

			<Image source={product.image} style={styles.hero} contentFit="cover" transition={250} />

			<View style={[styles.heroBar, { top: insets.top + theme.space[2], flexDirection: row }]}>
				<IconButton
					icon={isRtl ? "arrow-right" : "arrow-left"}
					label={t("common.goBack")}
					onPress={() => goBackOrHome(router)}
				/>
				<IconButton
					icon="heart"
					label={t(saved ? "product.unsave" : "product.save")}
					color={saved ? theme.color.gold : theme.color.textPrimary}
					onPress={() => toggle(product.id)}
				/>
			</View>

			<ScrollView
				style={styles.sheet}
				contentContainerStyle={styles.sheetContent}
				showsVerticalScrollIndicator={false}>
				<View style={styles.handle} />

				<View style={[styles.titleRow, { flexDirection: row }]}>
					<View style={styles.titleCopy}>
						<Text style={styles.categoryPath}>{t(product.categoryPath).toUpperCase()}</Text>
						<Text style={type.title}>{t(product.name)}</Text>
					</View>
					<View style={styles.priceCopy}>
						<Text style={type.caption}>{t("product.incVat")}</Text>
						<Text style={type.title}>
							{product.price.toLocaleString(locale)} {t(product.currency)}
						</Text>
					</View>
				</View>

				<Rating value={product.rating} reviews={product.reviews} />

				<Text style={styles.description}>{t(product.description)}</Text>

				<View style={[styles.finishHeader, { flexDirection: row }]}>
					<Text style={type.label}>{t("product.paintFinish")}</Text>
					<Text style={styles.finishName}>{t(finish.label)}</Text>
				</View>

				<View style={[styles.swatches, { flexDirection: row }]}>
					{product.finishes.map((option) => {
						const selected = option.id === finish.id;
						return (
							<Pressable
								key={option.id}
								accessibilityRole="radio"
								accessibilityState={{ selected }}
								accessibilityLabel={t(option.label)}
								onPress={() => setFinishId(option.id)}
								style={[styles.swatchRing, selected && styles.swatchRingSelected]}>
								<View style={[styles.swatch, { backgroundColor: option.color }]} />
							</Pressable>
						);
					})}
				</View>

				<View style={[styles.attributes, { flexDirection: row }]}>
					{attributes.map((attribute) => (
						<View key={attribute.key} style={styles.attribute}>
							<Text style={type.caption}>{t(attribute.key).toUpperCase()}</Text>
							<Text style={type.body}>{attribute.value}</Text>
						</View>
					))}
				</View>

				<Text style={[type.label, styles.detailsLabel]}>{t("product.details")}</Text>

				<View style={styles.specs}>
					{product.specs.map((spec) => (
						<View key={spec.label.en} style={styles.specRow}>
							<Text style={styles.specLabel}>{t(spec.label)}</Text>
							<Text style={type.body}>{t(spec.value)}</Text>
						</View>
					))}
				</View>
			</ScrollView>

			<View
				style={[
					styles.actionBar,
					{ flexDirection: row, paddingBottom: insets.bottom + theme.space[3] },
				]}>
				<GoldButton
					label={t("product.addToCollection")}
					onPress={() => toggle(product.id)}
					style={styles.actionButton}
				/>
			</View>
		</View>
	);
}

const createStyles = ({ theme, type }: AppThemeValue) =>
	StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.color.background,
		},
		missing: {
			flex: 1,
			gap: theme.space[5],
			paddingHorizontal: theme.space[5],
			backgroundColor: theme.color.background,
		},
		hero: {
			width: "100%",
			height: "47%",
			backgroundColor: theme.color.surfaceMuted,
		},
		heroBar: {
			position: "absolute",
			left: theme.space[5],
			right: theme.space[5],
			justifyContent: "space-between",
		},
		sheet: {
			flex: 1,
			marginTop: -theme.space[6],
			borderTopLeftRadius: theme.radius.xl,
			borderTopRightRadius: theme.radius.xl,
			backgroundColor: theme.color.surface,
		},
		sheetContent: {
			gap: theme.space[4],
			paddingHorizontal: theme.space[5],
			paddingTop: theme.space[3],
			paddingBottom: theme.space[9],
		},
		handle: {
			alignSelf: "center",
			width: 44,
			height: 4,
			borderRadius: theme.radius.pill,
			backgroundColor: theme.color.border,
		},
		titleRow: {
			alignItems: "flex-end",
			justifyContent: "space-between",
			gap: theme.space[4],
		},
		titleCopy: {
			flex: 1,
			gap: 2,
		},
		categoryPath: {
			...type.control,
			letterSpacing: 0.56,
			color: theme.color.goldStrong,
		},
		/** Sits opposite the title, so it hugs whichever edge the script ends on. */
		priceCopy: {
			alignItems: "flex-end",
		},
		description: {
			...type.body,
			color: theme.color.goldStrong,
		},
		finishHeader: {
			alignItems: "center",
			justifyContent: "space-between",
		},
		finishName: {
			fontFamily: type.headingSmall.fontFamily,
			fontSize: 12,
			lineHeight: 16,
			letterSpacing: 0.96,
			color: theme.color.goldStrong,
		},
		swatches: {
			flexWrap: "wrap",
			gap: theme.space[2],
		},
		swatchRing: {
			width: 40,
			height: 40,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: theme.radius.pill,
			borderWidth: 1,
			borderColor: "transparent",
		},
		swatchRingSelected: {
			borderColor: theme.color.textPrimary,
		},
		swatch: {
			width: 30,
			height: 30,
			borderRadius: theme.radius.pill,
		},
		attributes: {
			justifyContent: "space-between",
			paddingVertical: theme.space[3],
			borderTopWidth: 1,
			borderBottomWidth: 1,
			borderColor: theme.color.border,
		},
		attribute: {
			flex: 1,
			gap: 2,
		},
		detailsLabel: {
			marginTop: theme.space[1],
		},
		specs: {
			gap: theme.space[3],
		},
		specRow: {
			gap: 2,
		},
		specLabel: {
			...type.caption,
			color: theme.color.goldStrong,
		},
		actionBar: {
			alignItems: "center",
			gap: theme.space[3],
			paddingHorizontal: theme.space[5],
			paddingTop: theme.space[3],
			borderTopWidth: 1,
			borderTopColor: theme.color.border,
			backgroundColor: theme.color.surface,
		},
		actionButton: {
			flex: 1,
		},
	});
