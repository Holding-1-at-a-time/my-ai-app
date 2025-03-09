// /lib/processPage.ts
import { scrapeWebPage } from './scraper';
import { generateEmbedding } from './generateEmbedding';

/**
 * Processes a given URL: Scrapes content, generates an embedding,
 * and returns the necessary data to store in the knowledge base.
 * @param url - The URL to process.
 */
export async function processAndEmbedPage(url: string): Promise<{
    title: string;
    content: string;
    embedding: number[];
}> {
    // Scrape the web page.
    const { title, content } = await scrapeWebPage(url);

    // Generate an embedding for the extracted content.
    const embedding = await generateEmbedding(content);

    return { title, content, embedding };
}
