import type { ServiceCards as Content } from '@/content/schema';
import { ActionControl, SourceImage, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type ServiceCardsProps = SectionProps<Content>;
export function ServiceCards({ content, ui }: ServiceCardsProps) {
    return (
        <section id={content.id} aria-label={ui.servicesLabel} className={styles.services} data-section="services">
            {content.items.map((item) => (
                <article key={item.id} className={styles.serviceCard} data-kind={item.kind}>
                    <div className={styles.serviceCopy}>
                        <p className={styles.eyebrow}>{item.label}</p>
                        <h2>{item.title}</h2>
                    </div>
                    <SourceImage
                        asset={item.image}
                        sizes="(min-width: 1024px) 280px, 180px"
                        className={styles.serviceImage}
                    />
                    <div className={styles.serviceAction}>
                        <ActionControl action={item.action} ui={ui} variant="secondary" small />
                    </div>
                </article>
            ))}
        </section>
    );
}
