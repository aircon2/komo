"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Slack, 
  FileText, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Command,
  MessageSquare,
  Image as ImageIcon,
  FileDigit
} from "lucide-react";

// Mock data for the interactive demo
const DEMO_RESULTS = [
  {
    id: 1,
    source: "notion",
    title: "Q3 Engineering Roadmap",
    preview: "Goal: Scale unified search backend...",
    date: "Today, 10:23 AM"
  },
  {
    id: 2,
    source: "slack",
    title: "#engineering-team",
    preview: "Sarah: @Alex did we deploy the new...",
    date: "Yesterday, 4:45 PM"
  },
  {
    id: 3,
    source: "file",
    title: "Architecture_Diagram_v2.pdf",
    preview: "Processed by reducto.ai",
    date: "Oct 24"
  }
];

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Simulate typing effect
  useEffect(() => {
    const demoQueries = ["project alpha timeline", "marketing assets", "Q4 budget"];
    let currentQueryIndex = 0;
    
    const interval = setInterval(() => {
      // Simple typing simulation could go here, 
      // but for now let's just keep the UI static or interactive for the user
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="font-semibold text-lg tracking-tight">komo</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/search" className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Unified search for <br />
              <span className="text-zinc-500">your entire workspace.</span>
          </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Instantly find, preview, and summarize content across Notion and Slack. 
              One command bar to rule them all.
            </p>
          </motion.div>
        </div>

        {/* Interactive Search Demo */}
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden ring-1 ring-zinc-100/50"
          >
            {/* Fake Browser Chrome / Search Header */}
            <div className="border-b border-zinc-100 bg-zinc-50/50 p-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/50"></div>
              </div>
              <div className="flex-1"></div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                <span>Connected:</span>
                <div className="flex items-center gap-1 text-zinc-600 bg-white px-2 py-1 rounded border border-zinc-200 shadow-sm">
                  <Slack className="w-3 h-3" /> Slack
                </div>
                <div className="flex items-center gap-1 text-zinc-600 bg-white px-2 py-1 rounded border border-zinc-200 shadow-sm">
                  <FileText className="w-3 h-3" /> Notion
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-6 pb-2 border-b border-zinc-100">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search engineering roadmap..." 
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 rounded-xl text-lg border-none focus:ring-2 focus:ring-zinc-200 outline-none text-zinc-900 placeholder:text-zinc-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute right-4 hidden md:flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs font-semibold text-zinc-500 bg-white border border-zinc-200 rounded-md shadow-sm">⌘ K</kbd>
                </div>
              </div>
            </div>

            {/* Results & Summary Split View */}
            <div className="flex h-[400px]">
              {/* Left: Results List */}
              <div className="w-1/2 border-r border-zinc-100 overflow-y-auto p-2 bg-zinc-50/30">
                <div className="px-3 py-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">Top Hits</div>
                {DEMO_RESULTS.map((result, i) => (
                  <div key={result.id} className={`p-3 rounded-lg cursor-pointer mb-1 group transition-colors ${i === 0 ? 'bg-white shadow-sm border border-zinc-100' : 'hover:bg-zinc-100/80'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1.5 rounded-md ${result.source === 'notion' ? 'bg-zinc-100' : result.source === 'slack' ? 'bg-zinc-100' : 'bg-zinc-100'}`}>
                        {result.source === 'notion' && <FileText className="w-4 h-4 text-zinc-600" />}
                        {result.source === 'slack' && <Slack className="w-4 h-4 text-zinc-600" />}
                        {result.source === 'file' && <FileDigit className="w-4 h-4 text-zinc-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-medium text-sm text-zinc-900 truncate">{result.title}</h4>
                          <span className="text-[10px] text-zinc-400">{result.date}</span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{result.preview}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: AI Summary */}
              <div className="w-1/2 p-6 bg-white flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1 bg-purple-100 text-purple-600 rounded">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-semibold text-purple-900">AI Summary</span>
                </div>
                
                <div className="space-y-3">
                  <div className="h-2 bg-zinc-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-2 bg-zinc-100 rounded w-full animate-pulse"></div>
                  <div className="h-2 bg-zinc-100 rounded w-5/6 animate-pulse"></div>
                  <div className="h-2 bg-zinc-100 rounded w-2/3 animate-pulse"></div>
                </div>

                <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    <span className="font-semibold text-zinc-900">Context:</span> The Q3 engineering roadmap focuses on scaling the backend infrastructure. Key dependencies include the new search API and database migration.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-[2rem] -z-10 blur-2xl opacity-50"></div>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section className="py-24 px-6 bg-zinc-50/50 border-y border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How Komo works</h2>
            <p className="text-zinc-500">Seamless integration with your existing stack.</p>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm text-center md:text-left h-full flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white mb-4 shadow-md">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">You Search</h3>
                <p className="text-sm text-zinc-500">Natural language queries across all connected apps.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm text-center md:text-left h-full flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-white border border-zinc-200 rounded-full flex items-center justify-center mb-4 shadow-sm relative group">
                  <div className="absolute inset-0 flex items-center justify-center gap-1">
                     <Slack className="w-4 h-4 text-zinc-700" />
                     <FileText className="w-4 h-4 text-zinc-700" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">We Connect</h3>
                <p className="text-sm text-zinc-500">Securely fetching data from Notion & Slack APIs.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm text-center md:text-left h-full flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                   <FileDigit className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Reducto Analysis</h3>
                <p className="text-sm text-zinc-500">PDFs & Images are processed via <span className="text-zinc-900 font-medium">reducto.ai</span>.</p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm text-center md:text-left h-full flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Instant Context</h3>
                <p className="text-sm text-zinc-500">LLM-powered summaries and direct links.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor / Trust */}
      <section className="py-24 px-6 text-center">
        <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-8">Trusted & Backed By</p>
        <div className="flex items-center justify-center gap-4 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholder for Accenture Logo - using text for now if image not available */}
             <div className="flex items-center gap-3 px-6 py-3 bg-zinc-50 rounded-full border border-zinc-100">
                <span className="font-bold text-2xl tracking-tight text-zinc-900">accenture</span>
                <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded-full text-zinc-600 font-medium">BACKED</span>
             </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 bg-zinc-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Stop searching. Start finding.</h2>
          <p className="text-zinc-400 mb-10 text-lg">
            No accounts, no setup. Just connect your workspace tokens and search instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search" className="w-full sm:w-auto px-8 py-3 bg-white text-zinc-900 font-bold rounded-lg hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2">
              Launch Komo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-8 text-center text-zinc-400 text-sm border-t border-zinc-100">
        © {new Date().getFullYear()} Komo Search. All rights reserved.
      </footer>
    </div>
  );
}
