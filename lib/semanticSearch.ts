// /lib/semanticSearch.ts

/**
 * Computes the cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    if (normA === 0 || normB === 0) return 0;
    return dot / (normA * normB);
}

/**
 * Groups entries whose embeddings are similar.
 *
 * @param embeddings - Array of embedding vectors.
 * @param entries - The corresponding knowledge entries.
 * @returns An object mapping group labels to arrays of entries.
 */
export function semanticSearch(
    embeddings: number[][],
    entries: any[]
): Record<string, any[]> {
    const groups: number[][] = [];
    const threshold = 0.80; // Adjust threshold as needed
    const used = new Array(embeddings.length).fill(false);

    // Simple grouping: for each ungrouped entry, create a new group or append
    // to an existing one if the cosine similarity exceeds the threshold.
    for (let i = 0; i < embeddings.length; i++) {
        if (used[i]) continue;
        const currentGroup = [i];
        used[i] = true;
        for (let j = i + 1; j < embeddings.length; j++) {
            if (used[j]) continue;
            const similarity = cosineSimilarity(embeddings[i], embeddings[j]);
            if (similarity >= threshold) {
                currentGroup.push(j);
                used[j] = true;
            }
        }
        groups.push(currentGroup);
    }

    const result: Record<string, any[]> = {};
    groups.forEach((group, idx) => {
        const groupKey = `Group ${idx + 1}`;
        result[groupKey] = group.map((i) => entries[i]);
    });
    return result;
}
