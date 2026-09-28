import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Field } from "@/components/ui/field";
import { GoldButton } from "@/components/ui/gold-button";
import { IconButton } from "@/components/ui/icon-button";
import {
	CODE_LENGTH,
	ConsultationBooking,
	ConsultationDraft,
	ValidationErrors,
	confirmBooking,
	issueCode,
	validateDraft,
} from "@/features/booking/consultation";
import { goBackOrHome } from "@/lib/navigation";
import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

const EMPTY_DRAFT: ConsultationDraft = { fullName: "", mobile: "", email: "", projectSite: "" };

export default function BookingScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { theme, type, isRtl, row, t } = useAppTheme();
	const styles = useThemedStyles(createStyles);

	const [draft, setDraft] = useState<ConsultationDraft>(EMPTY_DRAFT);
	const [code, setCode] = useState("");
	const [expectedCode, setExpectedCode] = useState<string | null>(null);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [sending, setSending] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [booking, setBooking] = useState<ConsultationBooking | null>(null);

	const update = (field: keyof ConsultationDraft) => (value: string) =>
		setDraft((current) => ({ ...current, [field]: value }));

	const sendCode = async () => {
		setSending(true);
		const issued = await issueCode();
		setExpectedCode(issued);
		setErrors((current) => ({ ...current, code: undefined }));
		setSending(false);
	};

	const confirm = async () => {
		const found = validateDraft(draft, code, expectedCode);
		setErrors(found);
		if (Object.values(found).some(Boolean)) return;

		setConfirming(true);
		setBooking(await confirmBooking(draft));
		setConfirming(false);
	};

	if (booking) {
		return (
			<View
				style={[styles.screen, styles.confirmation, { paddingTop: insets.top + theme.space[9] }]}>
				<View style={styles.seal}>
					<Feather name="check" size={28} color={theme.color.textOnGold} />
				</View>
				<Text style={type.eyebrow}>{t("booking.confirmedEyebrow")}</Text>
				<Text style={styles.confirmationTitle}>{t("booking.confirmedTitle")}</Text>
				<Text style={[type.bodyMuted, styles.centered]}>
					{t("booking.confirmedBody", { reference: booking.reference, email: booking.email })}
				</Text>
				<GoldButton
					label={t("common.backToCollections")}
					onPress={() => router.replace("/")}
					style={styles.wide}
				/>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={styles.screen}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={insets.top}>
			<ScrollView
				contentContainerStyle={[
					styles.content,
					{
						paddingTop: insets.top + theme.space[3],
						paddingBottom: insets.bottom + theme.space[9],
					},
				]}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}>
				<IconButton
					icon={isRtl ? "arrow-right" : "arrow-left"}
					label={t("common.goBack")}
					tone="outline"
					onPress={() => goBackOrHome(router)}
				/>

				<View style={styles.intro}>
					<Text style={type.eyebrow}>{t("booking.eyebrow")}</Text>
					<Text style={type.title}>{t("booking.title")}</Text>
					<Text style={styles.subtitle}>{t("booking.subtitle")}</Text>
				</View>

				<View style={styles.form}>
					<Field
						label={t("booking.fullName")}
						placeholder={t("booking.fullNamePlaceholder")}
						autoComplete="name"
						value={draft.fullName}
						onChangeText={update("fullName")}
						error={errors.fullName && t(errors.fullName)}
					/>
					<Field
						label={t("booking.contactNumber")}
						placeholder={t("booking.contactNumberPlaceholder")}
						keyboardType="phone-pad"
						autoComplete="tel"
						value={draft.mobile}
						onChangeText={update("mobile")}
						error={errors.mobile && t(errors.mobile)}
					/>
					<Field
						label={t("booking.email")}
						placeholder={t("booking.emailPlaceholder")}
						keyboardType="email-address"
						autoCapitalize="none"
						autoComplete="email"
						value={draft.email}
						onChangeText={update("email")}
						error={errors.email && t(errors.email)}
					/>
					<Field
						label={t("booking.projectSite")}
						placeholder={t("booking.projectSitePlaceholder")}
						value={draft.projectSite}
						onChangeText={update("projectSite")}
						error={errors.projectSite && t(errors.projectSite)}
					/>

					<View style={[styles.codeRow, { flexDirection: row }]}>
						<View style={styles.codeField}>
							<Field
								label={t("booking.code")}
								placeholder={t("booking.codePlaceholder")}
								keyboardType="number-pad"
								maxLength={CODE_LENGTH}
								value={code}
								onChangeText={setCode}
								error={errors.code && t(errors.code, { length: CODE_LENGTH })}
							/>
						</View>
						<GoldButton
							label={t(expectedCode ? "booking.resendCode" : "booking.sendCode")}
							variant="outline"
							loading={sending}
							onPress={() => void sendCode()}
							style={styles.codeButton}
						/>
					</View>

					{expectedCode ? (
						<Pressable accessibilityRole="button" onPress={() => setCode(expectedCode)}>
							<Text style={styles.demoHint}>
								{t("booking.demoHint", { code: expectedCode })}
							</Text>
						</Pressable>
					) : null}
				</View>

				<GoldButton
					label={t("booking.confirm")}
					loading={confirming}
					onPress={() => void confirm()}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const createStyles = ({ theme, type, fonts, isRtl }: AppThemeValue) =>
	StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.color.background,
		},
		content: {
			gap: theme.space[6],
			paddingHorizontal: theme.space[5],
		},
		intro: {
			gap: theme.space[1],
		},
		subtitle: {
			fontFamily: fonts.bodyRegular,
			fontSize: 14,
			lineHeight: 28,
			letterSpacing: isRtl ? 0 : 1.12,
			textAlign: isRtl ? "right" : "left",
			writingDirection: isRtl ? "rtl" : "ltr",
			color: theme.color.goldStrong,
		},
		form: {
			gap: theme.space[4],
		},
		codeRow: {
			alignItems: "flex-end",
			gap: theme.space[3],
		},
		codeField: {
			flex: 1,
		},
		codeButton: {
			minWidth: 132,
		},
		demoHint: {
			...type.caption,
			letterSpacing: 0,
		},
		confirmation: {
			alignItems: "center",
			gap: theme.space[3],
			paddingHorizontal: theme.space[6],
		},
		seal: {
			width: 64,
			height: 64,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: theme.radius.pill,
			backgroundColor: theme.color.gold,
		},
		confirmationTitle: {
			...type.title,
			textAlign: "center",
		},
		centered: {
			textAlign: "center",
		},
		wide: {
			alignSelf: "stretch",
			marginTop: theme.space[4],
		},
	});
