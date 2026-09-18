import type { Sleep as Content } from '@/content/schema';
import {
    ActionControl,
    FeatureList,
    ProductPrice,
    SectionHeading,
    SourceImage,
    type SectionProps
} from './SectionPrimitives';
import styles from './sections.module.css';
export type SleepProps = SectionProps<Content>;
export function Sleep({ content, ui }: SleepProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            tabIndex={-1}
            className={styles.section}
            data-section="sleep">
            <div className={`${styles.productPanel} ${styles.sleepPanel}`}>
                <div className={styles.productCopy}>
                    <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
                    <FeatureList items={content.benefits} />
                    <ProductPrice price={content.price} />
                    <ActionControl action={content.action} ui={ui} variant="secondary" small />
                </div>
                <div className={styles.sleepArt}>
                    <SourceImage
                        asset={content.image}
                        className={styles.productImage}
                        sizes="(min-width: 1024px) 600px, 375px"
                    />
                    <div className={styles.profile} aria-hidden="true">
                        <div className={styles.profileIdentity}>
                            <strong>{content.profile.name}</strong>
                            <div className={styles.profileMetrics}>
                                <p>
                                    <strong>{content.profile.score}</strong>
                                    <span>{content.profile.scoreLabel}</span>
                                </p>
                                <p>
                                    <strong>{content.profile.progress}%</strong>
                                    <span>{content.profile.progressLabel}</span>
                                </p>
                            </div>
                        </div>
                        <div className={styles.profileProgress}>
                            <strong>{content.profile.title}</strong>
                            <div className={styles.profileScale} />
                            <span>{content.profile.completion}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
