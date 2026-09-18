import type { HomePage, ImageAsset } from '@/content/schema';

/** A transparent local fixture; P5 replaces it with the source exports and intrinsic sizes. */
const placeholder = { src: '/images/placeholder.svg', alt: '', width: 1, height: 1 } satisfies ImageAsset;

/**
 * Source baseline: saved Figma contexts 2002:3099, 3307, 3439, 3667 and 3679.
 * Approved corrections and retained source decisions are recorded in docs/deviations.md.
 * IDs are authored constants. Menu/carousel accessible names are implementation copy.
 */
export const homeMock = {
    header: {
        id: 'header',
        logo: { ...placeholder, alt: 'Apsu' },
        navigation: [
            { id: 'nav-weight-loss', kind: 'anchor', label: 'Weight Loss', target: 'weight-loss' },
            { id: 'nav-birth-control', kind: 'anchor', label: 'Birth Control', target: 'birth-control' },
            { id: 'nav-sleep', kind: 'anchor', label: 'Sleep', target: 'sleep' },
            { id: 'nav-contact', kind: 'unresolved', label: 'Contact Us' }
        ],
        actions: [
            { id: 'header-start', kind: 'unresolved', label: 'Get started' },
            { id: 'header-login', kind: 'unresolved', label: 'Login' }
        ],
        openMenuLabel: 'Open menu',
        closeMenuLabel: 'Close menu',
        navigationLabel: 'Main navigation'
    },
    hero: {
        id: 'hero',
        heading: {
            eyebrow: null,
            title: [
                { kind: 'plain', text: 'Healthcare that ' },
                { kind: 'accent', text: 'speaks your language.' }
            ],
            desktopBody: [
                'Care in the language you think in.',
                'US-licensed physicians, AI translates your consultation.'
            ],
            mobileBody: [
                'Care in the language you think in.',
                'US-licensed physicians, AI translates your consultation.'
            ]
        },
        benefits: [
            { id: 'hero-shipping', text: 'Free expedited shipping' },
            { id: 'hero-physicians', text: 'US-licensed physicians' },
            { id: 'hero-languages', text: '40+ Languages' }
        ],
        action: { id: 'hero-consult', kind: 'unresolved', label: 'Start a free consultation' },
        languageRows: [
            [
                { id: 'language-en', label: 'English', direction: 'ltr', highlighted: false },
                { id: 'language-zh', label: '中文', direction: 'ltr', highlighted: true },
                { id: 'language-es', label: 'Español', direction: 'ltr', highlighted: false },
                { id: 'language-vi', label: 'Tiếng Việt', direction: 'ltr', highlighted: false },
                { id: 'language-ko', label: '한국어', direction: 'ltr', highlighted: false },
                { id: 'language-tl', label: 'Tagalog', direction: 'ltr', highlighted: false }
            ],
            [
                { id: 'language-ru', label: 'Русский', direction: 'ltr', highlighted: false },
                { id: 'language-ar', label: 'العربية', direction: 'rtl', highlighted: false },
                { id: 'language-fr', label: 'Français', direction: 'ltr', highlighted: false },
                { id: 'language-pt', label: 'Português', direction: 'ltr', highlighted: true },
                { id: 'language-hi', label: 'हिन्दी', direction: 'ltr', highlighted: false }
            ]
        ]
    },
    serviceCards: {
        id: 'service-cards',
        items: [
            {
                id: 'service-weight-loss',
                kind: 'weight-loss',
                label: 'WEIGHT MANAGEMENT',
                title: 'Compounded GLP-1 Semaglutide & Tirzepatide',
                image: placeholder,
                action: { id: 'service-weight-loss-plans', kind: 'anchor', label: 'See plans', target: 'weight-loss' }
            },
            {
                id: 'service-birth-control',
                kind: 'birth-control',
                label: 'BIRTH CONTROL',
                title: 'Prescription birth control, delivered discreetly',
                image: placeholder,
                action: {
                    id: 'service-birth-control-plans',
                    kind: 'anchor',
                    label: 'See plans',
                    target: 'birth-control'
                }
            },
            {
                id: 'service-sleep',
                kind: 'sleep',
                label: 'SLEEP',
                title: 'Non-habit-forming formulations for sensitive sleepers',
                image: placeholder,
                action: { id: 'service-sleep-plans', kind: 'anchor', label: 'See plans', target: 'sleep' }
            }
        ]
    },
    trustMarquee: {
        id: 'trust-marquee',
        items: [
            { id: 'trust-states', text: '50 States' },
            { id: 'trust-shipping', text: 'Discreet Shipping' },
            { id: 'trust-payment', text: 'Cash-pay, No Insurance Needed' },
            { id: 'trust-assistant', text: '24/7 AI Care Assistant' },
            { id: 'trust-physicians', text: 'US Board Certified MDs' }
        ]
    },
    howItWorks: {
        id: 'how-it-works',
        heading: {
            eyebrow: 'HOW IT WORKS',
            title: [
                { kind: 'plain', text: 'Real physicians, ' },
                { kind: 'accent', text: 'AI-amplified.' }
            ],
            desktopBody: ['Two layers working together — each doing what they do best.'],
            mobileBody: ['Two layers working together — each doing what they do best.']
        },
        roles: [
            {
                id: 'role-physician',
                kind: 'physician',
                step: '01',
                title: 'Human physicians',
                description: 'They handle diagnosis, prescriptions, and every moment that calls for clinical judgment.',
                responsibilities: [
                    { id: 'physician-diagnosis', text: 'Diagnosis and treatment decisions.' },
                    { id: 'physician-prescriptions', text: 'Prescriptions.' },
                    { id: 'physician-evaluation', text: 'Complex symptom evaluation.' }
                ]
            },
            {
                id: 'role-assistant',
                kind: 'assistant',
                step: '02',
                title: 'AI care assistant',
                description: 'It handles language and instant response — so nothing is lost in communication.',
                responsibilities: [
                    { id: 'assistant-translation', text: 'Real-time translation in every message.' },
                    { id: 'assistant-availability', text: 'Answers around the clock.' }
                ]
            }
        ],
        note: 'The AI handles the language. Your physician makes the medical decisions.'
    },
    weightLoss: {
        id: 'weight-loss',
        heading: {
            eyebrow: 'WEIGHT LOSS',
            title: [{ kind: 'plain', text: 'Loss Weight In Your Way.' }],
            desktopBody: [],
            mobileBody: []
        },
        image: placeholder,
        benefits: [
            { id: 'weight-loss-same-day', text: 'Same-day doctor visits and prescriptions' },
            { id: 'weight-loss-dosage', text: 'Dosage personalized' },
            { id: 'weight-loss-pharmacies', text: 'Shipped from licensed USA pharmacies' }
        ],
        action: { id: 'weight-loss-see-plans', kind: 'anchor', label: 'See plans', target: 'weight-loss-plans' },
        plans: [
            {
                id: 'plan-semaglutide',
                name: 'Compounded Semaglutide',
                image: placeholder,
                price: { amount: 20000, currency: 'USD', interval: 'month', prefix: 'From' },
                action: { id: 'plan-semaglutide-start', kind: 'unresolved', label: 'Get started' }
            },
            {
                id: 'plan-tirzepatide',
                name: 'Compounded Tirzepatide',
                image: placeholder,
                price: { amount: 20000, currency: 'USD', interval: 'month', prefix: 'From' },
                action: { id: 'plan-tirzepatide-start', kind: 'unresolved', label: 'Get started' }
            }
        ]
    },
    bmiCalculator: {
        id: 'bmi-calculator',
        heading: {
            eyebrow: 'CHECK YOUR ELIGIBILITY',
            title: [{ kind: 'plain', text: 'Could a GLP-1 program be right for you?' }],
            desktopBody: ['Enter your height and weight below'],
            mobileBody: []
        },
        title: 'BMI',
        units: [
            { kind: 'imperial', label: 'ft / lbs', heightUnit: 'ft', secondaryHeightUnit: 'in', weightUnit: 'lbs' },
            { kind: 'metric', label: 'cm/kgs', heightUnit: 'cm', weightUnit: 'kg' }
        ],
        heightLabel: 'Height',
        weightLabel: 'Weight',
        sexLabel: 'Sex',
        sexOptions: [
            { id: 'sex-male', label: 'Male' },
            { id: 'sex-female', label: 'Female' }
        ],
        submitLabel: 'Calculate BMI',
        resultTitle: [
            { kind: 'plain', text: 'Your ' },
            { kind: 'accent', text: 'BMI Score' }
        ],
        sourcePreview: { unit: 'imperial', sexOptionId: 'sex-female', inputText: '0', scoreText: '56' },
        ranges: [
            { id: 'bmi-underweight', label: 'Underweight', description: '<18.5' },
            { id: 'bmi-healthy', label: 'Healthy Weight', description: '18.5–<25' },
            { id: 'bmi-overweight', label: 'Overweight', description: '25–<30' },
            { id: 'bmi-obese', label: 'Obese', description: '≥ 30' }
        ],
        action: { id: 'bmi-options', kind: 'anchor', label: 'See your GLP-1 Options', target: 'weight-loss-plans' }
    },
    birthControl: {
        id: 'birth-control',
        heading: {
            eyebrow: null,
            title: [{ kind: 'plain', text: 'Birth control, without the waiting room.' }],
            desktopBody: [
                'Choose the method that fits your life. A US-licensed physician prescribes online, and your refills arrive automatically.'
            ],
            mobileBody: []
        },
        image: placeholder,
        benefits: [
            { id: 'birth-control-delivery', text: 'Prescribed online, delivered to your door' },
            { id: 'birth-control-refills', text: 'Automatic refills, delivered' },
            { id: 'birth-control-packaging', text: 'Plain, discreet packaging' }
        ],
        price: { amount: 2000, currency: 'USD', interval: 'month', prefix: 'From' },
        action: { id: 'birth-control-consult', kind: 'unresolved', label: 'Start your birth control consult' }
    },
    sleep: {
        id: 'sleep',
        heading: {
            eyebrow: null,
            title: [{ kind: 'plain', text: 'Sleep' }],
            desktopBody: [
                'Real rest without the dependency.',
                'Non-habit-forming Physician-prescribed For\nsensitive sleepers'
            ],
            mobileBody: [
                'Real rest without the dependency.',
                'Non-habit-forming Physician-prescribed For sensitive sleepers.'
            ]
        },
        image: placeholder,
        benefits: [
            { id: 'sleep-options', text: 'Non-controlled, non-habit-forming options' },
            { id: 'sleep-pattern', text: 'Matched to your sleep pattern by a physician' },
            { id: 'sleep-sedatives', text: 'No controlled sedatives' },
            { id: 'sleep-payment', text: 'Cash-pay, no insurance needed' }
        ],
        price: { amount: 2000, currency: 'USD', interval: 'month', prefix: 'From' },
        action: { id: 'sleep-consult', kind: 'unresolved', label: 'Start your sleep consult' },
        profile: {
            title: 'Your profile',
            name: 'Olivia Gomes',
            avatar: placeholder,
            completion: 82,
            score: 78,
            scoreLabel: 'Normal',
            progress: 89.5,
            progressLabel: 'Progress'
        }
    },
    onlineCare: {
        id: 'online-care',
        heading: {
            eyebrow: null,
            title: [{ kind: 'plain', text: 'Completely online on your schedule' }],
            desktopBody: [],
            mobileBody: []
        },
        cards: [
            {
                id: 'online-care-support',
                kind: 'chat',
                title: '24/7 Provider Support',
                providerName: 'Dr. Helena Fox',
                avatar: placeholder,
                statusLabel: 'Online',
                dayLabel: 'Today',
                messages: [
                    {
                        id: 'chat-provider',
                        speaker: 'provider',
                        text: 'Hello! How are you feeling today?',
                        time: '10:00 AM'
                    },
                    {
                        id: 'chat-patient',
                        speaker: 'patient',
                        text: 'I’m feeling fine, thank you! Just want to follow up on my recent tests.',
                        time: '10:00 AM'
                    }
                ]
            },
            { id: 'online-care-treatment', kind: 'image', title: 'Easy Manager Treatment', image: placeholder },
            {
                id: 'online-care-medication',
                kind: 'image',
                title: 'Access to FDA-approved Medication Options',
                image: placeholder
            },
            { id: 'online-care-shipping', kind: 'image', title: 'Free Expedited Shipping', image: placeholder }
        ],
        previousLabel: 'Previous care benefit',
        nextLabel: 'Next care benefit'
    },
    successStories: {
        id: 'success-stories',
        heading: {
            eyebrow: null,
            title: [
                { kind: 'plain', text: 'Our ' },
                { kind: 'accent', text: 'Success Stories' }
            ],
            desktopBody: ['Care that finally made sense.'],
            mobileBody: ['Care that finally made sense.']
        },
        stories: [
            {
                id: 'story-maria',
                kind: 'quote',
                name: 'Maria R.',
                location: 'Houston, TX',
                category: 'Weight Loss',
                quote: 'I described my symptoms in my own language and actually felt understood, no translating in my head.',
                rating: 5
            },
            { id: 'story-david', kind: 'photo', name: 'David L', location: 'Queens, NY', image: placeholder },
            {
                id: 'story-an',
                kind: 'quote',
                name: 'An N.',
                location: 'San Jose, CA',
                category: 'Sleep',
                quote: 'Private, simple, and in my language the whole way through. It made getting care feel normal again.',
                rating: 5
            }
        ]
    },
    faq: {
        id: 'faq',
        heading: {
            eyebrow: 'FAQs',
            title: [{ kind: 'plain', text: 'Frequently Asked Questions' }],
            desktopBody: ['Have more questions? Our care team is here to help in your language.'],
            mobileBody: ['Have more questions? Our care team is here to help in your language.']
        },
        items: [
            {
                id: 'faq-states',
                question: 'What states do you serve in GLP-1 programs?',
                answer: ['We are currently able to serve GLP-1 programs in all 50 states.']
            },
            {
                id: 'faq-languages',
                question: 'Which languages do you support?',
                answer: ['We are currently able to serve GLP-1 programs in all 50 states.']
            },
            {
                id: 'faq-insurance',
                question: 'Do I need insurance?',
                answer: ['We are currently able to serve GLP-1 programs in all 50 states.']
            },
            {
                id: 'faq-compounded',
                question: 'What is compounded medication?',
                answer: ['We are currently able to serve GLP-1 programs in all 50 states.']
            }
        ]
    },
    finalCta: {
        id: 'final-cta',
        heading: {
            eyebrow: null,
            title: [{ kind: 'plain', text: 'Ready For Healthcare In Your Language?' }],
            desktopBody: [],
            mobileBody: []
        },
        benefits: [
            { id: 'final-appointment', text: 'No Appointment Needed' },
            { id: 'final-insurance', text: 'No Insurance Required' }
        ],
        action: { id: 'final-consult', kind: 'unresolved', label: 'Start free consultations' }
    },
    footer: {
        id: 'footer',
        logo: { ...placeholder, alt: 'Apsu' },
        tagline: 'American medicine, in the language you think in.',
        columns: [
            {
                id: 'footer-products',
                title: 'Products',
                links: [
                    { id: 'footer-weight-loss', kind: 'anchor', label: 'Weight Loss', target: 'weight-loss' },
                    { id: 'footer-birth-control', kind: 'anchor', label: 'Birth Control', target: 'birth-control' },
                    { id: 'footer-sleep', kind: 'anchor', label: 'Sleep', target: 'sleep' }
                ]
            },
            {
                id: 'footer-company',
                title: 'Company',
                links: [
                    { id: 'footer-about', kind: 'unresolved', label: 'About Apsu' },
                    { id: 'footer-blogs', kind: 'unresolved', label: 'Blogs' },
                    { id: 'footer-faq', kind: 'anchor', label: 'FAQs', target: 'faq' },
                    { id: 'footer-contact', kind: 'unresolved', label: 'Contact Us' }
                ]
            },
            {
                id: 'footer-legal',
                title: 'Legal',
                links: [
                    { id: 'footer-terms', kind: 'unresolved', label: 'Terms' },
                    { id: 'footer-privacy', kind: 'unresolved', label: 'Privacy Policy' },
                    { id: 'footer-medication', kind: 'unresolved', label: 'Medication Safety Information' }
                ]
            }
        ],
        socialLinks: [
            { id: 'footer-social-x', kind: 'unresolved', label: 'X' },
            { id: 'footer-social-facebook', kind: 'unresolved', label: 'Facebook' },
            { id: 'footer-social-instagram', kind: 'unresolved', label: 'Instagram' },
            { id: 'footer-social-linkedin', kind: 'unresolved', label: 'LinkedIn' }
        ],
        disclaimers: [
            'The information on this site is for general educational purposes and is not medical advice. Apsu is a technology platform; medical care is provided by independent, licensed providers, and pharmacy services by licensed pharmacies, who decide whether treatment is appropriate. Payment does not guarantee a prescription. Apsu offers compounded GLP-1 medication, which is prepared by licensed U.S. compounding pharmacies and is not approved or evaluated by the FDA. Apsu does not manufacture medication, and product appearance may differ from images shown. Results vary and are not guaranteed. If this is an emergency, call 911.'
        ],
        termsNotice: 'By using our services, you agree to our Terms & Conditions.',
        copyright: '© 2026 APSU. All rights reserved.'
    }
} satisfies HomePage;
