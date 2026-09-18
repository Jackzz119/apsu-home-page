import { z } from 'zod';

/** Nonempty display copy; parsing preserves the original wording and whitespace. */
const Text = z.string().min(1);

/** A local exported image; dimensions reserve layout space before loading. */
export const ImageAsset = z.strictObject({
    /** Local asset path under public/images; remote design preview URLs are not delivery assets. */
    src: z.string().regex(/^\/images\/(?!.*(?:\.\.|\/\/))[A-Za-z0-9/_-]+\.(?:avif|webp|png|jpe?g|svg)$/),
    /** Accessible description supplied by content; empty for a decorative image. */
    alt: z.string(),
    /** Intrinsic image width in pixels. */
    width: z.number().int().positive(),
    /** Intrinsic image height in pixels. */
    height: z.number().int().positive()
});
export type ImageAsset = z.infer<typeof ImageAsset>;

/** Recurring USD price from the product cards, represented in integer cents. */
export const Price = z.strictObject({
    /** Nonnegative integer amount in cents, so $20 is 2000. */
    amount: z.number().int().nonnegative(),
    /** ISO currency used by the source design. */
    currency: z.literal('USD'),
    /** Billing interval for the displayed plan. */
    interval: z.literal('month'),
    /** Price qualifier from the design, such as From; empty when absent. */
    prefix: z.string()
});
export type Price = z.infer<typeof Price>;

/** Registered homepage destinations, including the nested weight-loss plans. */
export const Anchor = z.enum(['top', 'weight-loss', 'weight-loss-plans', 'birth-control', 'sleep', 'faq']);
export type Anchor = z.infer<typeof Anchor>;

/** Shared content identity for navigation and call-to-action items. */
const actionFields = {
    /** Stable backend ID; clients must not generate it during rendering. */
    id: z.string(),
    /** Visible action label from the design or an approved correction. */
    label: Text
};

/** A real destination or an approved visual demo; never infer a fake href. */
export const Action = z.discriminatedUnion('kind', [
    z.strictObject({
        ...actionFields,
        /** Indicates navigation to a registered section of this page. */
        kind: z.literal('anchor'),
        /** Destination ID without the leading hash. */
        target: Anchor
    }),
    z.strictObject({
        ...actionFields,
        /** Indicates an actual destination supplied by the content owner. */
        kind: z.literal('external'),
        /** Absolute HTTP(S) URL; script and data URLs are rejected. */
        href: z.url({ protocol: /^https?$/ })
    }),
    z.strictObject({
        ...actionFields,
        /** Marks a visual demonstration with no navigation, network request or business effect. */
        kind: z.literal('demo')
    })
]);
export type Action = z.infer<typeof Action>;

/** Ordered heading fragments preserve the source design's highlighted words. */
export const TextRun = z.strictObject({
    /** Semantic emphasis; presentation tokens stay in the component layer. */
    kind: z.enum(['plain', 'accent']),
    /** Exact fragment text, including spaces between adjacent fragments. */
    text: Text
});
export type TextRun = z.infer<typeof TextRun>;

/** Shared section heading with explicit source copy for the two design boards. */
export const Heading = z.strictObject({
    /** Small section label; null when the source has no eyebrow. */
    eyebrow: Text.nullable(),
    /** Ordered title fragments, rendered at the section's semantic heading level. */
    title: z.array(TextRun).min(1),
    /** Introductory paragraphs visible in the desktop design. */
    desktopBody: z.array(Text),
    /** Introductory paragraphs visible in the mobile design; empty when omitted there. */
    mobileBody: z.array(Text)
});
export type Heading = z.infer<typeof Heading>;

/** A short benefit or trust statement; the component supplies decorative icons. */
export const FeatureItem = z.strictObject({
    /** Stable backend ID, also used to associate a decorative icon. */
    id: z.string(),
    /** Visible statement from the source design. */
    text: Text
});
export type FeatureItem = z.infer<typeof FeatureItem>;

