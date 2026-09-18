import { getHomePage } from '@/lib/api/home';
import { Button } from '@/components';
import { primitiveMock } from '@/content/mocks/primitives';

/** Prove public-library consumption in a labelled development specimen until P5 composition. */
export default async function Home() {
    const home = await getHomePage();

    return (
        <main className="container-page space-y-content-gap p-page-gutter">
            <h1 className="text-section">{primitiveMock.heading}</h1>
            <p className="text-body">{primitiveMock.notice}</p>
            <Button disabled>{home.hero.action.label}</Button>
        </main>
    );
}
