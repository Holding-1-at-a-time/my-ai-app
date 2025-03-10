// /lib/clusterEmbeddings.ts
import { kmeans } from 'ml-kmeans';
import { ollama } from "ollama-ai-provider";
import { embedMany } from "ai";

/**
 * Represents the result of clustering embeddings.
 * @property clusters - An array of cluster indices, where each index refers to the assigned cluster of the embedding at that index.
 * @property centroids - The centroids of the clusters.
 */
export interface ClusterResult {
    clusters: number[];
    centroids: number[][];
}

/**
 * Groups embeddings using the k-means algorithm.
 * @param embeddings Array of embedding vectors.
 * @param k Number of desired clusters.
 * @returns The clustering result.
 * @throws Error if the number of clusters exceeds the number of samples.
 */
export function clusterEmbeddings(
    embeddings: number[][],
    k: number
): ClusterResult {
    console.log(`Clustering ${embeddings.length} embeddings into ${k} clusters`);
    try {
        if (embeddings.length < k) {
            throw new Error(
                "Number of clusters can't exceed number of samples"
            );
        }
        const result = kmeans(embeddings, k, {});
        console.log(`Clustered into ${k} clusters`);
        console.log(`Centroids: ${JSON.stringify(result.centroids)}`);
        return {
            clusters: result.clusters,
            centroids: result.centroids,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(
                `Failed to cluster embeddings: ${error.message}`
            );
        } else {
            throw error;
        }
    }
}

// Initialize the embedding model using Ollama
const embeddingModel = ollama.embedding('nomic-embed-text');

/**
 * Splits input text into chunks based on periods.
 * @param input The input text to split.
 * @returns An array of non-empty string chunks.
 */
const generateChunks = (input: string): string[] => {
    return input
        .trim()
        .split('.')
        .filter(i => i !== '');
};

/**
 * Generates embeddings for given text by splitting it into chunks.
 * @param value The input text to generate embeddings for.
 * @returns A promise that resolves to an array of objects containing content and its corresponding embedding.
 * @throws Error if embedding generation fails.
 */
export const generateEmbeddings = async (
    value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
    const chunks = generateChunks(value);
    try {
        const { embeddings } = await embedMany({
            model: embeddingModel,
            values: chunks,
        });
        return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Failed to generate embeddings: ${error.message}`);
        } else {
            console.error(`Failed to generate embeddings: ${error}`);
        }
        throw error;
    }
};
