import type { SuccessStories as Content } from '@/content/schema';
import { Rating } from '../ui/Rating';
import { SectionHeading, SourceImage, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type SuccessStoriesProps = SectionProps<Content>;
export function SuccessStories({ content, ui }: SuccessStoriesProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            className={`${styles.section} ${styles.stories}`}
            data-section="success-stories">
            <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
            <div className={styles.storyGrid}>
                {content.stories.map((story) => (
                    <article key={story.id} className={styles.storyCard} data-kind={story.kind}>
                        {story.kind === 'quote' ? (
                            <>
                                <p className={styles.storyCategory}>{story.category}</p>
                                <Rating
                                    value={story.rating}
                                    label={ui.ratingLabel.replace('{value}', String(story.rating))}
                                />
                                <blockquote>{story.quote}</blockquote>
                            </>
                        ) : (
                            <SourceImage asset={story.image} sizes="(min-width: 1024px) 430px, 375px" />
                        )}
                        <div className={styles.storyAuthor}>
                            <strong>{story.name}</strong>
                            <span>{story.location}</span>
                        </div>
                        {
                            <div className={styles.socialDecoration} aria-hidden="true">
                                {ui.testimonialIcons.map((icon) => (
                                    <span key={icon.src}>
                                        <SourceImage asset={icon} />
                                    </span>
                                ))}
                            </div>
                        }
                    </article>
                ))}
            </div>
        </section>
    );
}
