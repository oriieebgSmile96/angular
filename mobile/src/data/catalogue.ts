import { ImageSourcePropType } from "react-native";

import { Localized } from "@/i18n/language";
import { tokens } from "@/theme/tokens";

/**
 * Frontend-only catalogue, transcribed from the Figma file "Mobile App"
 * (LRnhV7IkWsPDDus59nDP6P). Imagery is exported from the same file.
 *
 * Shapes mirror what a commerce API would return so screens can be pointed at a
 * real endpoint by replacing this module. Editorial strings carry both languages
 * rather than a dictionary key, so renaming a piece is one edit in one place.
 */

export interface Category {
	readonly id: string;
	readonly label: Localized;
}

export interface Collection {
	readonly id: string;
	readonly title: Localized;
	readonly badge: Localized;
	readonly pieces: number;
	readonly image: ImageSourcePropType;
}

export interface Finish {
	readonly id: string;
	readonly label: Localized;
	readonly color: string;
}

export interface Spec {
	readonly label: Localized;
	readonly value: Localized;
}

export interface Product {
	readonly id: string;
	readonly name: Localized;
	/** Short kicker on the card, e.g. "LIGHTING". */
	readonly category: Localized;
	/** Full breadcrumb on the detail screen, e.g. "LIVING ROOMS - SEATING". */
	readonly categoryPath: Localized;
	readonly price: number;
	readonly currency: Localized;
	readonly rating: number;
	readonly reviews: string;
	readonly description: Localized;
	readonly image: ImageSourcePropType;
	readonly collection: Localized;
	readonly finishType: Localized;
	readonly reference: string;
	/** Matched against the category filter chips, which are language-independent. */
	readonly categoryId: string;
	readonly finishes: readonly Finish[];
	readonly specs: readonly Spec[];
}

export const AVATAR = require("../../assets/img/avatar.png") as ImageSourcePropType;

export const CATEGORIES: readonly Category[] = [
	{ id: "all", label: { en: "All", ar: "الكل" } },
	{ id: "living", label: { en: "Living", ar: "المعيشة" } },
	{ id: "bedroom", label: { en: "Bedroom", ar: "النوم" } },
	{ id: "dining", label: { en: "Dining", ar: "الطعام" } },
	{ id: "lighting", label: { en: "Lighting", ar: "الإضاءة" } },
];

export const FEATURED = {
	season: { en: "Summer – Autumn 2026", ar: "صيف – خريف ٢٠٢٦" } satisfies Localized,
	title: { en: "The New Collection", ar: "المجموعة الجديدة" } satisfies Localized,
	badge: { en: "Featured", ar: "مميزة" } satisfies Localized,
	image: require("../../assets/img/featured.png") as ImageSourcePropType,
} as const;

export const COLLECTIONS: readonly Collection[] = [
	{
		id: "living-rooms",
		title: { en: "Living Rooms", ar: "غرف المعيشة" },
		badge: { en: "New season", ar: "موسم جديد" },
		pieces: 100,
		image: require("../../assets/img/collection-living.png") as ImageSourcePropType,
	},
	{
		id: "master-bedrooms",
		title: { en: "Master bedrooms", ar: "غرف النوم الرئيسية" },
		badge: { en: "Curated", ar: "مختارة" },
		pieces: 64,
		image: require("../../assets/img/collection-bedroom.png") as ImageSourcePropType,
	},
	{
		id: "crafts-materials",
		title: { en: "Crafts & Materials", ar: "الحِرف والخامات" },
		badge: { en: "Curated", ar: "مختارة" },
		pieces: 64,
		image: require("../../assets/img/piece-lighting-1.png") as ImageSourcePropType,
	},
];

const AED: Localized = { en: "AED", ar: "درهم" };

const FINISHES: readonly Finish[] = [
	{
		id: "satin-grey",
		label: { en: "Satin Grey", ar: "رمادي ساتان" },
		color: tokens.color.swatch["satin-grey"],
	},
	{
		id: "champagne",
		label: { en: "Champagne", ar: "شامبانيا" },
		color: tokens.color.swatch.champagne,
	},
	{ id: "greige", label: { en: "Greige", ar: "بيج رمادي" }, color: tokens.color.swatch.greige },
	{ id: "sand", label: { en: "Sand", ar: "رملي" }, color: tokens.color.swatch.sand },
	{ id: "emerald", label: { en: "Emerald", ar: "زمردي" }, color: tokens.color.swatch.emerald },
	{ id: "espresso", label: { en: "Espresso", ar: "بني داكن" }, color: tokens.color.swatch.espresso },
	{ id: "rosewood", label: { en: "Rosewood", ar: "خشب الورد" }, color: tokens.color.swatch.rosewood },
];

const BAREEQ: Localized = { en: "Bareeq", ar: "بريق" };

