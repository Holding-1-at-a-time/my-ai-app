import { v } from "convex/values"
import { action, mutation, query, internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import { api } from "./_generated/api"
import { rateLimiter } from "../lib/rate-limit"
import { scrape } from "../lib/scraper"
import { semanticSearch } from "../lib/semantic-search"

const EMBEDDING_MODEL = "nomic-embed-text"
const OLLAMA_MODEL = "llama3:2"

export const addEntry = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    embedding: v.array(v.float64()),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const knowledgeEntry = {
      title: args.title,
      content: args.content,
      embedding: args.embedding,
      url: args.url,
    }
    await ctx.db.insert("knowledgeEntries", knowledgeEntry)
  },
})

export const getAllEntries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("knowledgeEntries").collect()
  },
})

export const scrapeAndAddEntry = action({
  args: {
    url: v.string(),
    mode: v.string(),
    useDynamic: v.boolean(),
    requestId: v.string(), // Use a requestId instead of ipAddress for rate limiting
  },
  handler: async (ctx, args) => {
    const rateLimitResult = rateLimiter.isWithinLimit(args.requestId)
    if (!rateLimitResult) {
      console.warn("Rate limit exceeded for request ID: ", args.requestId)
      return {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      }
    }

    try {
      const scrapedContent = await scrape(args.url, args.mode as "page" | "website", args.useDynamic)

      // Call the createEmbedding internal action
      const { embedding } = await ctx.runAction(internal.knowledgeEntries.createEmbedding, {
        text: scrapedContent,
      })

      await ctx.runMutation(api.knowledgeEntries.addEntry, {
        title: args.url,
        content: scrapedContent,
        embedding: embedding,
        url: args.url,
      })

      return { success: true, message: "Successfully scraped and added entry." }
    } catch (error: any) {
      console.error("Scrape and add entry failed:", error.message)
      return { success: false, message: `Scrape and add entry failed: ${error.message}` }
    }
  },
})

export const categorizeEntries = action({
  args: {
    requestId: v.string(), // Use a requestId instead of ipAddress for rate limiting
  },
  handler: async (ctx, args) => {
    const rateLimitResult = rateLimiter.isWithinLimit(args.requestId)
    if (!rateLimitResult) {
      console.warn("Rate limit exceeded for request ID: ", args.requestId)
      return {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      }
    }

    try {
      const knowledgeEntries = await ctx.runQuery(api.knowledgeEntries.getAllEntries)

      if (knowledgeEntries.length === 0) {
        return { success: false, message: "No knowledge entries found." }
      }

      const representativeEntry = knowledgeEntries[0]

      // Call the createEmbedding internal action
      const { embedding: representativeEmbedding } = await ctx.runAction(internal.knowledgeEntries.createEmbedding, {
        text: representativeEntry.content,
      })

      const groupedEntries = await semanticSearch(knowledgeEntries, representativeEmbedding)

      return { success: true, message: "Successfully categorized entries.", data: groupedEntries }
    } catch (error: any) {
      console.error("Categorize entries failed:", error.message)
      return { success: false, message: `Categorize entries failed: ${error.message}` }
    }
  },
})

export const createEmbedding = internalAction({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Use the Ollama API to generate embeddings
      const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          prompt: args.text,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API returned ${response.status}: ${await response.text()}`)
      }

      const data = await response.json()
      return { success: true, embedding: data.embedding }
    } catch (error: any) {
      console.error("Embedding creation failed:", error)
      throw new Error(`Embedding creation failed: ${error.message}`)
    }
  },
})

