import { Localized } from "@bq/core/i18n/language.model";
import { NavLink, PortfolioProject, ProcessStep, Stat, Testimonial } from "@bq/core/models/content.model";

/**
 * Editorial content for the marketing site, transcribed from the Figma file
 * "Bareeq Al-Aeeq webpage" (SH3JCz4S0jjrSXPrOVEhec).
 *
 * Frontend-only: this is the shape a CMS would return, kept in one typed module
 * so that swapping in a content API means replacing this file, not the views.
 * Body copy is set as lorem ipsum in Figma; it is written out properly here so
 * the build is presentable, and every heading, label and figure is verbatim.
 *
 * Each editorial string carries both languages rather than a dictionary key, so
 * that changing a project name or a testimonial is one edit in one place. The
 * `t` pipe reads these exactly as it reads a key.
 */

export const ATELIER = {
	/** The house name is a mark, not a translation: it is transliterated, not rendered. */
	name: { en: "Bareeq Al-Aeeq", ar: "بريق العقيق" } satisfies Localized,
	legalName: {
		en: "Bariq Al Aqeeq Artistic Works",
		ar: "بريق العقيق للأعمال الفنية",
	} satisfies Localized,
	arabicName: "بريق العقيق للأعمال الفنية",
	tagline: {
		en: "Prestige Interior Atelier . Dubai",
		ar: "أتيليه التصميم الداخلي الفاخر . دبي",
	} satisfies Localized,
	summary: {
		en: "A specialized atelier crafting exceptional residences across Dubai and beyond. We transform spaces into unforgettable experiences.",
		ar: "أتيليه متخصص في تصميم المساكن الاستثنائية في دبي وخارجها. نحوّل المساحات إلى تجارب لا تُنسى.",
	} satisfies Localized,
	email: "email@outlook.com",
	phone: "+971 4 000 0000",
	location: { en: "Dubai, UAE", ar: "دبي، الإمارات العربية المتحدة" } satisfies Localized,
	instagram: { en: "Instagram", ar: "إنستغرام" } satisfies Localized,
	registration: {
		en: "Bariq Al Aqeeq Artistic Works, Dubai, UAE , TRN: 000 0000 0000 003",
		ar: "بريق العقيق للأعمال الفنية، دبي، الإمارات العربية المتحدة، الرقم الضريبي: 000 0000 0000 003",
	} satisfies Localized,
	portalNote: {
		en: "Confidential Client Portal 2026",
		ar: "بوابة العملاء السرية ٢٠٢٦",
	} satisfies Localized,
} as const;

export const HERO = {
	eyebrow: ATELIER.tagline,
	heading: {
		en: "Spaces that embody prestige",
		ar: "مساحات تجسّد الرفعة",
	} satisfies Localized,
	body: {
		en: "Interiors composed for families who expect the exceptional — considered in plan, uncompromising in material, and delivered by a single team from first sketch to handover.",
		ar: "تصاميم داخلية لعائلات لا ترضى إلا بالاستثنائي — مدروسة في المخطط، لا تساوم في الخامة، وينفّذها فريق واحد من أول رسم حتى التسليم.",
	} satisfies Localized,
	photo: {
		src: "img/hero.png",
		alt: {
			en: "Formal salon in warm stone and brass, lit at dusk",
			ar: "صالة رسمية بالحجر الدافئ والنحاس، مضاءة عند الغسق",
		} satisfies Localized,
	},
} as const;

export const CTA = {
	eyebrow: { en: "Begin your journey", ar: "ابدأ رحلتك" } satisfies Localized,
	heading: {
		en: "Your residence deserves the exceptional",
		ar: "مسكنك يستحق الاستثنائي",
	} satisfies Localized,
	body: {
		en: "Tell us how you live and we will show you what your home could become. Every consultation begins with a conversation, not a catalogue.",
		ar: "أخبرنا كيف تعيش، ونُريك ما يمكن أن يصير عليه بيتك. كل استشارة تبدأ بحوار، لا بكتالوج.",
	} satisfies Localized,
} as const;

