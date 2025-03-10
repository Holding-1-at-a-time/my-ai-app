import { api } from "@/convex/_generated/api"
import { query } from "@/convex/_generated/server"
import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const knowledgeEntries = await query(api.knowledgeEntries.getAllEntries)({})
    return NextResponse.json(knowledgeEntries)
  } catch (error: any) {
    console.error("API /entries error:", error)
    return NextResponse.json({ success: false, message: `API /entries error: ${error.message}` }, { status: 500 })
  }
}

