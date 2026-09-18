'use client';
import type { TrustMarquee as Content } from '@/content/schema';
import { Marquee } from '../ui/Marquee';
import { FeatureIcon, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type TrustMarqueeProps = SectionProps<Content>;
export function TrustMarquee({ content, ui }: TrustMarqueeProps) {
    return (
        <div id={content.id} className={styles.trust} data-section="trust-marquee">
            <Marquee
                label={ui.trustLabel}
                autoPlay
                pauseLabel={ui.pauseTrust}
                resumeLabel={ui.resumeTrust}
                items={content.items.map((item) => ({
                    id: item.id,
                    content: (
                        <span className={styles.trustItem}>
                            <FeatureIcon id={item.id} />
                            {item.text}
                        </span>
                    )
                }))}
            />
        </div>
    );
}
