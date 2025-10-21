# 💬 langchain-discord-document-loader

LangChain.js integration for Discord — load chat logs as LangChain `Documents` for RAG, conversational memory, and agentic reasoning.

[![npm version](https://img.shields.io/npm/v/@developerjamey/langchain-discord.svg)](https://www.npmjs.com/package/@developerjamey/langchain-discord)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Features

- 💬 Load Discord chat logs from JSON or DataFrame-like arrays
- 🧠 Convert chat messages into LangChain `Document` objects
- 🤖 Ready-to-use for RAG, memory, and AI agent pipelines
- ⚙️ Lightweight and dependency-free
- 🔍 Flexible metadata preservation (timestamps, content, etc.)
- 📊 Customizable user ID column


## Installation

```bash
npm install @developerjamey/langchain-discord @langchain/core
```

## Quick Start

```typescript
import { DiscordChatLoader } from "@developerjamey/langchain-discord";

const chatLog = [
  { ID: "User123", content: "Hello there!", timestamp: "2025-10-19T10:00:00Z" },
  { ID: "User456", content: "Hey! How are you?", timestamp: "2025-10-19T10:01:00Z" },
];

const loader = new DiscordChatLoader(chatLog);
const docs = await loader.load();

console.log(docs[0]);
/*
{
  pageContent: "User123",
  metadata: { content: "Hello there!", timestamp: "2025-10-19T10:00:00Z" }
}
*/
```

## Usage
### 1. As a LangChain Document Loader
```typescript
import "dotenv/config";
import { DiscordChatLoader } from "@developerjamey/langchain-discord";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const chatLog = [
  { ID: "UserA", content: "What's up?", timestamp: "2025-10-19T10:00:00Z" },
  { ID: "UserB", content: "Working on LangChain!", timestamp: "2025-10-19T10:05:00Z" },
];

const loader = new DiscordChatLoader(chatLog);
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 50,
});
const splitDocs = await splitter.splitDocuments(docs);

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  apiKey: process.env.OPENAI_API_KEY,
});

const vectorStore = await Chroma.fromDocuments(
  splitDocs,
  embeddings,
  {
    collectionName: "discord_chat_collection",
    url: "http://localhost:8000",
  }
);

const result = await vectorStore.similaritySearch("LangChain", 2);
console.log("🔍 Similarity Search Results:");
for (const r of result) {
  console.log(`→ Content: ${r.pageContent}`);
  console.log(`  Metadata:`, r.metadata);
}
```

### 2. With a Custom User ID Column
```typescript
const chatLog = [
  { user_id: "JohnDoe", text: "Good morning!", time: "2025-10-19T09:00:00Z" },
  { user_id: "JaneDoe", text: "Morning!", time: "2025-10-19T09:01:00Z" },
];

const loader = new DiscordChatLoader(chatLog, "user_id");
const docs = await loader.load();
```
## Configuration Options
| Option      | Type                    | Default  | Description                                  |
| ----------- | ----------------------- | -------- | -------------------------------------------- |
| `chatLog`   | `Record<string, any>[]` | Required | Array of Discord chat messages               |
| `userIdCol` | `string`                | `"ID"`   | Key used for the user ID column              |
| `metadata`  | `Record<string, any>`   | auto     | Remaining fields stored as document metadata |

## API
DiscordChatLoader(chatLog, userIdCol?)

Create a loader for transforming Discord chat logs into LangChain Documents.

#### Methods
- load() → Promise<Document[]> Loads and converts chat logs into structured LangChain Documents.

## Development
```bash
# Install dependencies
npm install

# Build package
npm run build

# Run tests
npm test

# Lint & format
npm run lint
npm run format
```
## License

MIT

## Resources

- [LangChain.js](https://js.langchain.com/)