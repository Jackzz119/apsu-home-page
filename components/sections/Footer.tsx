import type { Footer as Content } from '@/content/schema';
import { SourceImage, TextAction, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type FooterProps = SectionProps<Content>;
export function Footer({ content, ui }: FooterProps) {
    return (
        <footer id={content.id} className={styles.footer} data-section="footer">
            <div className={styles.footerInner}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <SourceImage asset={content.logo} />
                        <p>{content.tagline}</p>
                    </div>
                    {content.columns.map((column) => (
                        <div key={column.id} className={styles.footerColumn}>
                            <h2>{column.title}</h2>
                            <ul>
                                {column.links.map((action) => (
                                    <li key={action.id}>
                                        <TextAction action={action} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className={styles.disclaimer}>
                    {content.disclaimers.map((text, i) => (
                        <p key={i}>{text}</p>
                    ))}
                    <p>{content.termsNotice}</p>
                </div>
                <div className={styles.footerBottom}>
                    <div className={styles.footerSocial}>
                        {content.socialLinks.map((action, index) => (
                            <button
                                key={action.id}
                                type="button"
                                className={styles.textAction}
                                aria-label={action.label}
                                data-action-kind="demo">
                                <SourceImage asset={ui.socialIcons[index]} />
                            </button>
                        ))}
                    </div>
                    <p>{content.copyright}</p>
                </div>
                <div className={styles.footerWordmark} aria-hidden="true">
                    <SourceImage asset={ui.footerWordmark} />
                </div>
            </div>
        </footer>
    );
}
