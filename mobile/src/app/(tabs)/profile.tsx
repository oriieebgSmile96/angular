import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GoldButton } from "@/components/ui/gold-button";
import { AVATAR } from "@/data/catalogue";
import { useCollection } from "@/features/collection/collection-store";
import { TranslationKey } from "@/i18n/en";
import { LANGUAGES, LANGUAGE_LABEL } from "@/i18n/language";
import { AppThemeValue, ThemePreference, useAppTheme, useThemedStyles } from "@/theme/app-theme";
import { fontsByLanguage } from "@/theme/theme";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

const MENU: readonly { icon: FeatherName; label: TranslationKey; detail?: TranslationKey }[] = [
	{ icon: "calendar", label: "profile.consultations", detail: "profile.consultationsDetail" },
	{ icon: "map-pin", label: "profile.addresses", detail: "profile.addressesDetail" },
	{ icon: "credit-card", label: "profile.payment", detail: "profile.paymentDetail" },
	{ icon: "bell", label: "profile.notifications", detail: "profile.notificationsDetail" },
	{ icon: "help-circle", label: "profile.support" },
];

const THEME_OPTIONS: readonly { value: ThemePreference; label: TranslationKey }[] = [
	{ value: "light", label: "profile.themeLight" },
	{ value: "dark", label: "profile.themeDark" },
	{ value: "system", label: "profile.themeSystem" },
];

export default function ProfileScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { saved } = useCollection();
	const {
		theme,
		type,
		isRtl,
		t,
		themeName,
		themePreference,
		setThemePreference,
		language,
		setLanguage,
	} = useAppTheme();
	const styles = useThemedStyles(createStyles);

	const resolved = t(themeName === "dark" ? "profile.themeDark" : "profile.themeLight");

	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.space[4] }]}
			showsVerticalScrollIndicator={false}>
			<View style={styles.header}>
				<Image source={AVATAR} style={styles.avatar} contentFit="cover" transition={200} />
				<View>
					<Text style={type.eyebrow}>{t("profile.memberSince")}</Text>
					<Text style={type.title}>{t("profile.name")}</Text>
					<Text style={type.caption}>{t("profile.savedCount", { count: saved.length })}</Text>
				</View>
			</View>

			<GoldButton label={t("common.bookConsultation")} onPress={() => router.push("/booking")} />

			<View style={styles.menu}>
				{MENU.map((item) => (
					<Pressable
						key={item.label}
						accessibilityRole="button"
						onPress={() => router.push("/booking")}
						style={styles.menuRow}>
						<Feather name={item.icon} size={20} color={theme.color.goldStrong} />
						<Text style={styles.menuLabel}>{t(item.label)}</Text>
						{item.detail ? <Text style={type.caption}>{t(item.detail)}</Text> : null}
						<Feather
							name={isRtl ? "chevron-left" : "chevron-right"}
							size={18}
							color={theme.color.textSecondary}
						/>
					</Pressable>
				))}
			</View>

			<View style={styles.preferences}>
				<Text style={styles.groupLabel}>{t("profile.preferences")}</Text>

				<View style={styles.preference}>
					<View style={styles.preferenceHeader}>
						<Feather name="sun" size={20} color={theme.color.goldStrong} />
						<Text style={styles.menuLabel}>{t("profile.appearance")}</Text>
						{themePreference === "system" ? (
							<Text style={type.caption}>
								{t("profile.themeSystemDetail", { theme: resolved })}
							</Text>
						) : null}
					</View>
					<Segmented
						label={t("profile.appearance")}
						value={themePreference}
						onChange={setThemePreference}
						options={THEME_OPTIONS.map((option) => ({
							value: option.value,
							label: t(option.label),
						}))}
					/>
				</View>

				<View style={styles.preference}>
					<View style={styles.preferenceHeader}>
						<Feather name="globe" size={20} color={theme.color.goldStrong} />
						<Text style={styles.menuLabel}>{t("profile.language")}</Text>
					</View>
					<Segmented
						label={t("profile.language")}
						value={language}
						onChange={setLanguage}
						options={LANGUAGES.map((code) => ({
							value: code,
							label: LANGUAGE_LABEL[code],
							// Each option is written in the script it offers, and React
							// Native resolves one face per `fontFamily` rather than walking
							// a stack, so the face has to come from the option's own
							// language instead of the active one.
							face: fontsByLanguage[code].bodyMedium,
						}))}
					/>
				</View>
			</View>
		</ScrollView>
	);
}

interface SegmentedOption<T extends string> {
	readonly value: T;
	readonly label: string;
	readonly face?: string;
}

/**
 * Three-way picker for a preference whose states are peers.
 *
 * A switch would do for language, but appearance has a third state — following
 * the system — that a switch cannot hold, so both preferences use the same
 * control rather than teaching a visitor two idioms on one screen.
 */
function Segmented<T extends string>({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: readonly SegmentedOption<T>[];
	value: T;
	onChange: (value: T) => void;
}) {
	const styles = useThemedStyles(createSegmentedStyles);

	return (
		<View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.group}>
			{options.map((option) => {
				const active = option.value === value;

				return (
					<Pressable
						key={option.value}
						accessibilityRole="radio"
						accessibilityLabel={option.label}
						accessibilityState={{ checked: active, selected: active }}
						onPress={() => onChange(option.value)}
						style={({ pressed }) => [
							styles.segment,
							active && styles.segmentActive,
							pressed && !active && styles.pressed,
						]}>
						<Text
							style={[
								styles.segmentLabel,
								active && styles.segmentLabelActive,
								option.face ? { fontFamily: option.face } : null,
							]}>
							{option.label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

const createSegmentedStyles = ({ theme, type, row }: AppThemeValue) =>
	StyleSheet.create({
		group: {
			flexDirection: row,
			gap: theme.space[1],
			padding: theme.space[1],
			borderRadius: theme.radius.control,
			backgroundColor: theme.color.surfaceMuted,
		},
		segment: {
			flex: 1,
			minHeight: 40,
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: theme.space[2],
			borderRadius: theme.radius.md,
		},
		segmentActive: {
			backgroundColor: theme.color.goldSoft,
		},
		pressed: {
			opacity: 0.7,
		},
		segmentLabel: {
			...type.control,
			textAlign: "center",
			color: theme.color.textSecondary,
		},
		segmentLabelActive: {
			color: theme.color.goldStrong,
		},
	});

const createStyles = ({ theme, type, row }: AppThemeValue) =>
	StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.color.background,
		},
		content: {
			gap: theme.space[6],
			paddingHorizontal: theme.space[5],
			paddingBottom: theme.space[9],
		},
		header: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[4],
		},
		avatar: {
			width: 72,
			height: 72,
			borderRadius: theme.radius.pill,
			backgroundColor: theme.color.surfaceMuted,
		},
		menu: {
			gap: theme.space[2],
		},
		menuRow: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[3],
			paddingVertical: theme.space[4],
			borderBottomWidth: 1,
			borderBottomColor: theme.color.border,
		},
		menuLabel: {
			...type.control,
			flex: 1,
		},
		preferences: {
			gap: theme.space[4],
		},
		groupLabel: {
			...type.caption,
			color: theme.color.goldStrong,
		},
		preference: {
			gap: theme.space[3],
		},
		preferenceHeader: {
			flexDirection: row,
			alignItems: "center",
			gap: theme.space[3],
		},
	});
