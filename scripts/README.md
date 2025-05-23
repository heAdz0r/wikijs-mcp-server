# Wiki.js MCP Server Scripts

This directory contains scripts for managing and configuring the Wiki.js MCP server.

## Setup

### setup.sh

**Purpose:** Initial project setup  
**Usage:** `./scripts/setup.sh`

Performs:

- Node.js version check (recommended ≥18)
- Dependency installation (`npm install`)
- `.env` file creation based on `example.env`
- TypeScript code compilation (`npm run build`)

### setup_cursor_mcp.sh

**Purpose:** Cursor IDE integration setup  
**Usage:** `./scripts/setup_cursor_mcp.sh`

Performs:

- Configuration reading from `.env` file
- `.cursor/mcp.json` file creation with correct settings
- Backup of existing configurations

## Server Launch

### start_http.sh

**Purpose:** Main HTTP MCP server launch (recommended)  
**Usage:** `./scripts/start_http.sh`  
**Default port:** 3200

This is the main working server version with support for:

- JSON-RPC 2.0 protocol for Cursor
- Direct tool calls via HTTP
- Server-Sent Events (SSE) for events
- Full Cursor MCP compatibility

### start_typescript.sh

**Purpose:** TypeScript version server launch  
**Usage:** `./scripts/start_typescript.sh`  
**Default port:** 8000

Launches compiled version from `dist/` directory. Automatically builds if files are not found.

## Testing

### test.sh

**Purpose:** MCP server testing  
**Usage:** `./scripts/test.sh`

Performs:

- HTTP server test (`scripts/test_mcp.js`)
- STDIN server test (`scripts/test_mcp_stdin.js`)

### test_mcp.js

**Purpose:** HTTP MCP server testing  
**Usage:** `node scripts/test_mcp.js`

Launches HTTP server and checks its functionality.

### test_mcp_stdin.js

**Purpose:** STDIN MCP server testing  
**Usage:** `node scripts/test_mcp_stdin.js`

Launches STDIN server and tests its functionality.

## Environment Variables

All scripts use unified configuration from `.env` file in project root:

```bash
# Port for MCP server
PORT=3200

# Base URL for Wiki.js (without /graphql)
WIKIJS_BASE_URL=http://localhost:3000

# Wiki.js API token
WIKIJS_TOKEN=your_wikijs_api_token_here
```

## Usage Features

1. **Unified configuration location:** All environment variables are set only in `.env` file
2. **Automatic defaults:** If variables are not set, safe defaults are used
3. **Dependency checks:** Scripts verify presence of required variables before launch
4. **Logging:** All servers save logs to corresponding files
5. **PID files:** Processes save their PIDs for management

## Recommended Usage Order

1. Run setup: `./scripts/setup.sh`
2. Edit `.env` file with your Wiki.js settings
3. Launch HTTP server: `./scripts/start_http.sh`
4. Configure Cursor: `./scripts/setup_cursor_mcp.sh`
5. Restart Cursor

## Troubleshooting

- **Server health check:** `curl http://localhost:3200/health`
- **View logs:** `tail -f fixed_server.log` or `tail -f server.log`
- **Stop servers:** `pkill -f "node fixed_mcp_http_server.js"`

## Compatibility

- **Node.js:** ≥18.0.0
- **Cursor IDE:** MCP support
- **Wiki.js:** Versions with GraphQL API
- **OS:** macOS, Linux, Windows (with WSL)
