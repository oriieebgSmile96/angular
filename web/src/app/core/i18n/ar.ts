import { Dictionary } from "@bq/core/i18n/en";

/**
 * Arabic copy, in Modern Standard Arabic with Gulf business register.
 *
 * Typed as `Dictionary`, so this file cannot fall behind `en.ts`: adding a key
 * there breaks the build here until it is translated.
 */
export const ar: Dictionary = {
	"a11y.skipToContent": "تخطَّ إلى المحتوى",
	"a11y.primaryNav": "التنقل الرئيسي",

	"header.home": "بريق العقيق — الرئيسية",
	"header.bookNow": "احجز الآن",
	"header.openMenu": "فتح القائمة",
	"header.closeMenu": "إغلاق القائمة",

	"language.switch": "التبديل إلى الإنجليزية",
	"language.current": "اللغة",

	"theme.toLight": "التبديل إلى المظهر الفاتح",
	"theme.toDark": "التبديل إلى المظهر الداكن",

	"hero.book": "احجز استشارة مميزة",
	"hero.viewPortfolio": "استعرض الأعمال",

	"portfolio.viewAll": "عرض جميع المشاريع",

	"materials.explore": "استكشف الخامات",

	"testimonials.choose": "اختر شهادة",
	"testimonials.from": "شهادة من {author}",

	"footer.quickLinks": "روابط سريعة",
	"footer.contact": "تواصل معنا",

	"booking.close": "إغلاق الحجز",
	"booking.step.details": "البيانات",
	"booking.step.verify": "التحقق",
	"booking.step.confirmed": "التأكيد",
	"booking.step.progress": "الخطوة {current} من {total}",

	"booking.details.eyebrow": "ابدأ رحلتك",
	"booking.details.title": "احجز استشارتك المميزة",
	"booking.details.lede":
		"أخبرنا عن مسكنك وكيف نصل إليك. سنرسل رمزاً لمرة واحدة لتأكيد رقمك قبل حجز موعد استشارتك.",
	"booking.details.format": "نوع الاستشارة",
	"booking.details.fullName": "الاسم الكامل",
	"booking.details.fullNamePlaceholder": "مثال: يونس الفارسي",
	"booking.details.email": "البريد الإلكتروني",
	"booking.details.emailPlaceholder": "123@gmail.com",
	"booking.details.mobile": "رقم الهاتف المتحرك",
	"booking.details.mobilePlaceholder": "+971 0 000 0000",
	"booking.details.mobileHint": "سنرسل رمزاً من ٦ أرقام على هذا الرقم لتأكيد الحجز",
	"booking.details.projectType": "نوع المشروع",
	"booking.details.preferredDate": "التاريخ المفضل",
	"booking.details.preferredDateHint": "من الأحد إلى الخميس",
	"booking.details.preferredTime": "الوقت المفضل",
	"booking.details.preferredTimePlaceholder": "اختر موعداً",
	"booking.details.consent":
		"أوافق على أن تتواصل معي بريق العقيق بشأن الاستشارة، وعلى استلام رمز التحقق عبر الرسائل القصيرة.",
	"booking.details.submit": "أرسل رمز التحقق",
	"booking.details.submitPending": "جارٍ إرسال الرمز…",

	"booking.verify.eyebrow": "التحقق",
	"booking.verify.title": "أكّد رقمك",
	"booking.verify.lede": "أدخل الرمز المكوّن من {length} أرقام المُرسل عبر رسالة قصيرة إلى",
	"booking.verify.editNumber": "تعديل الرقم",
	"booking.verify.codeLabel": "رمز التحقق",
	"booking.verify.expired": "انتهت صلاحية الرمز.",
	"booking.verify.countdown": "تنتهي صلاحية الرمز خلال {time}.",
	"booking.verify.missing": "لم يصلك الرمز؟",
	"booking.verify.resend": "إعادة الإرسال",
	"booking.verify.demo": "نسخة تجريبية — لا توجد بوابة رسائل متصلة. رمزك هو",
	"booking.verify.submit": "تحقّق وأكّد الحجز",
	"booking.verify.submitPending": "جارٍ التحقق…",
	"booking.verify.wrongNumber": "الرقم غير صحيح؟",
	"booking.verify.back": "العودة إلى بيانات الحجز",
	"booking.verify.invalidCode": "رمز التحقق غير صحيح أو منتهي الصلاحية.",

	"booking.confirmed.eyebrow": "تم تأكيد الحجز",
	"booking.confirmed.title": "تم حجز استشارتك",
	"booking.confirmed.lede":
		"أُرسل التأكيد إلى بريدك الإلكتروني ورقم هاتفك. سيتواصل معك فريقنا خلال ٢٤ ساعة لاستكمال التفاصيل.",
	"booking.confirmed.home": "العودة إلى الرئيسية",
	"booking.confirmed.details": "عرض التفاصيل",

	"booking.summary.eyebrow": "تفاصيل الاستشارة",
	"booking.summary.reference": "الرقم المرجعي",
	"booking.summary.type": "النوع",
	"booking.summary.when": "التاريخ والوقت",
	"booking.summary.name": "الاسم",
	"booking.summary.email": "البريد الإلكتروني",
	"booking.summary.mobile": "الهاتف",
	"booking.summary.project": "المشروع",
	"booking.summary.portfolio": "استعرض الأعمال",
	"booking.summary.calendar": "أضف إلى التقويم",
	"booking.summary.fallbackFormat": "استشارة",
	"booking.summary.fallbackProject": "مسكن",

	"field.optional": "اختياري",
	"field.required": "مطلوب",
	"field.charactersLeft": "بقي {count} حرفاً",
	"field.showPassword": "إظهار كلمة المرور",
	"field.hidePassword": "إخفاء كلمة المرور",

	"select.placeholder": "اختر من القائمة",
	"select.clear": "مسح الاختيار",
	"select.empty": "لا توجد خيارات",

	"datepicker.placeholder": "اختر تاريخاً",
	"datepicker.clear": "مسح التاريخ",
	"datepicker.open": "فتح التقويم",
	"datepicker.previousMonth": "الشهر السابق",
	"datepicker.nextMonth": "الشهر التالي",

	"dateRange.placeholder": "اختر نطاقاً زمنياً",
	"dateRange.clear": "مسح التواريخ",
	"dateRange.guide": "اختر تاريخ البداية ثم تاريخ النهاية.",

	"validation.required": "هذا الحقل مطلوب.",
	"validation.requiredTrue": "يرجى التأكيد للمتابعة.",
	"validation.email": "أدخل بريداً إلكترونياً صحيحاً.",
	"validation.minlength": "استخدم {requiredLength} حرفاً على الأقل.",
	"validation.maxlength": "لا تتجاوز {requiredLength} حرفاً.",
	"validation.min": "أدخل {min} أو أكثر.",
	"validation.max": "أدخل {max} أو أقل.",
	"validation.pattern": "التنسيق غير صحيح.",
	"validation.mobile": "أدخل رقم هاتف متحرك صالحاً.",
	"validation.dateMin": "اختر تاريخاً في {min} أو بعده.",
	"validation.dateMax": "اختر تاريخاً في {max} أو قبله.",
	"validation.fallback": "يرجى مراجعة هذا الحقل.",
};
