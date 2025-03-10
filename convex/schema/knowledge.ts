// /convex/schema/knowledge.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    knowledgeEntries: defineTable({
        title: v.string(),
        content: v.string(),
        embedding: v.array(v.float64()),
        url: v.string(),
        knowledgeEntries: v.union(v.array(
            v.object({
                title: v.string(),
                content: v.string(),
                embedding: v.array(v.float64()),
                url: v.string(),
            })
        )
        ),
    })
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 8192,
            filterFields: ["title", "content", "embedding", "knowledgeEntries", "id", "tittle.content"]
        })
});
