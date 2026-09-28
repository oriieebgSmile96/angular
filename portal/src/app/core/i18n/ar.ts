import { Dictionary } from "@bq/core/i18n/en";

/**
 * Arabic copy, in Modern Standard Arabic with Gulf contracting register.
 *
 * Typed as `Dictionary`, so this file cannot fall behind `en.ts`: adding a key
 * there breaks the build here until it is translated.
 */
export const ar: Dictionary = {
	"app.skipToContent": "تخطَّ إلى تفاصيل المشروع",
	"app.mainLabel": "لوحة المشروع",

	"header.clientPortal": "بوابة العملاء",
	"header.contractRef": "رقم العقد {ref}",
	"header.statsLabel": "حالة المشروع",
	"header.projectStage": "مرحلة المشروع",
	"header.timeline": "الجدول الزمني",
	"header.client": "العميل",

	"theme.toDark": "التبديل إلى المظهر الداكن",
	"theme.toLight": "التبديل إلى المظهر الفاتح",
	"language.switch": "Switch to English",

	"timeline.eyebrow": "تنفيذ المشروع",
	"timeline.heading": "الجدول الزمني للتنفيذ",
	"timeline.lede": "متابعة مباشرة لتقدّم جميع المراحل في {project}، {location}.",
	"timeline.status.completed": "مكتملة",
	"timeline.status.inProgress": "قيد التنفيذ",
	"timeline.status.upcoming": "قادمة",
	"timeline.completion": "نسبة الإنجاز",
	"timeline.estimated": "متوقع {date}",
	"timeline.progressLabel": "{stage} — أُنجز {percent}٪",

	"boards.eyebrow": "اعتماد الخامات",
	"boards.heading": "اعتماد عينات الألواح",
	"boards.lede": "راجع مواصفات كل لوح واعتمده رقمياً قبل بدء التوريد",
	"boards.approved": "معتمد",
	"boards.approvedOn": "اعتُمد - {date}",
	"boards.approve": "اعتماد الخامة",
	"boards.approveLabel": "اعتماد {name}",
	"boards.specsLabel": "المواصفات",
	"boards.approvedAnnouncement": "اعتُمد {name} بتاريخ {date}",

	"invoice.eyebrow": "الدفعات المرحلية",
	"invoice.heading": "فاتورة إنجاز المرحلة ٢",
	"invoice.lede": "بيان الفوترة {project}، {location}.",
	"invoice.number": "رقم الفاتورة",
	"invoice.issued": "تاريخ الإصدار: {date}",
	"invoice.due": "تاريخ الاستحقاق:",
	"invoice.total": "إجمالي الفاتورة",
	"invoice.awaitingPayment": "بانتظار السداد",
	"invoice.linesLabel": "بنود الفاتورة",
	"invoice.description": "البيان",
	"invoice.unit": "الكمية",
	"invoice.rate": "السعر (درهم)",
	"invoice.amount": "المبلغ",
	"invoice.subtotal": "المجموع الفرعي",
	"invoice.vat": "ضريبة القيمة المضافة ({rate}٪)",
	"invoice.schedule": "جدول الدفعات",
	"invoice.method": "طريقة السداد",
	"invoice.balanceDue": "المستحق حالياً",
	"invoice.instalment.paid": "مدفوعة",
	"invoice.instalment.due": "مستحقة الآن",
	"invoice.instalment.scheduled": "مجدولة",
	"invoice.bankTransfer": "تحويل بنكي",
	"invoice.company": "الشركة",
	"invoice.reference": "المرجع",
	"invoice.confirmPayment": "تأكيد إرسال الدفعة",
	"invoice.paymentConfirmed": "تم استلام تأكيد السداد",
	"invoice.downloadPdf": "تحميل الفاتورة PDF",

	"currency.aed": "{amount} درهم",
};
