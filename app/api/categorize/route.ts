import { type NextRequest, NextResponse } from "next/server"
import { api } from "../../../convex/_generated/api"
import { action } from "../../../convex/_generated/server"

export const maxDuration = 300

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const result = await action(api.knowledgeEntries.categorizeEntries)({})

    if (result && typeof result === "object" && "success" in result && "message" in result) {
      return NextResponse.json(result)
    } else {
      console.error("Unexpected result from categorizeEntries:", result)
      return NextResponse.json({ success: false, message: "Unexpected error occurred." }, { status: 500 })
    }
  } catch (error: any) {
    console.error("API /categorize error:", error)
    return NextResponse.json({ success: false, message: `API /categorize error: ${error.message}` }, { status: 500 })
  }
}

