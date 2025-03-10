import { ollama } from "ollama-ai-provider"
import { v } from "convex/values"
import { action, mutation, query, internalAction } from "./_generated/server"
import { rateLimiter } from "../lib/rate-limit"
import { scrape } from "../lib/scraper"
import { semanticSearch } from "../lib/semantic-search"
import { api } from "./_generated/api"
import { internal } from "./_generated/api"

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
  },
  handler: async (ctx, args) => {
    const rateLimitResult = rateLimiter.isWithinLimit(ctx.ipAddress)
    if (!rateLimitResult) {
      console.warn("Rate limit exceeded for IP: ", ctx.ipAddress)
      return {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      }
    }

    try {
      const scrapedContent = await scrape(args.url, args.mode as "page" | "website", args.useDynamic)
      const embeddingModel = ollama.embedding(EMBEDDING_MODEL)
      const { embedding } = await ctx.runAction(internal.createEmbedding, {
        text: scrapedContent,
        embeddingModel,
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
  args: {},
  handler: async (ctx, args) => {
    const rateLimitResult = rateLimiter.isWithinLimit(ctx.ipAddress)
    if (!rateLimitResult) {
      console.warn("Rate limit exceeded for IP: ", ctx.ipAddress)
      return {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      }
    }

    try {
      const knowledgeEntries = await ctx.runQuery(api.knowledgeEntries.getAllEntries)
      const allEmbeddings = knowledgeEntries.map((entry) => entry.embedding)

      if (knowledgeEntries.length === 0) {
        return { success: false, message: "No knowledge entries found." }
      }

      const representativeEntry = knowledgeEntries[0]
      const embeddingModel = ollama.embedding(EMBEDDING_MODEL)
      const { embedding: representativeEmbedding } = await ctx.runAction(internal.createEmbedding, {
        text: representativeEntry.content,
        embeddingModel,
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
    embeddingModel: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      const model = args.embeddingModel
      const { embedding } = await ollama.embedding("nomic-embed-text").embed({
        value: args.text,
      })
      return { success: true, embedding }
    } catch (error: any) {
      console.error("Embedding creation failed:", error)
      throw new Error(`Embedding creation failed: ${error}`)
    }
  },
})

