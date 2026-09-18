import type { OnlineCare as Content } from '@/content/schema';
import { Carousel } from '../ui/Carousel';
import { SectionHeading, SourceImage, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type OnlineCareProps = SectionProps<Content>;
export function OnlineCare({ content, ui }: OnlineCareProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            className={`${styles.section} ${styles.online}`}
            data-section="online-care">
            <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
            <Carousel
                label={ui.careCarouselLabel}
                previousLabel={content.previousLabel}
                nextLabel={content.nextLabel}
                statusLabel={ui.carouselStatus}
                items={content.cards.map((card) => ({
                    id: card.id,
                    label: card.title,
                    content: (
                        <article className={styles.careCard} data-kind={card.kind} data-card={card.id}>
                            <h3>{card.title}</h3>
                            {card.kind === 'image' ? (
                                <SourceImage asset={card.image} sizes="(min-width: 1024px) 420px, 335px" />
                            ) : (
                                <>
                                    <div className={styles.phoneArt}>
                                        <SourceImage asset={card.illustration} sizes="1109px" />
                                    </div>
                                    <div className={styles.chat}>
                                        <div className={styles.chatProvider}>
                                            <SourceImage asset={card.avatar} />
                                            <div>
                                                <strong>{card.providerName}</strong>
                                                <p>{card.statusLabel}</p>
                                            </div>
                                        </div>
                                        <p className={styles.chatDay}>{card.dayLabel}</p>
                                        {card.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={styles.chatMessage}
                                                data-speaker={message.speaker}>
                                                <p>{message.text}</p>
                                                <small>{message.time}</small>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </article>
                    )
                }))}
            />
        </section>
    );
}
