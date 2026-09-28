/**
 * English copy for the app's chrome.
 *
 * Catalogue content (piece names, finishes, descriptions) is not here: it lives
 * in `src/data/catalogue.ts` as `Localized` values, next to the imagery it
 * belongs to. Both are read through the same `t()`.
 *
 * This object defines the key set; `ar.ts` is typed against it, so a missing
 * Arabic key is a compile error rather than a blank line on screen.
 */
export const en = {
	"tab.home": "Home",
	"tab.search": "Search",
	"tab.saved": "Saved",
	"tab.profile": "Profile",

	"common.goBack": "Go back",
	"common.seeAll": "See all",
	"common.backToCollections": "Back to collections",
	"common.bookConsultation": "Book a consultation",
	"common.pieces": "{count} pieces",

	"home.welcome": "WELCOME BACK!",
	"home.title": "Discover Collections",
	"home.searchLabel": "Search pieces and materials",
	"home.searchPlaceholder": "Search pieces, materials...",
	"home.saveFeatured": "Save featured collection",
	"home.featuredLabel": "{title}, featured collection",
	"home.collections": "Collections",
	"home.forYou": "For You",
	"home.collectionLabel": "{title}, {count} pieces",
	"home.pieceLabel": "{name}, {price} {currency}",

	"product.missing": "This piece is no longer available.",
	"product.save": "Save to collection",
	"product.unsave": "Remove from collection",
	"product.incVat": "inc. VAT",
	"product.paintFinish": "PAINT FINISH",
	"product.collection": "Collection",
	"product.finish": "Finish",
	"product.reference": "Ref.",
	"product.details": "DETAILS",
	"product.addToCollection": "Add to collection",
	"product.reviews": "{count} reviews",

	"saved.title": "Saved",
	"saved.eyebrow": "YOUR COLLECTION",
	"saved.empty": "Nothing saved yet",
	"saved.emptyHint": "Tap the heart on a piece to keep it here.",
	"saved.browse": "Browse collections",
	"saved.remove": "Remove {name}",

	"search.title": "Search",
	"search.eyebrow": "THE FULL CATALOGUE",
	"search.placeholder": "Search pieces, materials...",
	"search.empty": "No pieces match that search",
	"search.emptyHint": "Try a different material or room.",
	"search.results": "{count} results",
	"search.label": "Search the catalogue",

	"profile.memberSince": "MEMBER SINCE 2024",
	"profile.name": "Younis Al Farsi",
	"profile.savedCount": "{count} saved pieces",
	"profile.consultations": "My consultations",
	"profile.consultationsDetail": "1 upcoming",
	"profile.addresses": "Delivery addresses",
	"profile.addressesDetail": "Emirates Hills",
	"profile.payment": "Payment methods",
	"profile.paymentDetail": "Visa ·· 4402",
	"profile.notifications": "Notifications",
	"profile.notificationsDetail": "On",
	"profile.support": "Help & support",
	"profile.preferences": "PREFERENCES",
	"profile.appearance": "Appearance",
	"profile.language": "Language",
	"profile.themeLight": "Light",
	"profile.themeDark": "Dark",
	"profile.themeSystem": "System",
	"profile.themeSystemDetail": "Currently {theme}",

	"booking.eyebrow": "GET IN TOUCH!",
	"booking.title": "Book a Consultation",
	"booking.subtitle": "Please share your details here and we will get back to you soon!",
	"booking.fullName": "Full Name",
	"booking.fullNamePlaceholder": "Younis AlFarsi",
	"booking.contactNumber": "Contact Number",
	"booking.contactNumberPlaceholder": "+97 000 0000 000",
	"booking.email": "Email",
	"booking.emailPlaceholder": "YounisalFarsi@outlook.com",
	"booking.projectSite": "Project Site",
	"booking.projectSitePlaceholder": "Enter your villa site or address",
	"booking.code": "Verification Code",
	"booking.codePlaceholder": "Enter your 6-digit code",
	"booking.sendCode": "Send code",
	"booking.resendCode": "Resend",
	"booking.demoHint": "Demo build — no SMS gateway is connected. Tap to fill code {code}",
	"booking.confirm": "Confirm booking",
	"booking.confirmedEyebrow": "BOOKING CONFIRMED",
	"booking.confirmedTitle": "Your consultation is reserved",
	"booking.confirmedBody":
		"Reference {reference}. A confirmation has been sent to {email} and our team will call you within 24 hours.",

	"validation.fullName": "Please tell us your full name.",
	"validation.mobile": "Enter a reachable contact number.",
	"validation.email": "Enter a valid email address.",
	"validation.projectSite": "Where is the project located?",
	"validation.codeMissing": "Request a code before confirming.",
	"validation.codeLength": "Enter the {length}-digit code.",
	"validation.codeMismatch": "That code doesn't match. Try again.",

	"rating.summary": "{value} · {count} reviews",
	"rating.label": "Rated {value} out of 5 from {count} reviews",
} as const;

export type TranslationKey = keyof typeof en;
export type Dictionary = Readonly<Record<TranslationKey, string>>;
