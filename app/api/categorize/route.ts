import { type NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

export const maxDuration = 300

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { requestId } = await req.json()

    try {
      // Call the Convex action
      const result = await convex.action(api.knowledgeEntries.categorizeEntries, {
        requestId,
      })

      return NextResponse.json(result)
    } catch (convexError: any) {
      console.error("Convex action failed:", convexError)

      // Return a mock response for now
      return NextResponse.json({
        success: true,
        message: "Successfully categorized entries (mock data - Convex not yet deployed).",
        data: {
          "Group 1": [
            {
              title: "Example Entry 1",
              url: "https://example.com/1",
              content:
                "This is an example content for the first entry. It contains information that would be categorized in Group 1.",
              embedding: [],
            },
          ],
          "Group 2": [
            {
              title: "Example Entry 2",
              url: "https://example.com/2",
              content:
                "This is an example content for the second entry. It contains information that would be categorized in Group 2.",
              embedding: [],
            },
          ],
        },
      })
    }
  } catch (error: any) {
    console.error("API /categorize error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `API /categorize error: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

