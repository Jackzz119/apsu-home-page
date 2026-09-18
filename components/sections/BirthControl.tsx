import type { BirthControl as Content } from '@/content/schema';
import {
    ActionControl,
    FeatureList,
    ProductPrice,
    SectionHeading,
    SourceImage,
    type SectionProps
} from './SectionPrimitives';
import styles from './sections.module.css';
export type BirthControlProps = SectionProps<Content>;
export function BirthControl({ content, ui }: BirthControlProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            tabIndex={-1}
            className={styles.section}
            data-section="birth-control">
            <div className={`${styles.productPanel} ${styles.birthPanel}`}>
                <div className={styles.productCopy}>
                    <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
                    <FeatureList items={content.benefits} />
                    <ProductPrice price={content.price} />
                    <ActionControl action={content.action} ui={ui} variant="secondary" small />
                </div>
                <SourceImage
                    asset={content.image}
                    className={styles.productImage}
                    sizes="(min-width: 1024px) 600px, 375px"
                />
            </div>
        </section>
    );
}
