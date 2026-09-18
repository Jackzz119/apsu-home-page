import { Star } from 'lucide-react';
import styles from './primitives.module.css';

export type RatingProps = { value: number; label: string; size?: 'sm' | 'md' };

/** Expose a read-only rating once; individual stars are decorative, including partial fills. */
export function Rating({ value, label, size = 'md' }: RatingProps) {
    const score = Number.isFinite(value) ? Math.min(5, Math.max(0, value)) : 0;
    return (
        <span role="img" aria-label={label} className={styles.rating} data-size={size}>
            {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={styles.star} aria-hidden="true">
                    <Star className={styles.starEmpty} />
                    <Star
                        className={styles.starFilled}
                        style={{ clipPath: `inset(0 ${(1 - Math.min(1, Math.max(0, score - index))) * 100}% 0 0)` }}
                    />
                </span>
            ))}
        </span>
    );
}
