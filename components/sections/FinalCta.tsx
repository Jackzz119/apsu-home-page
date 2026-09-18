import type { FinalCta as Content } from '@/content/schema';
import { ActionControl, FeatureList, SectionHeading, SourceImage, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type FinalCtaProps = SectionProps<Content>;
export function FinalCta({ content, ui }: FinalCtaProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            className={styles.finalCta}
            data-section="final-cta">
            <div className={styles.finalPanel}>
                <SourceImage asset={ui.ctaWordmark} className={styles.ctaWordmark} />
                <div className={styles.finalInner}>
                    <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
                    <FeatureList items={content.benefits} />
                    <ActionControl action={content.action} ui={ui} />
                </div>
            </div>
        </section>
    );
}