export const PRODUCTS: readonly Product[] = [
	{
		id: "lustre-venitien",
		name: { en: "Lustre Venitien", ar: "لوستر فينيسيان" },
		category: { en: "Living room", ar: "غرفة المعيشة" },
		categoryPath: { en: "Living rooms - Seating", ar: "غرف المعيشة - الجلوس" },
		categoryId: "living",
		price: 1345,
		currency: AED,
		rating: 4.9,
		reviews: "2.7k",
		description: {
			en: "A low, generous seat in full-grain leather over a solid Australian hardwood frame. Built to order in our Dubai workshop and finished by hand, so no two frames carry quite the same grain.",
			ar: "مقعد منخفض وفسيح من الجلد الطبيعي الكامل على هيكل من الخشب الأسترالي الصلب. يُصنع حسب الطلب في ورشتنا بدبي ويُنهى يدوياً، فلا يتطابق هيكلان في تعريق الخشب.",
		},
		image: require("../../assets/img/product-hero.png") as ImageSourcePropType,
		collection: BAREEQ,
		finishType: { en: "Matte", ar: "مطفي" },
		reference: "BAQ0126",
		finishes: FINISHES,
		specs: [
			{
				label: { en: "Frame", ar: "الهيكل" },
				value: { en: "Solid Australian Wood", ar: "خشب أسترالي صلب" },
			},
			{
				label: { en: "Material", ar: "الخامة" },
				value: { en: "Full-Grain Leather", ar: "جلد طبيعي كامل" },
			},
			{
				label: { en: "Dimensions", ar: "الأبعاد" },
				value: { en: "W 75 x D 82 x H 50cm", ar: "عرض ٧٥ × عمق ٨٢ × ارتفاع ٥٠ سم" },
			},
			{
				label: { en: "Lead time", ar: "مدة التنفيذ" },
				value: { en: "4 to 6 weeks, made to order", ar: "٤ إلى ٦ أسابيع، حسب الطلب" },
			},
		],
	},
	{
		id: "miroir-oval",
		name: { en: "Miroir Oval", ar: "مرآة أوفال" },
		category: { en: "Lighting", ar: "الإضاءة" },
		categoryPath: { en: "Living rooms - Mirrors", ar: "غرف المعيشة - المرايا" },
		categoryId: "lighting",
		price: 890,
		currency: AED,
		rating: 4.8,
		reviews: "1.2k",
		description: {
			en: "An oval mirror framed in unlacquered bronze that patinas with the room. Backlit at 2700K for a soft, unbroken halo against the wall.",
			ar: "مرآة بيضاوية بإطار من البرونز غير المطلي يكتسب باتينا مع الزمن. مضاءة من الخلف بدرجة ٢٧٠٠ كلفن لهالة ناعمة متصلة على الجدار.",
		},
		image: require("../../assets/img/piece-lighting-1.png") as ImageSourcePropType,
		collection: BAREEQ,
		finishType: { en: "Brushed", ar: "مصقول" },
		reference: "BAQ0214",
		finishes: FINISHES.slice(0, 5),
		specs: [
			{
				label: { en: "Frame", ar: "الإطار" },
				value: { en: "Hand-forged Bronze", ar: "برونز مطروق يدوياً" },
			},
			{
				label: { en: "Material", ar: "الخامة" },
				value: { en: "Mirrored Glass", ar: "زجاج معكوس" },
			},
			{
				label: { en: "Dimensions", ar: "الأبعاد" },
				value: { en: "W 70 x H 110 x D 6cm", ar: "عرض ٧٠ × ارتفاع ١١٠ × عمق ٦ سم" },
			},
			{
				label: { en: "Lead time", ar: "مدة التنفيذ" },
				value: { en: "5 to 6 weeks, made to order", ar: "٥ إلى ٦ أسابيع، حسب الطلب" },
			},
		],
	},
	{
		id: "table-marsa",
		name: { en: "Table Marsa", ar: "طاولة مرسى" },
		category: { en: "Lighting", ar: "الإضاءة" },
		categoryPath: { en: "Dining - Tables", ar: "الطعام - الطاولات" },
		categoryId: "dining",
		price: 4200,
		currency: AED,
		rating: 5,
		reviews: "640",
		description: {
			en: "A book-matched Calacatta top on a sculpted oak plinth, cut from a single block so the veining runs uninterrupted across the full length of the surface.",
			ar: "سطح من رخام الكالاكاتا بتعريق متقابل على قاعدة بلوط منحوتة، مقطوع من كتلة واحدة ليمتد العرق دون انقطاع على طول السطح.",
		},
		image: require("../../assets/img/piece-lighting-2.png") as ImageSourcePropType,
		collection: BAREEQ,
		finishType: { en: "Honed", ar: "مصنفر" },
		reference: "BAQ0331",
		finishes: FINISHES.slice(2),
		specs: [
			{
				label: { en: "Frame", ar: "القاعدة" },
				value: { en: "Solid Smoked Oak", ar: "بلوط مدخّن صلب" },
			},
			{
				label: { en: "Material", ar: "الخامة" },
				value: { en: "Calacatta Marble", ar: "رخام كالاكاتا" },
			},
			{
				label: { en: "Dimensions", ar: "الأبعاد" },
				value: { en: "W 260 x D 110 x H 75cm", ar: "عرض ٢٦٠ × عمق ١١٠ × ارتفاع ٧٥ سم" },
			},
			{
				label: { en: "Lead time", ar: "مدة التنفيذ" },
				value: { en: "10 to 12 weeks, made to order", ar: "١٠ إلى ١٢ أسبوعاً، حسب الطلب" },
			},
		],
	},
];

export function findProduct(id: string): Product | undefined {
	return PRODUCTS.find((product) => product.id === id);
}
