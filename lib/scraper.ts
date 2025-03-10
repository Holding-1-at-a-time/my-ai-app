import axios from 'axios';
import * as cheerio from 'cheerio';
import type * as puppeteerType from 'puppeteer';

const MAX_WEBSITE_PAGES = 200;

async function staticScrape(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    return $('body').text();
  } catch (error: any) {
    console.error('Static scrape failed:', error.message);
    throw new Error(`Static scrape failed: ${error.message}`);
  }
}

async function dynamicScrape(url: string): Promise<string> {
  let browser: puppeteerType.Browser | null = null;
  try {
    // Dynamically import puppeteer only when needed
    const puppeteer = await import('puppeteer');

    browser = await puppeteer.default.launch({
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    return await page.evaluate(() => document.body.innerText);
  } catch (error: any) {
    console.error('Dynamic scrape failed:', error.message);
    throw new Error(`Dynamic scrape failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function crawlWebsite(url: string, visited: Set<string> = new Set(), pageCount: number = 0): Promise<string> {
  if (visited.has(url) || pageCount >= MAX_WEBSITE_PAGES) {
    return '';
  }

  visited.add(url);
  pageCount++;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    let allText = $('body').text() + '\n';

    const links = $('a[href]')
      .map((_, a) => $(a).attr('href'))
      .get()
      .map(link => {
        try {
          return new URL(link, url).href;
        } catch {
          return null;
        }
      })
      .filter(link => link && link.startsWith(url)) as string[];

    for (const link of links) {
      allText += await crawlWebsite(link, visited, pageCount);
    }

    return allText;
  } catch (error: any) {
    console.error(`Crawl failed for ${url}: ${error.message}`);
    return '';
  }
}


export async function scrape(url: string, mode: 'page' | 'website', useDynamic: boolean): Promise<string> {
  try {
    if (useDynamic) {
          return await dynamicScrape(url);
        }
    else if (mode === 'page') {
            return await staticScrape(url);
          }
    else {
            return await crawlWebsite(url);
          }
  } catch (error: any) {
    console.error('Scrape failed:', error.message);
    throw new Error(`Scrape failed: ${error.message}`);
  }
}