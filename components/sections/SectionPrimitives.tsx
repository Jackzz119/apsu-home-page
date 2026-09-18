import Image from 'next/image';
import { CircleCheck, Check, Truck, Stethoscope, Globe, MapPin, Headphones, CreditCard } from 'lucide-react';
import type { Action, FeatureItem, Heading, ImageAsset, Price, TextRun } from '@/content/schema';
import type { HomePresentation } from '@/content/presentation';
import { Button } from '../ui/Button';
import styles from './sections.module.css';

export type SectionProps<T> = { content: T; ui: HomePresentation };

export function SourceImage({
    asset,
    className,
    priority = false,
    sizes = asset.width <= 40 ? `${asset.width}px` : '100vw'
}: {
    asset: ImageAsset;
    className?: string;
    priority?: boolean;
    sizes?: string;
}) {
    return <Image {...asset} alt={asset.alt} className={className} sizes={sizes} preload={priority} />;
}

export function TitleRuns({ runs }: { runs: TextRun[] }) {
    return runs.map((run, index) => (
        <span key={index} className={run.kind === 'accent' ? styles.accent : undefined}>
            {run.text}
        </span>
    ));
}

export function SectionHeading({
    heading,
    hero = false,
    headingId
}: {
    heading: Heading;
    hero?: boolean;
    headingId?: string;
}) {
    const Title = hero ? 'h1' : 'h2';
    return (
        <div className={styles.heading}>
            {heading.eyebrow && <p className={styles.eyebrow}>{heading.eyebrow}</p>}
            <Title id={headingId}>
                <TitleRuns runs={heading.title} />
            </Title>
            <div className={styles.desktopCopy}>
                {heading.desktopBody.map((text, i) => (
                    <p key={i}>{text}</p>
                ))}
            </div>
            <div className={styles.mobileCopy}>
                {heading.mobileBody.map((text, i) => (
                    <p key={i}>{text}</p>
                ))}
            </div>
        </div>
    );
}

export function ActionControl({
    action,
    ui,
    variant = 'primary',
    small = false,
    arrow = true
}: {
    action: Action;
    ui: HomePresentation;
    variant?: 'primary' | 'secondary' | 'outline';
    small?: boolean;
    arrow?: boolean;
}) {
    const href = action.kind === 'anchor' ? `#${action.target}` : action.kind === 'external' ? action.href : undefined;
    return (
        <Button
            {...(href ? { href } : {})}
            data-action-kind={action.kind}
            variant={variant}
            size={small ? 'sm' : 'md'}
            trailingIcon={arrow ? <SourceImage asset={variant === 'primary' ? ui.arrow : ui.smallArrow} /> : undefined}>
            {action.label}
        </Button>
    );
}

export function TextAction({ action }: { action: Action }) {
    const href = action.kind === 'anchor' ? `#${action.target}` : action.kind === 'external' ? action.href : undefined;
    return href ? (
        <a className={styles.textAction} href={href}>
            {action.label}
        </a>
    ) : (
        <button type="button" className={styles.textAction} data-action-kind="demo">
            {action.label}
        </button>
    );
}

export function FeatureIcon({ id }: { id: string }) {
    const Icon = /shipping|delivery|pharmacies/.test(id)
        ? Truck
        : /physician/.test(id)
          ? Stethoscope
          : /language/.test(id)
            ? Globe
            : /states/.test(id)
              ? MapPin
              : /assistant/.test(id)
                ? Headphones
                : /payment/.test(id)
                  ? CreditCard
                  : Check;
    return <Icon aria-hidden="true" />;
}

export function FeatureList({ items, icons = false }: { items: FeatureItem[]; icons?: boolean }) {
    return (
        <ul className={styles.features}>
            {items.map((item) => (
                <li key={item.id}>
                    {icons ? (
                        <FeatureIcon id={item.id} />
                    ) : (
                        <CircleCheck aria-hidden="true" className={styles.checkIcon} />
                    )}
                    <span>{item.text}</span>
                </li>
            ))}
        </ul>
    );
}

export function ProductPrice({ price }: { price: Price }) {
    return (
        <p className={styles.price}>
            {price.prefix && <span>{price.prefix}</span>}
            <strong>
                {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency,
                    maximumFractionDigits: 0
                }).format(price.amount / 100)}
                <small>/mo</small>
            </strong>
        </p>
    );
}
