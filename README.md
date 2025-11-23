# komo

**One-stop search across all your services** — declutter and find docs about related topics across different platforms in one organized workspace.

## 🎯 Overview

komo is a unified search hub that integrates multiple workspace platforms (Slack, Notion) into a single, intelligent search interface. Instead of jumping between apps and using multiple search bars, komo lets you search everything at once and get AI-powered summaries of your results.

Think of it as **cmd-f for your entire workspace** — but smarter.

## ✨ Features

### 🔍 Unified Search
- **Multi-platform search**: Search across Slack and Notion simultaneously
- **Real-time results**: See results as you type, with instant filtering
- **Smart highlighting**: Search keywords are automatically bolded in results
- **Toggle apps**: Choose which services to search (Slack, Notion, or both)

### 🤖 AI-Powered Summaries
- **Intelligent categorization**: Results are grouped by topic and context
- **Concise summaries**: Get 10-20 word summaries for each topic
- **Reference links**: Direct links to original sources
- **Multi-source insights**: Summaries combine information from all active apps

### 📱 Rich Content Display
- **Thread support**: View full Slack conversation threads with replies
- **Page previews**: See complete Notion page content with highlighted keywords
- **Quick access**: Cmd+Click or Cmd+Enter to open original sources in new tabs
- **Metadata display**: See channel names, authors, dates, and page titles

### ⚡ Performance Optimized
- **Cached searches**: Notion pages are cached locally to avoid API rate limits
- **In-memory caching**: Recent searches are cached for instant results
- **Word-based matching**: Intelligent search that matches individual words
- **Deduplication**: Automatic removal of duplicate results

## 🏗️ Architecture

### Backend (`unified-search/backend`)
- **Express.js** server with TypeScript
- **Slack API** integration for message and thread search
- **Notion API** integration with local SQLite caching
- **Google Gemini AI** for intelligent summarization
- **Rate limit protection**: Smart caching to prevent API throttling

### Frontend (`unified-search/frontend`)
- **Next.js 16** with React 19
- **Tailwind CSS v4** for styling
- **Real-time search**: Debounced queries with request cancellation
- **Split-view UI**: Search results on the left, summary and information on the right
- **Responsive design**: Beautiful, modern interface with smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.9.0
- npm or yarn
- Slack API token
- Notion API token
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aircon2/komo.git
   cd komo
   ```

2. **Backend Setup**
   ```bash
   cd unified-search/backend
   npm install
   ```

3. **Create `.env` file** in `unified-search/backend/`:
   ```env
   SLACK_ACCESS_TOKEN=your_slack_token_here
   NOTION_TOKEN=your_notion_token_here
   GEMINI_API_KEY=your_gemini_key_here
   PORT=4000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Create `.env.local` file** in `unified-search/frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd unified-search/backend
   npm run dev
   ```
   Server will run on `http://localhost:4000`

2. **Start the frontend** (in a new terminal)
   ```bash
   cd unified-search/frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🎮 Usage

1. **Add Apps**: Click "new item" to add Slack and/or Notion to your search
2. **Search**: Type your query in the search bar — results appear in real-time
3. **View Results**: 
   - Left panel shows all matching results with highlighted keywords
   - Right panel shows AI-generated summary and detailed information
4. **Explore**: 
   - Click any result to see full content (Slack threads or Notion pages)
   - Cmd+Click or Cmd+Enter to open the original source in a new tab
5. **Toggle Apps**: Use the app chips to filter which services to search

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **@slack/web-api** - Slack integration
- **@notionhq/client** - Notion integration
- **@google/generative-ai** - Gemini AI for summarization
- **better-sqlite3** - Local caching for Notion pages
- **CORS** - Cross-origin support

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **TypeScript** - Type safety

## 📝 API Endpoints

- `GET /api/search?q={query}` - Unified search across all active apps
- `GET /api/summarize?q={query}&sources={slack,notion}` - AI-powered summary
- `POST /api/cache/build` - Manually rebuild Notion cache
- `POST /api/cache/clear` - Clear all cached pages

## 🎨 UI Features

- **Glowing button hints**: Visual cues guide users to add apps
- **Smooth animations**: Fade-in and slide transitions
- **Keyboard shortcuts**: Cmd+Enter to open links, arrow keys to navigate
- **Responsive layout**: Adapts to different screen sizes
- **Accessible design**: Built with Radix UI for screen reader support

## 🔒 Security Notes

⚠️ **For Development Only**: This project uses hardcoded API tokens in `.env` files for hackathon/demo purposes. For production:
- Implement OAuth flows for Slack and Notion
- Store tokens securely (e.g., encrypted database)
- Never commit `.env` files to version control

## 📚 Project Structure

```
komo/
├── unified-search/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/          # Environment configuration
│   │   │   ├── modules/
│   │   │   │   ├── slack/       # Slack API integration
│   │   │   │   └── notion/      # Notion API integration
│   │   │   ├── routes/          # API endpoints
│   │   │   ├── shared/          # Shared utilities and services
│   │   │   └── local/           # SQLite cache for Notion
│   │   └── .env                 # Backend environment variables
│   └── frontend/
│       ├── app/                 # Next.js app directory
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── hooks/           # Custom React hooks
│       │   └── utils/           # Utility functions
│       └── .env.local           # Frontend environment variables
└── README.md
```

## 🎯 Hackathon Notes

Built for **HackWestern** (sponsored by Accenture) with a focus on:
- **Speed**: Caching strategies to avoid API rate limits
- **UI-first**: Beautiful, intuitive interface
- **Smart defaults**: Pre-configured for quick demo
- **Performance**: In-memory caching and optimized queries

## 🤝 Contributing

This is a hackathon project. For improvements or bug fixes, please open an issue or submit a pull request.

## 📄 License

ISC

---

**Built with ❤️ for organized workspaces**
