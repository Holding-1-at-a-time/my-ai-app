// /lib/scraper.ts
import axios from 'axios';
import cheerio from 'cheerio';

/**
 * Fetches a web page and extracts the title and main text content.
 * @param url - The page to scrape.
 * @returns An object containing the page title and aggregated text content.
 */
export async function scrapeWebPage(url: string): Promise<{ title: string; content: string }> {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const title = $('title').text().trim() || 'No Title';

        // Extract text in paragraphs.
        let content = '';
        $('p').each((_, element) => {
            content += $(element).text().trim() + '\n';
        });

        // Fallback if <p> is not sufficient.
        if (!content) {
            content = $('body').text().trim();
        }

        return { title, content };
    } catch (error) {
        console.error('Error scraping page:', error);
        throw new Error('Failed to scrape the webpage');
    }
}
