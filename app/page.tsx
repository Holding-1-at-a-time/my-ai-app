"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { streamUI, useUIState } from "ai"
import { ollama } from "ollama-ai-provider"
import { useToast } from "@/hooks/use-toast"

const STREAM_PROMPT = "Review the following knowledge base entries and provide insights:"
const ENTRY_PROMPT = (title: string, content: string) => `Title: ${title}\nContent: ${content}\n`
const OLLAMA_MODEL = "llama3:2"

interface SemanticGroup {
  [groupName: string]: {
    title: string
    url: string
    content: string
    embedding: number[]
  }[]
}

const MODEL_PROMPT = (num: number) =>
  `Return only ${num} item description from the result JSON and do not return the code explanation`

export default function KnowledgeBase() {
  const [url, setUrl] = useState("")
  const [mode, setMode] = useState<"page" | "website">("page")
  const [useDynamic, setUseDynamic] = useState(false)
  const [knowledgeEntries, setKnowledgeEntries] = useState<any[]>([])
  const [categorizedResults, setCategorizedResults] = useState<SemanticGroup | null>(null)
  const [annotation, setAnnotation] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const { setUIState, ui } = useUIState()

  const handleScrape = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, mode, useDynamic }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
        fetchKnowledgeEntries()
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: result.message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCategorize = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.success && result.data) {
        setCategorizedResults(result.data as SemanticGroup)
        toast({
          title: "Success!",
          description: result.message,
        })
        generateAnnotations(result.data)
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: result.message,
        })
        setCategorizedResults(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchKnowledgeEntries = useCallback(async () => {
    try {
      const response = await fetch("/api/entries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const entries = await response.json()
      setKnowledgeEntries(entries)
    } catch (error: any) {
      console.error("Failed to fetch knowledge entries:", error.message)
    }
  }, [])

  const generateAnnotations = async (categorizedResults: SemanticGroup) => {
    let combinedEntries = ""
    let count = 0
    for (const groupName in categorizedResults) {
      const entries = categorizedResults[groupName]
      entries.forEach((entry) => {
        combinedEntries += ENTRY_PROMPT(entry.title, entry.content)
        count++
      })
    }

    try {
      const model = ollama(OLLAMA_MODEL)
      const annotationStream = streamUI(
        {
          model: model,
          prompt: `${STREAM_PROMPT}\n${combinedEntries}\n${MODEL_PROMPT(count)}`,
        },
        { setUIState },
      )
      const result = await annotationStream.text()
      setAnnotation(result)
    } catch (error: any) {
      console.error("Generating annotations failed:", error)
    }
  }

  React.useEffect(() => {
    fetchKnowledgeEntries()
  }, [fetchKnowledgeEntries])

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>AI Knowledge Base System</CardTitle>
          <CardDescription>Enter a URL to scrape content and categorize it.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleScrape} disabled={loading}>
              {loading ? "Loading..." : "Scrape"}
            </Button>
            <Button onClick={handleCategorize} disabled={loading}>
              Categorize
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mode">Scraping Mode</Label>
            <select
              id="mode"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={mode}
              onChange={(e) => setMode(e.target.value as "page" | "website")}
            >
              <option value="page">Single Page</option>
              <option value="website">Whole Website</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dynamic">Dynamic Scraping (Puppeteer)</Label>
            <Switch id="dynamic" checked={useDynamic} onCheckedChange={setUseDynamic} />
          </div>
        </CardContent>
      </Card>

      {annotation && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Knowledge Base Insights</CardTitle>
            <CardDescription>Real-time annotations from a language model.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle>Insights</AlertTitle>
              <AlertDescription>{annotation}</AlertDescription>
            </Alert>
            <div className="mt-4">
              {ui.thoughts && (
                <div className="mt-2">
                  <strong>AI's Thoughts:</strong>
                  <p>{ui.thoughts}</p>
                </div>
              )}
              {ui.actions && (
                <div className="mt-2">
                  <strong>AI's Proposed Actions:</strong>
                  <p>{ui.actions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {categorizedResults && (
        <Card>
          <CardHeader>
            <CardTitle>Categorized Knowledge Entries</CardTitle>
            <CardDescription>Semantic grouping of knowledge entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {Object.entries(categorizedResults).map(([groupName, entries]) => (
                <AccordionItem key={groupName} value={groupName}>
                  <AccordionTrigger>{groupName}</AccordionTrigger>
                  <AccordionContent>
                    <ul>
                      {entries.map((entry, index) => (
                        <li key={index} className="mb-2">
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {entry.title}
                          </a>
                          <p className="text-sm text-gray-500">{entry.content.substring(0, 100)}...</p>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