/** Header content shared by desktop navigation and the mobile menu. */
export const Header = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Brand asset with its accessible name. */
    logo: ImageAsset,
    /** Product and contact navigation in source order. */
    navigation: z.array(Action).min(1),
    /** Primary and secondary calls to action. */
    actions: z.array(Action).min(1),
    /** Accessible label for the mobile menu trigger. */
    openMenuLabel: Text,
    /** Accessible label for the menu close button. */
    closeMenuLabel: Text,
    /** Accessible name for the navigation landmark and modal menu. */
    navigationLabel: Text
});
export type Header = z.infer<typeof Header>;

/** A displayed language chip; highlighting does not imply an active locale selector. */
export const Language = z.strictObject({
    /** Stable backend ID for the language entry. */
    id: z.string(),
    /** Native-language label shown in the marquee. */
    label: Text,
    /** Text direction for this label, independent of the surrounding row. */
    direction: z.enum(['ltr', 'rtl', 'auto']),
    /** Whether the source gives this chip the highlighted visual treatment. */
    highlighted: z.boolean()
});
export type Language = z.infer<typeof Language>;

/** Hero copy and the unique language entries for each marquee row. */
export const Hero = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Main page heading and introduction. */
    heading: Heading,
    /** Short shipping, physician, and language statements above the heading. */
    benefits: z.array(FeatureItem).min(1),
    /** Primary consultation call to action. */
    action: Action,
    /** Unique source entries per row; animation duplicates belong in rendering only. */
    languageRows: z.array(z.array(Language).min(1)).length(2)
});
export type Hero = z.infer<typeof Hero>;

/** A product-category entry card linking to its corresponding page section. */
export const ServiceCard = z.strictObject({
    /** Stable backend ID for this card. */
    id: z.string(),
    /** Product category determines the semantic theme, not arbitrary CSS classes. */
    kind: z.enum(['weight-loss', 'birth-control', 'sleep']),
    /** Uppercase category label from the source. */
    label: Text,
    /** Product summary text. */
    title: Text,
    /** Product illustration; final exports are supplied during asset implementation. */
    image: ImageAsset,
    /** See-plans action for this category. */
    action: Action
});
export type ServiceCard = z.infer<typeof ServiceCard>;

/** Product entry cards in their source ordering. */
export const ServiceCards = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Category cards; rendering chooses columns or stacking. */
    items: z.array(ServiceCard).min(1)
});
export type ServiceCards = z.infer<typeof ServiceCards>;

/** Unique statements in the repeating trust strip. */
export const TrustMarquee = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Statements without animation-generated duplicates. */
    items: z.array(FeatureItem).min(1)
});
export type TrustMarquee = z.infer<typeof TrustMarquee>;

/** One of the physician and AI roles illustrated in How it works. */
export const CareRole = z.strictObject({
    /** Stable backend ID for this role. */
    id: z.string(),
    /** Identifies the role without coupling the API to a card's position. */
    kind: z.enum(['physician', 'assistant']),
    /** Displayed step marker, preserving the source's leading zero. */
    step: Text,
    /** Role heading. */
    title: Text,
    /** Explanation of the role's responsibilities. */
    description: Text,
    /** Responsibility statements shown below the introduction. */
    responsibilities: z.array(FeatureItem).min(1)
});
export type CareRole = z.infer<typeof CareRole>;

/** Explanation of the distinct physician and AI responsibilities. */
export const HowItWorks = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Section title and introduction. */
    heading: Heading,
    /** Role cards in source order. */
    roles: z.array(CareRole).min(1),
    /** Closing statement assigning medical decisions to physicians. */
    note: Text
});
export type HowItWorks = z.infer<typeof HowItWorks>;

/** A named weight-loss plan and its structured recurring price. */
export const Plan = z.strictObject({
    /** Stable backend ID for this plan. */
    id: z.string(),
    /** Product name as supplied by the source. */
    name: Text,
    /** Verified product image; null when the source has no correctly labelled asset. */
    image: ImageAsset.nullable(),
    /** Recurring price in integer cents. */
    price: Price,
    /** Plan-specific call to action. */
    action: Action
});
export type Plan = z.infer<typeof Plan>;

