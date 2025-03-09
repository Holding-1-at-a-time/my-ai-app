// /app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import { processAndEmbedPage } from '../../../lib/processPage';
import { convexFetch } from '../../../lib/convexclient';

export async function POST(request: Request) {
    const { url } = await request.json();

    try {
        // Process the URL by scraping it and generating its embedding.
        const { title, content, embedding } = await processAndEmbedPage(url);

        // Store the entry in the Convex knowledge base.
        const entryId = await convexFetch("addEntry", { title, content, embedding, url });

        return NextResponse.json({ success: true, entryId });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
