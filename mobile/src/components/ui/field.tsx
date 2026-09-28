import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { AppThemeValue, useAppTheme, useThemedStyles } from "@/theme/app-theme";

interface FieldProps extends TextInputProps {
	label: string;
	/**
	 * Error copy that has already been resolved, not a dictionary key.
	 *
	 * Validation reports `TranslationKey`s and the screen calls `t()` on them,
	 * because some carry parameters the field knows nothing about —
	 * `validation.codeLength` needs the expected length.
	 */
	error?: string | null;
	hint?: string;
}

export function Field({ label, error, hint, style, ...inputProps }: FieldProps) {
	const { theme } = useAppTheme();
	const styles = useThemedStyles(createStyles);

	return (
		<View style={styles.wrapper}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				accessibilityLabel={label}
				placeholderTextColor={theme.color.textSecondary}
				style={[styles.input, !!error && styles.inputError, style]}
				{...inputProps}
			/>
			{error ? (
				<Text style={styles.error}>{error}</Text>
			) : hint ? (
				<Text style={styles.hint}>{hint}</Text>
			) : null}
		</View>
	);
}

const createStyles = ({ theme, type, fonts, isRtl }: AppThemeValue) =>
	StyleSheet.create({
		wrapper: {
			gap: theme.space[2],
		},
		label: type.label,
		input: {
			minHeight: 50,
			paddingHorizontal: theme.space[4],
			borderRadius: theme.radius.control,
			backgroundColor: theme.color.surfaceMuted,
			fontFamily: fonts.bodyRegular,
			fontSize: 14,
			color: theme.color.textPrimary,
			/** The ramp cannot supply this: a `TextInput` needs its own caret and placeholder flow. */
			textAlign: isRtl ? "right" : "left",
			writingDirection: isRtl ? "rtl" : "ltr",
		},
		inputError: {
			borderWidth: 1,
			borderColor: theme.color.danger,
		},
		hint: type.caption,
		error: {
			...type.caption,
			color: theme.color.danger,
		},
	});