/** Weight-loss introduction and plan cards, including the off-board mobile content. */
export const WeightLoss = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Product introduction heading. */
    heading: Heading,
    /** Main lifestyle or product illustration. */
    image: ImageAsset,
    /** Treatment and delivery benefits. */
    benefits: z.array(FeatureItem).min(1),
    /** Link from the introduction to the plan cards. */
    action: Action,
    /** Available plans in display order. */
    plans: z.array(Plan).min(1)
});
export type WeightLoss = z.infer<typeof WeightLoss>;

/** Shared unit labels supplied by the source calculator. */
const unitFields = {
    /** Visible measurement-system selector label. */
    label: Text,
    /** Primary height suffix: ft or cm. */
    heightUnit: Text,
    /** Weight suffix: lbs or kg. */
    weightUnit: Text
};

/** Measurement variants require inches only for imperial input. */
export const BmiUnits = z.discriminatedUnion('kind', [
    z.strictObject({
        ...unitFields,
        /** Identifies the feet-and-inches height inputs. */
        kind: z.literal('imperial'),
        /** Secondary height suffix for inches. */
        secondaryHeightUnit: Text
    }),
    z.strictObject({
        ...unitFields,
        /** Identifies the single centimeters height input. */
        kind: z.literal('metric')
    })
]);
export type BmiUnits = z.infer<typeof BmiUnits>;

/** BMI presentation copy, excluding live measurements and calculated results. */
export const BmiCalculator = z.strictObject({
    /** Decorative source photograph behind the desktop form. */
    background: ImageAsset,
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Heading and instructions for the form. */
    heading: Heading,
    /** Short calculator title shown above unit selection. */
    title: Text,
    /** Unit-selector options from the design. */
    units: z.array(BmiUnits).min(1),
    /** Height input group label. */
    heightLabel: Text,
    /** Weight input label. */
    weightLabel: Text,
    /** Sex selector legend; sex does not change the BMI formula. */
    sexLabel: Text,
    /** Sex options as displayed in the source form. */
    sexOptions: z
        .array(
            z.strictObject({
                /** Stable backend ID for this option. */
                id: z.string(),
                /** Visible option label. */
                label: Text
            })
        )
        .min(1),
    /** Submit button label for the local calculation. */
    submitLabel: Text,
    /** Result heading fragments; the score itself is computed on the client. */
    resultTitle: z.array(TextRun).min(1),
    /** Source artwork only; never treat this inconsistent example as a calculated result. */
    sourcePreview: z.strictObject({
        /** Initial measurement-system appearance in the source artwork. */
        unit: z.enum(['imperial', 'metric']),
        /** Initial selected sex option's stable backend ID. */
        sexOptionId: z.string(),
        /** Displayed input text in the artwork, not validated patient measurements. */
        inputText: Text,
        /** Displayed example score, independent of input and calculation state. */
        scoreText: Text
    }),
    /** Ordered range labels; no medical eligibility decision is encoded here. */
    ranges: z
        .array(
            z.strictObject({
                /** Stable backend ID for this displayed range. */
                id: z.string(),
                /** Visible category name. */
                label: Text,
                /** Display range copied from the source or an approved correction. */
                description: Text
            })
        )
        .min(1),
    /** Product-options call to action beneath the result. */
    action: Action
});
export type BmiCalculator = z.infer<typeof BmiCalculator>;

/** Shared content for the birth-control and sleep product sections. */
const treatmentFields = {
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Product title and board-specific introductory copy. */
    heading: Heading,
    /** Main section illustration. */
    image: ImageAsset,
    /** Product benefit statements in source order. */
    benefits: z.array(FeatureItem).min(1),
    /** Displayed recurring price. */
    price: Price,
    /** Consultation call to action. */
    action: Action
};

/** Birth-control section, without an unrelated profile illustration. */
export const BirthControl = z.strictObject(treatmentFields);
export type BirthControl = z.infer<typeof BirthControl>;

