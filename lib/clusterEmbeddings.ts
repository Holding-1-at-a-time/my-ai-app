// /lib/clusterEmbeddings.ts
import kmeans from 'ml-kmeans';

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
    if (embeddings.length < k) {
        throw new Error("Number of clusters cannot exceed number of samples");
    }
    const result = kmeans(embeddings, k);
    return {
        clusters: result.clusters,
        centroids: result.centroids,
    };
}
