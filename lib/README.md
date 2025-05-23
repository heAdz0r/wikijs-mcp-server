# Wiki.js MCP Server - JavaScript Library

This directory contains compiled JavaScript files and standalone clients for the Wiki.js MCP server.

## 📁 File Descriptions

### Core Server Files

#### `fixed_mcp_http_server.js`

**Purpose:** Main HTTP MCP server (compiled from TypeScript)  
**Usage:** `node lib/fixed_mcp_http_server.js`  
**Description:** The primary HTTP server that implements the MCP protocol. This is the compiled version of the TypeScript source code with all necessary dependencies bundled.

#### `mcp_wikijs_stdin.js`

**Purpose:** STDIN MCP server for direct editor integration  
**Usage:** `node lib/mcp_wikijs_stdin.js`  
**Description:** Alternative server implementation that uses STDIN/STDOUT for communication. Primarily used for direct integration with editors like VS Code.

### Client Files

#### `mcp_client.js`

**Purpose:** Demo MCP client for testing  
**Usage:** `node lib/mcp_client.js`  
**Description:** Example client that demonstrates how to connect to and use the MCP server. Useful for testing server functionality and understanding the MCP protocol.

#### `mcp_http_client.js`

**Purpose:** HTTP-based MCP client  
**Usage:** `node lib/mcp_http_client.js`  
**Description:** HTTP client specifically designed to interact with the HTTP MCP server. Demonstrates HTTP-based MCP communication patterns.

### Utility Files

#### `mcp_wrapper.js`

**Purpose:** MCP protocol wrapper utilities  
**Usage:** Imported by other modules  
**Description:** Utility functions and wrappers for the MCP protocol. Provides common functionality used by both servers and clients.

## 🚀 Usage Examples

### Starting the HTTP Server

```bash
# Start the main HTTP server
node lib/fixed_mcp_http_server.js

# Or use the npm script
npm start
```

### Testing with Demo Client

```bash
# Connect to server and run tests
node lib/mcp_client.js
```

### STDIN Server for Editor Integration

```bash
# For VS Code or other editors
node lib/mcp_wikijs_stdin.js
```

## 🔄 Relationship to Source Code

These JavaScript files are either:

- **Compiled versions** of TypeScript source code from `src/` directory
- **Standalone implementations** that don't have TypeScript equivalents
- **Demo/test utilities** for development and debugging

The main server logic is implemented in TypeScript (`src/` directory) and compiled to `dist/` directory. The files in this `lib/` directory serve as:

- Alternative implementations
- Standalone demos
- Development utilities
- Legacy compatibility

## 📝 Development Notes

- These files are maintained separately from the main TypeScript codebase
- Updates to TypeScript source code may require manual updates to these files
- For production use, prefer the compiled TypeScript version in `dist/` directory
- These files are useful for quick testing and debugging without TypeScript compilation

## 🔧 Maintenance

When updating the project:

1. Check if changes in `src/` require updates to files in this directory
2. Test standalone clients after server updates
3. Update this README if new files are added or existing files change functionality
