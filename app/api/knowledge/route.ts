    // /app/api/knowledge/route.ts
import { NextResponse } from 'next/server';
import { convexFetch } from '../../../lib/convexclient';

// This endpoint could accept POST requests to add an entry and GET requests to search entries.
export async function POST(request: Request) {
  const data = await request.json();

  // data expected: { title: string, content: string }
  const response = await convexFetch("addEntry", data);
  return NextResponse.json({ success: true, entryId: response });
}

export async function GET(request: Request) {
  // On GET, you might implement vector search or just list available entries.
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");

  // Replace with a proper vector search call if available from Convex.
  const entries = await convexFetch("searchEntries", { searchQuery });
  return NextResponse.json({ entries });
}
