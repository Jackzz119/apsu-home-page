import type { HowItWorks as Content } from '@/content/schema';
import { FeatureList, SectionHeading, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type HowItWorksProps = SectionProps<Content>;
export function HowItWorks({ content }: HowItWorksProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            className={`${styles.section} ${styles.how}`}
            data-section="how-it-works">
            <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
            <div className={styles.roles}>
                {content.roles.map((role) => (
                    <article key={role.id} className={styles.role}>
                        <svg className={styles.step} aria-hidden="true" viewBox="0 0 100 90">
                            <text x="100" y="72" textAnchor="end">
                                {role.step}
                            </text>
                        </svg>
                        <h3>{role.title}</h3>
                        <p>{role.description}</p>
                        <FeatureList items={role.responsibilities} />
                    </article>
                ))}
            </div>
            <p className={styles.roleNote}>{content.note}</p>
        </section>
    );
}
