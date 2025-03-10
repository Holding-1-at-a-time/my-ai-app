"use node"

// This file uses the Node.js runtime for Ollama API interactions
import { v } from "convex/values"
import { action } from "./_generated/server"

export const createEmbedding = action({
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
                    model: "nomic-embed-text",
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

export const generateText = action({
    args: {
        prompt: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            // Use the Ollama API to generate text
            const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama3:2",
                    prompt: args.prompt,
                    stream: false,
                }),
            })

            if (!response.ok) {
                throw new Error(`Ollama API returned ${response.status}: ${await response.text()}`)
            }

            const data = await response.json()
            return { success: true, text: data.response }
        } catch (error: any) {
            console.error("Text generation failed:", error)
            throw new Error(`Text generation failed: ${error.message}`)
        }
    },
})

