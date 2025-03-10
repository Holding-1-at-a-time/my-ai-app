// This file uses the default Convex runtime
import { v } from "convex/values"
import { mutation, query, action } from "./_generated/server"
import { internal } from "./_generated/api"
import { api } from "./_generated/api"




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
    try {
      // Call the Node.js action to scrape the content
      const scrapedContent = await ctx.runAction(internal.scraper.scrapeUrl, {
        url: args.url,
        mode: args.mode,
        useDynamic: args.useDynamic,
      })

      // Call the Node.js action to create an embedding
      const { embedding } = await ctx.runAction(internal.ollama.createEmbedding, {
        text: scrapedContent,
      })

      // Add the entry to the database
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
    try {
      const knowledgeEntries = await ctx.runQuery(api.knowledgeEntries.getAllEntries)

      if (knowledgeEntries.length === 0) {
        return { success: false, message: "No knowledge entries found." }
      }

      // Simple grouping by domain for now
      const groupedEntries: Record<string, any[]> = {}

      for (const entry of knowledgeEntries) {
        try {
          const url = new URL(entry.url)
          const domain = url.hostname

          if (!groupedEntries[domain]) {
            groupedEntries[domain] = []
          }

          groupedEntries[domain].push(entry)
        } catch (error) {
          // If URL parsing fails, put in "Other" group
          if (!groupedEntries["Other"]) {
            groupedEntries["Other"] = []
          }
          groupedEntries["Other"].push(entry)
        }
      }

      return {
        success: true,
        message: "Successfully categorized entries.",
        data: groupedEntries,
      }
    } catch (error: any) {
      console.error("Categorize entries failed:", error.message)
      return { success: false, message: `Categorize entries failed: ${error.message}` }
    }
  },
})

