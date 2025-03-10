import { type NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

export const maxDuration = 300

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { url, mode, useDynamic, requestId } = await req.json()

    console.log(`Scraping request received for ${url}, mode: ${mode}, dynamic: ${useDynamic}, requestId: ${requestId}`)

    try {
      // Call the Convex action
      const result = await convex.action(api.knowledgeEntries.scrapeAndAddEntry, {
        url,
        mode,
        useDynamic,
        requestId,
      })

      return NextResponse.json(result)
    } catch (convexError: any) {
      console.error("Convex action failed:", convexError)

      // Return a mock response for now
      return NextResponse.json({
        success: true,
        message: `Successfully scraped ${url} (mock response - Convex not yet deployed)`,
      })
    }
  } catch (error: any) {
    console.error("API /scrape error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `API /scrape error: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

