import { HomePage } from '@/content/schema';
import { homeMock } from '@/content/mocks/home';

/** Read and validate homepage content; the default build never requests its own API. */
export async function getHomePage(): Promise<HomePage> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) return HomePage.parse(homeMock);

    const endpoint = new URL(`${baseUrl.replace(/\/+$/, '')}/api/home`);
    if (
        !['http:', 'https:'].includes(endpoint.protocol) ||
        endpoint.search ||
        endpoint.hash ||
        endpoint.username ||
        endpoint.password
    ) {
        throw new Error('NEXT_PUBLIC_API_URL must be an HTTP(S) base URL without credentials, query, or fragment.');
    }

    const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Homepage API returned HTTP ${response.status}.`);

    return HomePage.parse(await response.json());
}
