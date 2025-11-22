"use client"

import * as React from "react"
import { Search, Slack, FileText, Link as LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { searchSlack, searchNotion, SearchResult } from "@/api/search"
export default function SearchPage() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [sources, setSources] = React.useState({
    slack: false,
    notion: false,
    others: false,
  })

  const handleToggle = (source: keyof typeof sources) => {
    setSources((prev) => ({
      ...prev,
      [source]: !prev[source],
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      let allResults: SearchResult[] = []

      console.log("Starting search...", { query, sources })

      if (sources.slack) {
        const slackResults = await searchSlack(query)
        console.log("Raw Slack Results:", slackResults)
        allResults = [...allResults, ...slackResults]
      }

      if (sources.notion) {
        const notionResults = await searchNotion(query)
        console.log("Raw Notion Results:", notionResults)
        allResults = [...allResults, ...notionResults]
      }

      setResults(allResults)
    } catch (err: any) {
      console.error("Search failed:", err)
      setError(err.message || "Search failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center pt-[15vh] bg-background px-4 pb-10">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Title/Logo */}
        <div className="text-center mb-8">
           <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Komo Search</h1>
        </div>

        {/* Search Bar Container */}
        <form onSubmit={handleSearch} className="relative flex w-full items-center shadow-sm rounded-md">
           <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
           <Input 
             type="text"
             placeholder="Search..."
             className="h-14 w-full rounded-xl border-input bg-background pl-12 pr-4 text-lg shadow-sm focus-visible:ring-1 focus-visible:ring-ring transition-shadow"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             autoFocus
           />
           {isLoading && (
             <div className="absolute right-4 animate-spin h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full"></div>
           )}
        </form>

        {/* Toggles */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full items-center justify-center gap-4">
            <Toggle 
              pressed={sources.slack} 
              onPressedChange={() => handleToggle("slack")}
              variant="outline"
              className="h-10 w-32 rounded-lg border-input data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 data-[state=on]:border-zinc-300 transition-all shadow-sm hover:bg-zinc-50 gap-2"
            >
              <Slack className="w-4 h-4" /> Slack
            </Toggle>
            <Toggle 
              pressed={sources.notion} 
              onPressedChange={() => handleToggle("notion")}
              variant="outline"
              className="h-10 w-32 rounded-lg border-input data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 data-[state=on]:border-zinc-300 transition-all shadow-sm hover:bg-zinc-50 gap-2"
            >
              <FileText className="w-4 h-4" /> Notion
            </Toggle>
            <Toggle 
              pressed={sources.others} 
              onPressedChange={() => handleToggle("others")}
              variant="outline"
              className="h-10 w-32 rounded-lg border-input data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 data-[state=on]:border-zinc-300 transition-all shadow-sm hover:bg-zinc-50"
            >
              Others
            </Toggle>
          </div>

          {/* Token Input removed - using backend env */}
          {sources.slack && (
            <p className="text-[10px] text-zinc-400 text-center animate-in fade-in slide-in-from-top-1">
              Using configured Slack workspace
            </p>
          )}
          {sources.notion && (
            <p className="text-[10px] text-zinc-400 text-center animate-in fade-in slide-in-from-top-1">
              Using configured Notion workspace
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            Error: {error}
          </div>
        )}

        {/* Results Area */}
        <div className="w-full pt-8 space-y-4">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id} className="group p-4 rounded-xl border border-zinc-100 bg-white hover:bg-zinc-50/80 transition-all shadow-sm hover:shadow-md cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-zinc-100 rounded-lg text-zinc-600 group-hover:bg-white group-hover:shadow-sm transition-colors">
                    {result.source === "slack" ? <Slack className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-zinc-900 truncate pr-4">{result.title}</h3>
                      <span className="text-xs text-zinc-400 whitespace-nowrap">{new Date(result.metadata.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{result.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded border border-zinc-200">
                        {result.metadata.channel || "DM"}
                      </span>
                      {result.metadata.author && (
                         <span className="text-[10px] text-zinc-400">by {result.metadata.author}</span>
                      )}
                    </div>

                    {/* Thread Messages */}
                    {result.thread && result.thread.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-zinc-100 space-y-3">
                        {result.thread.map((msg, idx) => (
                           <div key={idx} className="relative group/msg">
                             <div className="flex items-start gap-2">
                               <div className="min-w-0">
                                 <div className="flex items-baseline gap-2">
                                   <span className="text-xs font-medium text-zinc-700">{msg.author}</span>
                                   <span className="text-[10px] text-zinc-400">{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                 </div>
                                 <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{msg.text}</p>
                               </div>
                             </div>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
             query && !isLoading && !error && (
               <div className="text-center text-zinc-400 py-12">
                 <p>No results found.</p>
               </div>
             )
          )}
        </div>
        
        {/* DEBUG: Raw Results Dump */}
        <div className="mt-8 p-4 bg-zinc-100 rounded-lg overflow-auto max-h-60 text-[10px] font-mono text-zinc-600 border border-zinc-200">
            <div className="font-bold mb-2">DEBUG: Raw API Response (Length: {results.length})</div>
            <pre>{JSON.stringify(results, null, 2)}</pre>
            <div className="mt-2 text-red-500">{error ? `Error: ${error}` : "No Error"}</div>
        </div>

      </div>
    </div>
  )
}
