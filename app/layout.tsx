import type { Metadata } from 'next';
import { syne, workSans } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
    title: 'Apsu — Healthcare that speaks your language.',
    description: 'Care in the language you think in. US-licensed physicians, AI translates your consultation.'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${workSans.variable} ${syne.variable} h-full antialiased`}>
            <body className="flex min-h-full flex-col">{children}</body>
        </html>
    );
}
