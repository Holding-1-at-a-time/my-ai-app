// /lib/generateEmbedding.ts
import axios from 'axios';

/**
 * Generates an embedding for a given text using the Nomic Embeddings API.
 * @param text The text to generate the embedding for
 * @returns The generated embedding as an array of numbers
 * @throws An error if the API request fails
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        // Make a POST request to the Nomic Embeddings API
        const response = await axios.post(
            // Use the base URL from the environment variable
            `${process.env.OLLAMA_BASE_URL}/embed`,
            {
                // Specify the model to use
                model: 'nomic-embed-text',
                // Pass the text as input
                input: text,
            }
        );

        // Extract the embedding from the response
        const embedding: number[] = response.data.embedding;

        // Return the generated embedding
        return embedding;
    } catch (error) {
        // Log the error to the console
        console.error('Embedding generation failed:', error);
        // Throw an error to propagate the failure
        throw new Error('Failed to generate embedding');
    }
}

