import { getHomePage } from '@/lib/api/home';
import { homePresentation } from '@/content/presentation';
import {
    Header,
    Hero,
    ServiceCards,
    TrustMarquee,
    HowItWorks,
    WeightLoss,
    BmiCalculator,
    BirthControl,
    Sleep,
    OnlineCare,
    SuccessStories,
    Faq,
    FinalCta,
    Footer
} from '@/components';
import styles from '@/components/sections/sections.module.css';

/** The server fetches one validated contract; each section receives only its own content. */
export default async function Home() {
    const home = await getHomePage();
    const ui = homePresentation;
    return (
        <div id="top" className={styles.page}>
            <div className={`${styles.topShell} ${styles.headerShell}`}>
                <Header content={home.header} ui={ui} />
            </div>
            <main id="main-content" tabIndex={-1}>
                <div className={`${styles.topShell} ${styles.heroShell}`}>
                    <Hero content={home.hero} ui={ui} />
                    <ServiceCards content={home.serviceCards} ui={ui} />
                </div>
                <TrustMarquee content={home.trustMarquee} ui={ui} />
                <HowItWorks content={home.howItWorks} ui={ui} />
                <WeightLoss content={home.weightLoss} ui={ui} />
                <BmiCalculator content={home.bmiCalculator} ui={ui} />
                <BirthControl content={home.birthControl} ui={ui} />
                <Sleep content={home.sleep} ui={ui} />
                <OnlineCare content={home.onlineCare} ui={ui} />
                <SuccessStories content={home.successStories} ui={ui} />
                <Faq content={home.faq} ui={ui} />
                <FinalCta content={home.finalCta} ui={ui} />
            </main>
            <Footer content={home.footer} ui={ui} />
        </div>
    );
}
