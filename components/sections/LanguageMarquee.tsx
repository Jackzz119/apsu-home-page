'use client';
import { useState } from 'react';
import type { Hero } from '@/content/schema';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';
import { Marquee } from '../ui/Marquee';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import type { SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type LanguageMarqueeProps = SectionProps<Hero['languageRows']>;
export function LanguageMarquee({ content, ui }: LanguageMarqueeProps) {
    const [paused, setPaused] = useState(false);
    const reduced = useReducedMotionPreference();
    return (
        <div className={styles.languages} data-paused={paused}>
            {content.map((row, index) => (
                <Marquee
                    key={index}
                    label={`${ui.languagesLabel} ${index + 1}`}
                    autoPlay
                    paused={paused}
                    showControl={false}
                    pauseLabel={ui.pauseLanguages}
                    resumeLabel={ui.resumeLanguages}
                    items={row.map((language) => ({
                        id: language.id,
                        content: (
                            <Chip
                                selected={language.highlighted}
                                label={language.label}
                                direction={language.direction}
                            />
                        )
                    }))}
                />
            ))}
            {!reduced && (
                <Button size="sm" variant="outline" className={styles.pauseControl} onClick={() => setPaused(!paused)}>
                    {paused ? ui.resumeLanguages : ui.pauseLanguages}
                </Button>
            )}
        </div>
    );
}