export const NAV_LINKS: readonly NavLink[] = [
	{ label: { en: "Projects", ar: "المشاريع" }, fragment: "projects" },
	{ label: { en: "Services", ar: "الخدمات" }, fragment: "services" },
	{ label: { en: "Atelier", ar: "الأتيليه" }, fragment: "atelier" },
	{ label: { en: "Contact Us", ar: "تواصل معنا" }, fragment: "contact" },
];

export const STATS: readonly Stat[] = [
	{ value: "100+", label: { en: "Completed projects", ar: "مشروع مُنجز" } },
	{ value: "12", label: { en: "Years of mastery", ar: "عاماً من الإتقان" } },
	{ value: "100%", label: { en: "Client satisfaction", ar: "رضا العملاء" } },
	{ value: "6", label: { en: "Cities nationwide", ar: "مدن على مستوى الدولة" } },
];

export const PORTFOLIO_SECTION = {
	eyebrow: { en: "Selected work", ar: "أعمال مختارة" } satisfies Localized,
	heading: { en: "The exceptional portfolio", ar: "أعمالٌ استثنائية" } satisfies Localized,
} as const;

const EMIRATES_HILL: Localized = { en: "Emirates Hill", ar: "تلال الإمارات" };
const VILLA_AL_NOOR: Localized = { en: "Villa Al Noor", ar: "فيلا النور" };

export const PORTFOLIO: readonly PortfolioProject[] = [
	{
		id: "villa-al-noor-residence",
		title: VILLA_AL_NOOR,
		location: EMIRATES_HILL,
		tag: { en: "Full residence", ar: "مسكن متكامل" },
		tile: "wide",
		photo: {
			src: "img/portfolio-villa-al-noor.png",
			alt: { en: "Villa Al Noor formal salon", ar: "الصالة الرسمية في فيلا النور" },
		},
	},
	{
		id: "villa-dining",
		title: { en: "Villa Dining", ar: "فيلا الطعام" },
		location: EMIRATES_HILL,
		tag: { en: "Dining area", ar: "منطقة الطعام" },
		tile: "tall",
		photo: {
			src: "img/portfolio-villa-dining.png",
			alt: {
				en: "Sculpted dining room with fluted joinery",
				ar: "غرفة طعام منحوتة بنجارة مضلّعة",
			},
		},
	},
	{
		id: "villa-al-noor-living",
		title: VILLA_AL_NOOR,
		location: EMIRATES_HILL,
		tag: { en: "Living room", ar: "غرفة المعيشة" },
		tile: "small",
		photo: {
			src: "img/portfolio-living-room.png",
			alt: {
				en: "Living room layered in stone and bronze",
				ar: "غرفة معيشة متدرّجة بالحجر والبرونز",
			},
		},
	},
	{
		id: "villa-al-noor-bedroom",
		title: VILLA_AL_NOOR,
		location: EMIRATES_HILL,
		tag: { en: "Master bedroom", ar: "غرفة النوم الرئيسية" },
		tile: "small",
		photo: {
			src: "img/portfolio-master-bedroom.png",
			alt: {
				en: "Master bedroom in smoked oak and silk",
				ar: "غرفة نوم رئيسية بخشب البلوط المدخّن والحرير",
			},
		},
	},
	{
		id: "villa-al-noor-media",
		title: VILLA_AL_NOOR,
		location: EMIRATES_HILL,
		tag: { en: "Media room", ar: "غرفة الوسائط" },
		tile: "small",
		photo: {
			src: "img/portfolio-media-room.png",
			alt: {
				en: "Media room with upholstered walls",
				ar: "غرفة وسائط بجدران منجّدة",
			},
		},
	},
];

