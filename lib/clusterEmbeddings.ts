// /lib/clusterEmbeddings.ts
import { kmeans } from 'ml-kmeans';
import { ollama } from "ollama-ai-provider"
import { embedMany} from "ai"
import { openai } from '@ai-sdk/openai';

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
        const result = kmeans(embeddings, k);
        console.log(`Clustered into ${k} clusters`);
        console.log(`Centroids: ${JSON.stringify(result.centroids)}`);
        return {
            clusters: result.clusters, // each index refers to the assigned cluster of the embedding at that index
            centroids: result.centroids,
        };
    } catch (error) {
        console.error(`Failed to cluster embeddings: ${error.message}`);
        if (error instanceof Error) {
            // rethrow the error with a more informative message
            throw new Error(
                `Failed to cluster embeddings: ${error.message}`
            );
        }
        throw error;
    }
}

const embeddingModel = ollama.embedding('nomic-embed-text');

const generateChunks = (input: string): string[] => {
    return input
        .trim()
        .split('.')
        .filter(i => i !== '');
};

export const generateEmbeddings = async (
    value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
    const chunks = generateChunks(value);
    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: chunks,
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};