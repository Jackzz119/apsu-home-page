import { Syne, Work_Sans } from 'next/font/google';

/** Actual source weights, independent of Figma's style names. */
export const workSans = Work_Sans({
    subsets: ['latin'],
    weight: ['400', '500'],
    display: 'swap',
    variable: '--font-work-sans'
});

/** Restricted to the static provider-chat illustration. */
export const syne = Syne({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-syne' });
