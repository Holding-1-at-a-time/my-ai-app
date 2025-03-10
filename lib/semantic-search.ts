export async function semanticSearch(
  entries: { embedding: number[] }[],
  queryEmbedding: number[],
  similarityThreshold = 0.8,
): Promise<{ [groupName: string]: { embedding: number[] }[] }> {
  const cosineSimilarity = (a: number[], b: number[]): number => {
    const dotProduct = a.reduce((sum, a_i, i) => sum + a_i * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, a_i) => sum + a_i * a_i, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, b_i) => sum + b_i * b_i, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  const groupedEntries: { [groupName: string]: { embedding: number[] }[] } = {}
  let groupCounter = 1

  for (const entry of entries) {
    let assignedToGroup = false
    for (const groupName in groupedEntries) {
      const group = groupedEntries[groupName]
      if (group.length > 0) {
        const representativeEmbedding = group[0].embedding
        const similarity = cosineSimilarity(queryEmbedding, representativeEmbedding)
        if (similarity > similarityThreshold) {
          groupedEntries[groupName].push(entry)
          assignedToGroup = true
          break
        }
      }
    }

    if (!assignedToGroup) {
      groupedEntries[`Group ${groupCounter}`] = [entry]
      groupCounter++
    }
  }

  return groupedEntries
}

