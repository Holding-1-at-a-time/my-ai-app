// /lib/processPage.ts
import { scrapeWebPage } from './scraper';
import { generateEmbedding } from './generateEmbedding';
import { scrapeStaticPage, scrapeDynamicPage, scrapeWebsite } from './scraper';

/**
 * Interface representing a processed page with URL, title, content, and embedding.
 */
export interface ProcessedPage {
    url: string;
    title: string;
    content: string;
    embedding: number[];
}

/**
 * Process a single page by scraping it and generating its embedding.
 * @param url - The URL of the page to process.
 * @param useDynamic - Whether to use dynamic page scraping.
 * @returns A Promise resolving to a ProcessedPage object.
 */
export async function processSinglePage(url: string, useDynamic: boolean = false): Promise<ProcessedPage> {
    // Select the appropriate scraping function based on the useDynamic flag.
    const scrapeFn = useDynamic ? scrapeDynamicPage : scrapeStaticPage;
    try {
        // Scrape the page to get its title and content.
        const { title, content } = await scrapeFn(url);
        // Generate an embedding for the page content.
        const embedding = await generateEmbedding(content);
        return { url, title, content, embedding };
    } catch (error) {
        const message = `Failed to process single page ${url}`;
        if (error instanceof Error) {
            console.error(`${message}:`, error.message);
            throw new Error(`${message}: ${error.message}`);
        } else {
            console.error(`${message}:`, error);
            throw new Error(`${message}: Unknown error occurred`);
        }
    }
}

/**
 * Process an entire website by scraping multiple pages and generating embeddings.
 * @param url - The base URL of the website to process.
 * @param useDynamic - Whether to use dynamic page scraping.
 * @returns A Promise resolving to an array of ProcessedPage objects.
 */
export async function processWebsite(url: string, useDynamic: boolean = false): Promise<ProcessedPage[]> {
    try {
        // Scrape the website to get pages with their title and content.
        const pages = await scrapeWebsite(url, useDynamic);
        const processedPages: ProcessedPage[] = [];

        // Generate embeddings for each page and store the processed data.
        for (const page of pages) {
            try {
                const embedding = await generateEmbedding(page.content);
                processedPages.push({ url: page.url, title: page.title, content: page.content, embedding });
            } catch (error) {
                console.error(`Failed to generate embedding for ${page.url}:`, error);
            }
        }
        return processedPages;
    } catch (error) {
        const message = `Failed to process entire website ${url}`;
        if (error instanceof Error) {
            console.error(`${message}:`, error.message);
            throw new Error(`${message}: ${error.message}`);
        } else {
            console.error(`${message}:`, error);
            throw new Error(`${message}: Unknown error occurred`);
        }
    }
}

/**
 * Processes a given URL by scraping its content, generating an embedding,
 * and returning the necessary data to store in the knowledge base.
 * @param url - The URL to process.
 * @returns A Promise resolving to an object containing the page title, content, and embedding.
 */
export async function processAndEmbedPage(url: string): Promise<{
    title: string;
    content: string;
    embedding: number[];
}> {
    try {
        // Scrape the web page to get its title and content.
        const { title, content } = await scrapeWebPage(url);

        // Generate an embedding for the extracted content.
        const embedding = await generateEmbedding(content);

        return { title, content, embedding };
    } catch (error) {
        const message = `Failed to process and embed page ${url}`;
        if (error instanceof Error) {
            console.error(`${message}:`, error.message);
            throw new Error(`${message}: ${error.message}`);
        } else {
            console.error(`${message}:`, error);
            throw new Error(`${message}: Unknown error occurred`);
        }
    }
}

