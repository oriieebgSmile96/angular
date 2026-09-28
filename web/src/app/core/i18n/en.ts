/**
 * English copy for everything that is chrome rather than content.
 *
 * Editorial content (project names, testimonials, material notes) is not here:
 * it lives in `atelier.data.ts` as `Localized` values so a copy change stays in
 * one file. `{name}` placeholders are filled by `TranslationService.translate`.
 *
 * This object defines the key set. `ar.ts` is typed against it, so a missing or
 * misspelled Arabic key is a compile error rather than a blank string on screen.
 */
export const en = {
	"a11y.skipToContent": "Skip to content",
	"a11y.primaryNav": "Primary",

	"header.home": "Bareeq Al-Aeeq — home",
	"header.bookNow": "Book now",
	"header.openMenu": "Open menu",
	"header.closeMenu": "Close menu",

	"language.switch": "Switch to Arabic",
	"language.current": "Language",

	"theme.toLight": "Switch to light theme",
	"theme.toDark": "Switch to dark theme",

	"hero.book": "Book a prestige consultation",
	"hero.viewPortfolio": "View portfolio",

	"portfolio.viewAll": "View all projects",

	"materials.explore": "Explore materials",

	"testimonials.choose": "Choose a testimonial",
	"testimonials.from": "Testimonial from {author}",

	"footer.quickLinks": "Quick links",
	"footer.contact": "Contact",

	"booking.close": "Close booking",
	"booking.step.details": "Details",
	"booking.step.verify": "Verify",
	"booking.step.confirmed": "Confirmed",
	"booking.step.progress": "Step {current} of {total}",

	"booking.details.eyebrow": "Begin your journey",
	"booking.details.title": "Book your prestige consultation",
	"booking.details.lede":
		"Tell us about your residence and how to reach you. We'll send a one-time code to confirm your number before your consultation is reserved.",
	"booking.details.format": "Consultation type",
	"booking.details.fullName": "Full Name",
	"booking.details.fullNamePlaceholder": "e.g Younis Al Farsi",
	"booking.details.email": "Email",
	"booking.details.emailPlaceholder": "123@gmail.com",
	"booking.details.mobile": "Mobile Number",
	"booking.details.mobilePlaceholder": "+971 0 000 0000",
	"booking.details.mobileHint": "We'll send a 6-digit code on this number to verify booking",
	"booking.details.projectType": "Project Type",
	"booking.details.preferredDate": "Preferred Date",
	"booking.details.preferredDateHint": "Sunday to Thursday",
	"booking.details.preferredTime": "Preferred Time",
	"booking.details.preferredTimePlaceholder": "Choose a time slot",
	"booking.details.consent":
		"I agree to be contacted by Bareeq Al-Aeeq regarding consultation, and to receive SMS verification code.",
	"booking.details.submit": "Send verification code",
	"booking.details.submitPending": "Sending code…",

	"booking.verify.eyebrow": "Verification",
	"booking.verify.title": "Verify your number",
	"booking.verify.lede": "Enter the {length}-digit code sent via SMS to",
	"booking.verify.editNumber": "Edit Number",
	"booking.verify.codeLabel": "Verification code",
	"booking.verify.expired": "Your code has expired.",
	"booking.verify.countdown": "Code expires in {time}.",
	"booking.verify.missing": "Didn't get it?",
	"booking.verify.resend": "Resend Code",
	"booking.verify.demo": "Demo build — no SMS gateway is connected. Your code is",
	"booking.verify.submit": "Verify & confirm booking",
	"booking.verify.submitPending": "Verifying…",
	"booking.verify.wrongNumber": "Wrong Number?",
	"booking.verify.back": "Go back to booking details",
	"booking.verify.invalidCode": "The verification code is incorrect or has expired.",

	"booking.confirmed.eyebrow": "Booking confirmed",
	"booking.confirmed.title": "Your consultation is reserved",
	"booking.confirmed.lede":
		"A confirmation has been sent to your email and mobile number. Our team will reach out within 24 hours to finalise the details.",
	"booking.confirmed.home": "Return to homepage",
	"booking.confirmed.details": "View details",

	"booking.summary.eyebrow": "Consultation details",
	"booking.summary.reference": "Reference",
	"booking.summary.type": "Type",
	"booking.summary.when": "Date and time",
	"booking.summary.name": "Name",
	"booking.summary.email": "Email",
	"booking.summary.mobile": "Mobile",
	"booking.summary.project": "Project",
	"booking.summary.portfolio": "View portfolio",
	"booking.summary.calendar": "Add to calendar",
	"booking.summary.fallbackFormat": "Consultation",
	"booking.summary.fallbackProject": "Residence",

	"field.optional": "Optional",
	"field.required": "Required",
	"field.charactersLeft": "{count} characters left",
	"field.showPassword": "Show password",
	"field.hidePassword": "Hide password",

	"select.placeholder": "Select an option",
	"select.clear": "Clear selection",
	"select.empty": "Nothing to choose from",

	"datepicker.placeholder": "Select a date",
	"datepicker.clear": "Clear date",
	"datepicker.open": "Open calendar",
	"datepicker.previousMonth": "Previous month",
	"datepicker.nextMonth": "Next month",

	"dateRange.placeholder": "Select a date range",
	"dateRange.clear": "Clear dates",
	"dateRange.guide": "Choose a start date, then an end date.",

	"validation.required": "This field is required.",
	"validation.requiredTrue": "Please confirm to continue.",
	"validation.email": "Enter a valid email address.",
	"validation.minlength": "Use at least {requiredLength} characters.",
	"validation.maxlength": "Use no more than {requiredLength} characters.",
	"validation.min": "Enter {min} or more.",
	"validation.max": "Enter {max} or less.",
	"validation.pattern": "That format is not quite right.",
	"validation.mobile": "Enter a reachable mobile number.",
	"validation.dateMin": "Choose a date on or after {min}.",
	"validation.dateMax": "Choose a date on or before {max}.",
	"validation.fallback": "Please check this field.",
} as const;

export type TranslationKey = keyof typeof en;
export type Dictionary = Readonly<Record<TranslationKey, string>>;
