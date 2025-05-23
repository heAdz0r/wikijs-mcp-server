# Wiki.js MCP Server

![MCP](https://img.shields.io/badge/MCP-Compatible-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-%3E%3D18.0.0-brightgreen)

Model Context Protocol (MCP) server for Wiki.js integration via GraphQL API.

## 📖 Description

This project provides an MCP server for interacting with Wiki.js through GraphQL API. MCP (Model Context Protocol) is an open protocol developed by Anthropic that enables AI models to safely interact with external services and tools.

The server provides a unified interface for working with Wiki.js that can be used by various AI agents and tools supporting MCP.

## ✨ Features

### 📄 Page Management

- Get Wiki.js pages by ID
- Get page content
- Get list of pages with sorting
- Smart page search (by content, titles, and metadata)
- Create new pages
- Update existing pages
- Delete pages

### 👥 User Management

- Get list of users
- Search users
- Create new users
- Update user information

### 🔧 Group Management

- Get list of user groups
- Manage group membership

### 🌐 Transports

- **STDIO**: for editor integration (Cursor, VS Code)
- **HTTP**: for web integrations and API access

## 🚀 Quick Start

> **⚡ Want to start right now?** See [5-Minute Guide](./QUICK_START.md)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/heAdz0r/wikijs-mcp-server.git
cd wikijs-mcp-server
```

2. **Run automatic setup:**

```bash
npm run setup
```

This script will automatically:

- Install dependencies
- Create `.env` file based on `example.env`
- Build TypeScript code

### Configuration

3. **Edit the `.env` file** and specify your Wiki.js settings:

```env
# Port for HTTP MCP server
PORT=3200

# Base URL for Wiki.js (without /graphql)
WIKIJS_BASE_URL=http://localhost:3000

# Wiki.js API token
WIKIJS_TOKEN=your_wikijs_api_token_here
```

4. **Edit the `.cursor/mcp.json` file** and replace `your_wikijs_api_token_here` with your real token

> **How to get Wiki.js API token:**
>
> 1. Log into Wiki.js admin panel
> 2. Go to "API" section
> 3. Create a new API key with necessary permissions
> 4. Copy the token to `.env` AND to `.cursor/mcp.json`

## 📦 Running

### HTTP server (recommended)

```bash
# Main HTTP server with Cursor MCP support
npm start
# or
npm run start:http
```

### TypeScript version

```bash
npm run start:typescript
```

### STDIO mode (for direct editor integration)

```bash
npm run server:stdio
```

### Development mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

## 🔌 Editor Integration

### Cursor IDE

> **⚠️ IMPORTANT:** Without `.cursor/mcp.json` file, Cursor integration will NOT work!

#### Quick Setup

1. **Start HTTP server:**

```bash
npm start
```

2. **Automatic configuration setup:**

```bash
npm run setup:cursor
```

3. **Edit `.cursor/mcp.json`** and specify your real token:

```json
{
  "mcpServers": {
    "wikijs": {
      "transport": "http",
      "url": "http://localhost:3200/mcp",
      "events": "http://localhost:3200/mcp/events",
      "cwd": ".",
      "env": {
        "WIKIJS_BASE_URL": "http://localhost:3000",
        "WIKIJS_TOKEN": "your_real_wiki_js_token_here"
      }
    }
  }
}
```

#### Critical Parameters

- **`transport: "http"`** - mandatory HTTP transport
- **`url: "http://localhost:3200/mcp"`** - exact URL for JSON-RPC
- **`events: "http://localhost:3200/mcp/events"`** - URL for Server-Sent Events
- **`WIKIJS_TOKEN`** - real Wiki.js API token (not placeholder!)

#### Verification

After setup, tools with `mcp_wikijs_*` prefix should appear in Cursor:

- `mcp_wikijs_list_pages()`
- `mcp_wikijs_search_pages()`
- `mcp_wikijs_get_page()`
- And others...

### VS Code (with MCP extension)

Add to VS Code settings:

```json
{
  "mcp.servers": {
    "wikijs": {
      "command": "node",
      "args": ["mcp_wikijs_stdin.js"],
      "cwd": "/path/to/wikijs-mcp"
    }
  }
}
```

## 🛠 Development

### Project Structure

```
wikijs-mcp-server/
├── src/                    # TypeScript source code
│   ├── server.ts          # HTTP server
│   ├── tools.ts           # Tool definitions
│   ├── api.ts             # Wiki.js API client
│   ├── types.ts           # Data types
│   └── schemas.ts         # Zod validation schemas
├── scripts/               # Management scripts
│   ├── setup.sh          # Initial setup
│   ├── start_http.sh     # Start HTTP server
│   ├── start_typescript.sh # Start TypeScript version
│   ├── setup_cursor_mcp.sh # Cursor setup
│   ├── test.sh           # Run tests
│   ├── test_mcp.js       # Test HTTP server
│   ├── test_mcp_stdin.js # Test STDIN server
│   └── README.md         # Scripts documentation
├── .cursor/               # Cursor MCP configuration
│   └── mcp.json          # MCP configuration file (CRITICALLY IMPORTANT!)
├── dist/                  # Compiled TypeScript code
├── *.js                   # Main JS files
├── example.env            # Environment configuration example
├── package.json           # Project metadata
└── README.md             # Main documentation
```

> **🚨 CRITICALLY IMPORTANT:** `.cursor/mcp.json` file is required for Cursor integration!

### Available Scripts

#### Setup and Build

- `npm run setup` - Initial project setup
- `npm run build` - Build TypeScript project
- `npm run setup:cursor` - Setup Cursor integration

#### Running Servers

- `npm start` / `npm run start:http` - HTTP MCP server (port 3200)
- `npm run start:typescript` - TypeScript version of server (port 8000)
- `npm run server:stdio` - STDIO version for direct integration

#### Development and Testing

- `npm run dev` - Development mode with hot reload
- `npm run demo` - Capability demonstration
- `npm test` - Run tests
- `npm run client` - Run demo client
- `npm run http-client` - Run HTTP client

### API Endpoints (HTTP mode)

- `GET /tools` - List of available tools
- `GET /health` - Server health check
- `POST /mcp` - MCP JSON-RPC endpoint

### Usage Examples

```javascript
// Get list of pages
{
  "method": "list_pages",
  "params": {
    "limit": 10,
    "orderBy": "TITLE"
  }
}

// Create new page
{
  "method": "create_page",
  "params": {
    "title": "New Page",
    "content": "# Title\n\nContent...",
    "path": "folder/new-page"
  }
}
```

## 🐛 Troubleshooting

### Connection Issues

1. Ensure Wiki.js is running and accessible
2. Check WIKIJS_BASE_URL correctness
3. Verify API token is valid

### MCP Issues

1. Check Node.js version (requires >=18.0.0)
2. Ensure all dependencies are installed
3. Check server logs for errors

## 📚 Documentation

- [Scripts Documentation](./scripts/README.md) - description of all management scripts
- [Changelog](./CHANGELOG.md) - release and update log
- [License](./LICENSE) - project usage terms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Wiki.js](https://js.wiki/) - Official Wiki.js website
- [Model Context Protocol](https://spec.modelcontextprotocol.io/) - MCP specification
- [Anthropic](https://www.anthropic.com/) - MCP protocol developer
- [GraphQL](https://graphql.org/) - Query language for APIs

## ⭐ Support

If this project helped you, please give it a ⭐ on GitHub!

Have questions? Create an [Issue](https://github.com/heAdz0r/wikijs-mcp-server/issues) or refer to the documentation.

## 🆕 New Feature: Automatic URLs

### Search Stages

Search works in 4 stages:

1. **GraphQL API search** - fast search through indexed content
2. **Metadata search** - search in titles, paths, and page descriptions
3. **HTTP content search** - deep search in page content via HTTP
4. **Forced verification** - fallback search on known pages

### Usage Examples

#### Content Search

```json
{
  "method": "search_pages",
  "params": {
    "query": "ZELEBOBA",
    "limit": 5
  }
}
```

**Result:**

```json
[
  {
    "id": 103,
    "path": "test/test-page",
    "title": "Test Page",
    "description": "Test page to demonstrate Wiki.js API capabilities",
    "url": "http://localhost:8080/en/test/test-page"
  }
]
```

#### Title Search

```json
{
  "method": "search_pages",
  "params": {
    "query": "find me",
    "limit": 3
  }
}
```

**Result:**

```json
[
  {
    "id": 108,
    "path": "test/test-gemini-mcp",
    "title": "Test Gemini MCP Page (find me)",
    "url": "http://localhost:8080/en/test/test-gemini-mcp"
  }
]
```

### New Search Benefits

- ✅ **Finds pages even with limited API permissions** - uses HTTP fallback
- ✅ **Multi-level search** - combines multiple strategies
- ✅ **Content search** - finds text inside pages
- ✅ **Metadata search** - titles, paths, descriptions
- ✅ **Fallback methods** - guaranteed results for known pages
- ✅ **Correct URLs** - all results contain ready-to-use links

### Technical Details

#### HTML Content Processing

The system automatically extracts text from HTML using:

- Search in `<template slot="contents">` block
- HTML tags and entities cleanup
- Fallback to full page content

With limited GraphQL API permissions, the system:

- Switches to HTTP method for content retrieval
- Uses direct requests to HTML pages
- Preserves all page metadata