/** Static health-profile illustration; these values never come from the BMI form. */
export const ProfileIllustration = z.strictObject({
    /** Title of the illustrated profile panel. */
    title: Text,
    /** Fictional display name already present in the design. */
    name: Text,
    /** Illustrated profile completion percentage. */
    completion: z.number().min(0).max(100),
    /** Illustrated score, not a real patient measurement. */
    score: z.number().min(0),
    /** Source label describing the illustrated score. */
    scoreLabel: Text,
    /** Illustrated progress percentage. */
    progress: z.number().min(0).max(100),
    /** Visible progress label. */
    progressLabel: Text
});
export type ProfileIllustration = z.infer<typeof ProfileIllustration>;

/** Sleep section with its static profile decoration. */
export const Sleep = z.strictObject({
    ...treatmentFields,
    /** Profile illustration shown with the product image. */
    profile: ProfileIllustration
});
export type Sleep = z.infer<typeof Sleep>;

/** A static chat message in the online-care illustration. */
export const ChatMessage = z.strictObject({
    /** Stable backend ID for this illustration message. */
    id: z.string(),
    /** Speaker role controls the static message alignment. */
    speaker: z.enum(['provider', 'patient']),
    /** Displayed message body; this is not a live conversation. */
    text: Text,
    /** Displayed time text from the source illustration. */
    time: Text
});
export type ChatMessage = z.infer<typeof ChatMessage>;

/** Common identity and title for online-care carousel cards. */
const onlineCareFields = {
    /** Stable backend ID for this card. */
    id: z.string(),
    /** Service benefit heading. */
    title: Text
};

/** Online-care cards contain either a static chat or a single illustration. */
export const OnlineCareCard = z.discriminatedUnion('kind', [
    z.strictObject({
        ...onlineCareFields,
        /** Identifies the static provider-support chat. */
        kind: z.literal('chat'),
        /** Source phone-call artwork behind the static chat overlay. */
        illustration: ImageAsset,
        /** Provider display name from the source illustration. */
        providerName: Text,
        /** Decorative provider avatar. */
        avatar: ImageAsset,
        /** Illustrated availability label. */
        statusLabel: Text,
        /** Illustrated day separator. */
        dayLabel: Text,
        /** Ordered static messages, with no send controls or live state. */
        messages: z.array(ChatMessage).min(1)
    }),
    z.strictObject({
        ...onlineCareFields,
        /** Identifies an image-led service card. */
        kind: z.literal('image'),
        /** Service illustration and its dimensions. */
        image: ImageAsset
    })
]);
export type OnlineCareCard = z.infer<typeof OnlineCareCard>;

/** Content and control names for the manually operated online-care carousel. */
export const OnlineCare = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Section heading. */
    heading: Heading,
    /** Ordered service cards. */
    cards: z.array(OnlineCareCard).min(1),
    /** Accessible label for backward navigation. */
    previousLabel: Text,
    /** Accessible label for forward navigation. */
    nextLabel: Text
});
export type OnlineCare = z.infer<typeof OnlineCare>;

/** Common author details shared by the two source testimonial formats. */
const storyFields = {
    /** Stable backend ID for this story. */
    id: z.string(),
    /** Author display name from the design. */
    name: Text,
    /** Author city and state from the design. */
    location: Text
};

/** Text testimonials and photo stories have distinct, required content. */
export const SuccessStory = z.discriminatedUnion('kind', [
    z.strictObject({
        ...storyFields,
        /** Identifies a quotation-based testimonial. */
        kind: z.literal('quote'),
        /** Treatment category displayed on the card. */
        category: Text,
        /** Exact customer quotation from the design. */
        quote: Text,
        /** Star rating on the source's five-star scale. */
        rating: z.number().min(0).max(5)
    }),
    z.strictObject({
        ...storyFields,
        /** Identifies a photo-led story with no invented quotation. */
        kind: z.literal('photo'),
        /** Customer photo and its accessible description. */
        image: ImageAsset
    })
]);
export type SuccessStory = z.infer<typeof SuccessStory>;

