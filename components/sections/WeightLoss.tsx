import type { WeightLoss as Content } from '@/content/schema';
import {
    ActionControl,
    FeatureList,
    ProductPrice,
    SectionHeading,
    SourceImage,
    type SectionProps
} from './SectionPrimitives';
import styles from './sections.module.css';
export type WeightLossProps = SectionProps<Content>;
export function WeightLoss({ content, ui }: WeightLossProps) {
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            tabIndex={-1}
            className={`${styles.section} ${styles.weight}`}
            data-section="weight-loss">
            <div className={`${styles.productPanel} ${styles.weightPanel}`}>
                <div className={styles.productCopy}>
                    <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
                    <FeatureList items={content.benefits} />
                    <ActionControl action={content.action} ui={ui} variant="secondary" small />
                </div>
                <SourceImage
                    asset={content.image}
                    className={styles.productImage}
                    sizes="(min-width: 1024px) 660px, 300px"
                />
            </div>
            <div id="weight-loss-plans" tabIndex={-1} className={styles.plans}>
                {content.plans.map((plan) => (
                    <article key={plan.id} className={styles.plan}>
                        <div className={styles.planArt}>
                            {plan.image && <SourceImage asset={plan.image} sizes="(min-width: 1024px) 400px, 140px" />}
                        </div>
                        <h3 className={styles.planTitle}>{plan.name}</h3>
                        <div className={styles.planInfo}>
                            <ProductPrice price={plan.price} />
                        </div>
                        <div className={styles.planAction}>
                            <ActionControl action={plan.action} ui={ui} small />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
