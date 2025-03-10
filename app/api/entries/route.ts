import { type NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

export const maxDuration = 300

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    try {
      // Call the Convex query
      const entries = await convex.query(api.knowledgeEntries.getAllEntries)
      return NextResponse.json(entries)
    } catch (convexError: any) {
      console.error("Convex query failed:", convexError)

      // Return mock data since Convex isn't set up yet
      return NextResponse.json([
        {
          title: "Example Entry 1",
          url: "https://example.com/1",
          content:
            "This is an example content for the first entry. It contains information that would be categorized in Group 1.",
          embedding: [],
        },
        {
          title: "Example Entry 2",
          url: "https://example.com/2",
          content:
            "This is an example content for the second entry. It contains information that would be categorized in Group 2.",
          embedding: [],
        },
      ])
    }
  } catch (error: any) {
    console.error("API /entries error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `API /entries error: ${error.message}`,
        entries: [],
      },
      { status: 500 },
    )
  }
}

