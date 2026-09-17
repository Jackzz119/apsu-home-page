import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import Home from '@/app/page';

it('renders the home page with one main landmark', async () => {
    const markup = renderToStaticMarkup(await Home());

    expect(markup.match(/<main(?:\s[^>]*)?>/g)).toHaveLength(1);
});
