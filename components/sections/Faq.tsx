'use client';
import type { Faq as Content } from '@/content/schema';
import { Accordion } from '../ui/Accordion';
import { SectionHeading, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type FaqProps = SectionProps<Content>;
export function Faq({ content }: FaqProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            tabIndex={-1}
            className={`${styles.section} ${styles.faq}`}
            data-section="faq">
            <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
            <div className={styles.faqItems}>
                {content.items.map((item, index) => (
                    <Accordion key={item.id} title={item.question} defaultOpen={index === 0}>
                        {item.answer.map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </Accordion>
                ))}
            </div>
        </section>
    );
}
