"use node"

// This file uses the Node.js runtime for web scraping
import axios from "axios"
import * as cheerio from "cheerio"
import puppeteer from "puppeteer"
import { v } from "convex/values"
import { action } from "./_generated/server"
import type * as puppeteerType from 'puppeteer';

const MAX_WEBSITE_PAGES = 200

async function staticScrape(url: string): Promise<string> {
    try {
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)
        return $("body").text()
    } catch (error: any) {
        console.error("Static scrape failed:", error.message)
        throw new Error(`Static scrape failed: ${error.message}`)
    }
}

async function dynamicScrape(url: string): Promise<string> {
    let browser: puppeteerType.Browser | null = null;
    try {
        browser = await puppeteer.launch({
            args: ["--no-sandbox"],
        })
        const page = await browser.newPage()
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000,
        })
        return await page.evaluate(() => document.body.innerText)
    } catch (error: any) {
        console.error("Dynamic scrape failed:", error.message)
        throw new Error(`Dynamic scrape failed: ${error.message}`)
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}

async function crawlWebsite(url: string, visited: Set<string> = new Set(), pageCount = 0): Promise<string> {
    if (visited.has(url) || pageCount >= MAX_WEBSITE_PAGES) {
        return ""
    }

    visited.add(url)
    pageCount++

    try {
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)
        let allText = $("body").text() + "\n"

        const links = $("a[href]")
            .map((_, a) => $(a).attr("href"))
            .get()
            .map((link) => {
                try {
                    return new URL(link, url).href
                } catch {
                    return null
                }
            })
            .filter((link) => link && link.startsWith(url)) as string[]

        for (const link of links) {
            allText += await crawlWebsite(link, visited, pageCount)
        }

        return allText
    } catch (error: any) {
        console.error(`Crawl failed for ${url}: ${error.message}`)
        return ""
    }
}

export const scrapeUrl = action({
    args: {
        url: v.string(),
        mode: v.string(),
        useDynamic: v.boolean(),
    },
    handler: async (ctx, args) => {
        try {
            if (args.useDynamic) {
                return await dynamicScrape(args.url)
            } else {
                if (args.mode === "page") {
                    return await staticScrape(args.url)
                } else {
                    return await crawlWebsite(args.url)
                }
            }
        } catch (error: any) {
            console.error("Scrape failed:", error.message)
            throw new Error(`Scrape failed: ${error.message}`)
        }
    },
})

