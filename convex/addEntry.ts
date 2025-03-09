// /convex/functions/addEntry.ts
import { mutation } from "./_generated/server";
import { generateEmbedding } from "../lib/generateEmbedding"

export default mutation(async ({ db }, { title, content, embedding, url }: { title: string; content: string; embedding: number[]; url?: string; }) => {
  const embedding = await generateEmbedding(content);

  return await db.insert("knowledgeEntry", {
    title, content, embedding, url
});
