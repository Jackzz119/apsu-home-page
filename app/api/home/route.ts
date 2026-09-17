import { HomePage } from '@/content/schema';
import { homeMock } from '@/content/mocks/home';

/** Serve the same validated fixture used by the default server-rendering branch. */
export function GET() {
    return Response.json(HomePage.parse(homeMock));
}
