import type { Meta, StoryObj } from '@storybook/nextjs-vite';

/** A foundations specimen, not a substitute for the P5 homepage or its visual review. */
function DesignTokens() {
    return (
        <main className="container-page bg-page px-page-gutter text-text space-y-8 py-8" data-testid="token-container">
            <header className="space-y-4">
                <p className="text-eyebrow tracking-eyebrow text-accent">APSU · DESIGN FOUNDATIONS</p>
                <h1 className="text-hero font-medium" data-testid="hero-type">
                    Healthcare that speaks your language.
                </h1>
                <p className="text-body text-text-body" data-testid="body-type">
                    Work Sans 400 / 500 · source typography at 375 and 1440.
                </p>
            </header>
            <section aria-labelledby="type-title" className="space-y-4">
                <h2 id="type-title" className="text-section font-medium" data-testid="section-type">
                    Source typography
                </h2>
                <p className="text-service-title font-medium" data-testid="service-type">
                    Service title
                </p>
                <p className="text-faq-answer" data-testid="faq-type">
                    FAQ answer typography
                </p>
                <p className="font-illustration text-body" data-testid="illustration-type">
                    Dr. Helena Fox · Syne illustration font
                </p>
            </section>
            <section aria-labelledby="color-title" className="space-y-4">
                <h2 id="color-title" className="text-section font-medium">
                    Source surfaces
                </h2>
                <div className="gap-card-gap grid sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-panel bg-surface-mint p-panel-inset shadow-card">Mint</div>
                    <div className="rounded-panel bg-surface-purple p-panel-inset shadow-panel">Purple</div>
                    <div className="rounded-panel bg-surface-cyan p-panel-inset">Cyan</div>
                </div>
                <p className="text-caption text-text-body">
                    This static specimen applies no product hover, entrance, or exit animation.
                </p>
            </section>
        </main>
    );
}

const meta = {
    title: 'Foundations/Design tokens',
    component: DesignTokens,
    parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof DesignTokens>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SourceBaseline: Story = {};
