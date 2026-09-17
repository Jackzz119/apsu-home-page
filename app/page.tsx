import { getHomePage } from '@/lib/api/home';

/** Load the content contract; P5 will distribute these fields to the section components. */
export default async function Home() {
    const home = await getHomePage();

    return <main aria-label={home.hero.heading.title.map((run) => run.text).join('')} />;
}
