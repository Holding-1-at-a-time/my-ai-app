// /app/api/categorize/route.ts
import { NextResponse } from 'next/server';
import { convexFetch } from '../../../lib/convexclient';
import { clusterEmbeddings } from '../../../lib/clusterEmbeddings';

export async function POST(request: Request) {
    try {
        // Implement a Convex function to fetch all knowledge entries.
        const entries = await convexFetch("getAllEntries", {});

        // Extract embeddings from each entry.
        const embeddings = entries.map((entry: any) => entry.embedding) as number[][];

        // Decide how many clusters you want; for example, 3 clusters.
        const clusteringResult = clusterEmbeddings(embeddings, 3);

        // Optionally, update each entry with its assigned cluster.
        // (You may create another Convex mutation to update the entries.)

        return NextResponse.json({ success: true, clusters: clusteringResult });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