export const PROCESS_SECTION = {
	eyebrow: { en: "Our process", ar: "منهجنا" } satisfies Localized,
	heading: {
		en: "Seamless. Exceptional. Transparent.",
		ar: "سلاسة. تميّز. شفافية.",
	} satisfies Localized,
} as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
	{ icon: "consultation", title: { en: "Consultation", ar: "الاستشارة" } },
	{ icon: "concept", title: { en: "Concept Design", ar: "التصميم المبدئي" } },
	{ icon: "dealing", title: { en: "Dealing", ar: "الاتفاق" } },
	{ icon: "execution", title: { en: "Execution", ar: "التنفيذ" } },
	{ icon: "handover", title: { en: "Handover", ar: "التسليم" } },
];

export const MATERIALS = {
	eyebrow: { en: "Materials & craft", ar: "الخامات والحِرفة" } satisfies Localized,
	heading: {
		en: "Materials that tell timeless stories",
		ar: "خاماتٌ تروي حكاياتٍ لا يطويها الزمن",
	} satisfies Localized,
	body: {
		en: "We buy stone by the block, timber by the log and metal by the sheet, so that every surface in a residence reads as one continuous thought rather than a set of finishes.",
		ar: "نشتري الحجر بالكتلة، والخشب بالجذع، والمعدن باللوح، ليقرأ كل سطح في المسكن كفكرة واحدة متصلة لا كمجموعة تشطيبات.",
	} satisfies Localized,
	photo: {
		src: "img/materials.png",
		alt: {
			en: "Curved timber panelling beside a stone staircase",
			ar: "ألواح خشبية منحنية بجوار درج حجري",
		} satisfies Localized,
	},
	highlights: [
		{ en: "Calacatta & Statuario Marble", ar: "رخام الكالاكاتا والستاتواريو" },
		{ en: "Hand-forged Bronze Fixtures", ar: "تجهيزات برونزية مطروقة يدوياً" },
		{ en: "Burr Walnut & Smoked Oak", ar: "جوز البُر والبلوط المدخّن" },
		{ en: "Silk-weave & Velvet Textiles", ar: "أقمشة الحرير والمخمل" },
	] satisfies readonly Localized[],
} as const;

export const TESTIMONIAL_SECTION = {
	heading: { en: "What people say about us", ar: "ماذا يقولون عنا" } satisfies Localized,
} as const;

export const TESTIMONIALS: readonly Testimonial[] = [
	{
		quote: {
			en: "They understood the brief before we could articulate it. Every room resolves into a single, quiet idea, and eighteen months on it still feels newly finished. The detailing is what separates them — joinery shadow gaps, the weight of a handle, the way light lands at dusk. Nothing was left to chance.",
			ar: "فهموا المطلوب قبل أن نُحسن التعبير عنه. كل غرفة تنتهي إلى فكرة واحدة هادئة، وبعد ثمانية عشر شهراً ما زالت تبدو حديثة التسليم. التفاصيل هي ما يميّزهم — فجوات الظل في النجارة، ووزن المقبض، وكيف يسقط الضوء عند الغسق. لم يُترك شيء للصدفة.",
		},
		author: { en: "Mr Fareed", ar: "السيد فريد" },
		role: { en: "Villa Al Noor Owner", ar: "مالك فيلا النور" },
	},
	{
		quote: {
			en: "A single team carried us from first sketch to handover. No hand-offs, no surprises, and a programme that finished ahead of schedule — in a category where that simply does not happen.",
			ar: "فريق واحد رافقنا من أول رسم حتى التسليم. بلا تنقّل بين جهات، وبلا مفاجآت، وببرنامج زمني انتهى قبل موعده — في مجال لا يحدث فيه ذلك عادة.",
		},
		author: { en: "Mrs Latifa", ar: "السيدة لطيفة" },
		role: { en: "Villa Dining Owner", ar: "مالكة فيلا الطعام" },
	},
];

export const FOOTER_LINKS = {
	quickLinks: [
		{ label: { en: "Projects", ar: "المشاريع" }, fragment: "projects" },
		{ label: { en: "Services", ar: "الخدمات" }, fragment: "services" },
		{ label: { en: "Atelier", ar: "الأتيليه" }, fragment: "atelier" },
		{ label: { en: "Press", ar: "الصحافة" }, fragment: "contact" },
	] satisfies readonly NavLink[],
} as const;
