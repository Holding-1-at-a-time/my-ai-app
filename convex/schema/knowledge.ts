// /convex/schema/knowledge.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    knowledgeEntries: defineTable({
        id: v.string(),
        title: v.string(),
        content: v.string(),
        embedding: v.array(v.float64()),
        knowledgeEntries: v.union(v.array(
            (
                v.literal("title"),
                v.literal("content"),
                v.union(v.literal("embedding"), v.float64()),
        )
        )),

    })
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 8192,
            filterFields: ["title", "content", "embedding", "knowledgeEntries", "id", "tittle.content"]
        })
});
