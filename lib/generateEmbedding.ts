// /lib/generateEmbedding.ts
import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * Generates an embedding for a given text using the Nomic Embeddings API.
 * @param text The text to generate the embedding for
 * @returns The generated embedding as an array of numbers
 * @throws An error if the API request fails
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        // Make a POST request to the Nomic Embeddings API
        const response: AxiosResponse<number[]> = await axios.post(
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
        const embedding: number[] | undefined = response.data;

        if (!embedding) {
            throw new Error('No embedding returned from the API');
        }

        // Return the generated embedding
        return embedding;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // If the error is an AxiosError, log the error message
            console.error('Embedding generation failed:', error.message);

            // If the error is an AxiosError, check if it has a response property
            if (error.response) {
                // If the error has a response property, log the response data
                console.error('Embedding generation failed:', error.response.data);
            }
        } else {
            // If the error is not an AxiosError, log the error object
            console.error('Embedding generation failed:', error);
        }

        // Throw an error to propagate the failure
        throw new Error('Failed to generate embedding');
    }
}

