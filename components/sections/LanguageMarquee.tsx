'use client';
import { useState } from 'react';
import type { Hero } from '@/content/schema';
import { useInputModality } from '@/lib/useInputModality';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';
import { Marquee } from '../ui/Marquee';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import type { SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type LanguageMarqueeProps = SectionProps<Hero['languageRows']>;
export function LanguageMarquee({ content, ui }: LanguageMarqueeProps) {
    const [paused, setPaused] = useState(false);
    const [selected, setSelected] = useState(
        () =>
            new Set(
                content
                    .flat()
                    .filter((language) => language.highlighted)
                    .map((language) => language.id)
            )
    );
    function toggle(id: string) {
        setSelected((previous) => {
            const next = new Set(previous);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }
    const modality = useInputModality();
    const reduced = useReducedMotionPreference();
    return (
        <div className={styles.languages} data-paused={paused} data-input={modality}>
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
                                selected={selected.has(language.id)}
                                onClick={() => toggle(language.id)}
                                label={language.label}
                                direction={language.direction}
                            />
                        ),
                        duplicateContent: (
                            <Chip
                                selected={selected.has(language.id)}
                                onClick={() => toggle(language.id)}
                                tabIndex={-1}
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