/** Success-story grid; mobile stacking is a layout concern, not another dataset. */
export const SuccessStories = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Section title and supporting copy. */
    heading: Heading,
    /** Quote and photo cards in source order. */
    stories: z.array(SuccessStory).min(1)
});
export type SuccessStories = z.infer<typeof SuccessStories>;

/** One FAQ entry; source-copy corrections are tracked separately from the schema. */
export const FaqItem = z.strictObject({
    /** Stable backend ID for this question. */
    id: z.string(),
    /** Visible question. */
    question: Text,
    /** Answer paragraphs, including those hidden in the default screenshot. */
    answer: z.array(Text).min(1)
});
export type FaqItem = z.infer<typeof FaqItem>;

/** FAQ content; the component controls expansion without mutating these entries. */
export const Faq = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Section introduction and contact prompt. */
    heading: Heading,
    /** Ordered questions and answers. */
    items: z.array(FaqItem).min(1)
});
export type Faq = z.infer<typeof Faq>;

/** Final consultation prompt above the footer. */
export const FinalCta = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Closing heading. */
    heading: Heading,
    /** Short appointment and insurance statements. */
    benefits: z.array(FeatureItem).min(1),
    /** Final consultation action. */
    action: Action
});
export type FinalCta = z.infer<typeof FinalCta>;

/** One titled group of footer navigation items. */
export const FooterColumn = z.strictObject({
    /** Stable backend ID for this column. */
    id: z.string(),
    /** Visible column heading. */
    title: Text,
    /** Ordered footer actions, with visual demonstrations explicitly represented. */
    links: z.array(Action).min(1)
});
export type FooterColumn = z.infer<typeof FooterColumn>;

/** Footer brand, navigation, legal copy, and destination-bearing social items. */
export const Footer = z.strictObject({
    /** Stable backend ID for this content block. */
    id: z.string(),
    /** Footer brand asset. */
    logo: ImageAsset,
    /** Short brand statement beneath the logo. */
    tagline: Text,
    /** Product, company, and legal navigation groups. */
    columns: z.array(FooterColumn).min(1),
    /** Social destinations; unlike testimonial decorations, these require resolution. */
    socialLinks: z.array(Action),
    /** Source legal disclaimer paragraphs, preserved as content. */
    disclaimers: z.array(Text).min(1),
    /** Terms acknowledgment sentence from the source. */
    termsNotice: Text,
    /** Copyright line from the source. */
    copyright: Text
});
export type Footer = z.infer<typeof Footer>;

/**
 * Validates the homepage response in its fourteen-section reading order.
 * This schema is the shared contract for mocks, the route handler, and getHomePage.
 * It contains presentation content only; interaction state and BMI calculations stay in components.
 */
export const HomePage = z.strictObject({
    /** Desktop navigation and mobile menu content. */
    header: Header,
    /** Primary page message and language rows. */
    hero: Hero,
    /** Three product-category entry cards. */
    serviceCards: ServiceCards,
    /** Repeating trust statements. */
    trustMarquee: TrustMarquee,
    /** Physician and AI responsibility explanation. */
    howItWorks: HowItWorks,
    /** Weight-loss introduction and recurring plans. */
    weightLoss: WeightLoss,
    /** Calculator copy, excluding user input and computed results. */
    bmiCalculator: BmiCalculator,
    /** Birth-control product content. */
    birthControl: BirthControl,
    /** Sleep product content and static profile illustration. */
    sleep: Sleep,
    /** Manually browsed online-care cards. */
    onlineCare: OnlineCare,
    /** Text and photo testimonials. */
    successStories: SuccessStories,
    /** Frequently asked questions and answers. */
    faq: Faq,
    /** Closing consultation prompt. */
    finalCta: FinalCta,
    /** Brand, navigation, and legal footer. */
    footer: Footer
});
export type HomePage = z.infer<typeof HomePage>;
