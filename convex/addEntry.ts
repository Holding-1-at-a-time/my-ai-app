// /convex/functions/addEntry.ts
import { mutation } from "./_generated/server";
import { generateEmbedding } from "../lib/generateEmbedding";
import axios from "axios";

/**
 * Adds a new entry to the knowledge database.
 *
 * @param title The title of the entry.
 * @param content The content of the entry.
 * @returns The ID of the newly inserted entry.
 */
export const addEntry = mutation(
    async ({ db }, { title, content }: { title: string; content: string; }): Promise<string> => {
        try {
            console.log('Received entry:', { title, content });
            // Generate an embedding for the content
            const embedding = await generateEmbedding(content);
            console.log('Generated embedding:', embedding);
            // Insert the entry into the database
            const result = await db.insert("knowledgeEntry", { title, content, embedding });
            console.log('Database insert result:', result);
            return result._id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Embedding generation failed:', error.message);
                throw new Error('Failed to generate embedding');
            } else {
                console.error('Unknown error occurred:', error);
                throw new Error('Unknown error occurred');
            }
        }
    }
);

