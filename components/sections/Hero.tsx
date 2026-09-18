import type { Hero as HeroContent } from '@/content/schema';
import { ActionControl, FeatureList, SectionHeading, type SectionProps } from './SectionPrimitives';
import { LanguageMarquee } from './LanguageMarquee';
import styles from './sections.module.css';
export type HeroProps = SectionProps<HeroContent>;
export function Hero({ content, ui }: HeroProps) {
    return (
        <section id={content.id} aria-labelledby={`${content.id}-title`} className={styles.hero} data-section="hero">
            <FeatureList items={content.benefits} icons />
            <SectionHeading heading={content.heading} headingId={`${content.id}-title`} hero />
            <ActionControl action={content.action} ui={ui} />
            <LanguageMarquee content={content.languageRows} ui={ui} />
        </section>
    );
}
