# Wiki.js MCP Server - Source Code

This directory contains the TypeScript source code for the Wiki.js MCP (Model Context Protocol) server.

## 📁 Directory Structure

```
src/
├── server.ts      # Main HTTP server with MCP protocol support
├── tools.ts       # MCP tool definitions and implementations
├── api.ts         # Wiki.js GraphQL API client
├── types.ts       # TypeScript type definitions
└── schemas.ts     # Zod validation schemas
```

## 📄 File Descriptions

### server.ts

**Purpose:** Main HTTP server implementation with MCP protocol support

**Key Features:**

- Express.js HTTP server setup
- MCP JSON-RPC 2.0 protocol implementation
- Server-Sent Events (SSE) for real-time communication
- Health check endpoints
- CORS configuration for cross-origin requests
- Tool registry and execution handling

**Main Components:**

- `startServer()` - Server initialization and configuration
- MCP protocol handlers for tool listing and execution
- HTTP endpoints for `/tools`, `/health`, and `/mcp`
- Error handling and logging

### tools.ts

**Purpose:** Definition and implementation of all MCP tools for Wiki.js interaction

**Tool Categories:**

#### 📄 Page Management Tools

- `get_page` - Retrieve page information by ID
- `get_page_content` - Get page content by ID
- `list_pages` - List pages with sorting options
- `search_pages` - Search pages by query with multi-method approach
- `create_page` - Create new pages
- `update_page` - Update existing pages
- `delete_page` - Delete pages
- `list_all_pages` - List all pages including unpublished
- `search_unpublished_pages` - Search specifically in unpublished pages
- `force_delete_page` - Enhanced deletion for unpublished pages
- `get_page_status` - Check page publication status
- `publish_page` - Publish unpublished pages

#### 👥 User Management Tools

- `list_users` - List all users
- `search_users` - Search users by query
- `create_user` - Create new users
- `update_user` - Update user information

#### 🔗 Group Management Tools

- `list_groups` - List user groups

**Key Features:**

- Input validation using Zod schemas
- Comprehensive error handling
- Multi-method search implementation (GraphQL + HTTP fallback)
- HTML content extraction and processing
- Automatic URL generation for pages

### api.ts

**Purpose:** Wiki.js GraphQL API client implementation

**Key Components:**

- `WikiJsApi` class - Main API client
- GraphQL query and mutation definitions
- HTTP client for content retrieval
- Authentication handling
- Error management and retry logic

**Main Methods:**

- `getPage(id)` - Get page by ID
- `getPageContent(id)` - Get page content
- `listPages(options)` - List pages with filters
- `searchPages(query, limit)` - Multi-method page search
- `createPage(data)` - Create new page
- `updatePage(id, content)` - Update page content
- `deletePage(id)` - Delete page
- `listAllPages(options)` - List all pages including unpublished
- `searchUnpublishedPages(query, limit)` - Search unpublished pages
- `forceDeletePage(id)` - Force delete with enhanced permissions
- `getPageStatus(id)` - Get publication status
- `publishPage(id)` - Publish unpublished page
- User management methods (`listUsers`, `createUser`, etc.)
- Group management methods (`listGroups`)

**Technical Features:**

- GraphQL request handling with `graphql-request`
- HTML content extraction using regex patterns
- Multi-stage search implementation
- Fallback mechanisms for limited API permissions
- URL construction and validation

### types.ts

**Purpose:** TypeScript type definitions for the entire application

**Type Categories:**

#### MCP Protocol Types

- `MCPRequest` - MCP JSON-RPC request structure
- `MCPResponse` - MCP JSON-RPC response structure
- `MCPError` - Error response format
- `Tool` - Tool definition structure

#### Wiki.js API Types

- `WikiPage` - Page data structure
- `WikiUser` - User data structure
- `WikiGroup` - Group data structure
- `PageSearchResult` - Search result format
- `PageCreateData` - Page creation parameters
- `UserCreateData` - User creation parameters

#### Configuration Types

- `ServerConfig` - Server configuration options
- `ApiConfig` - API client configuration

**Key Features:**

- Strict typing for all API interactions
- Optional and required field specifications
- Union types for flexible data handling
- Generic types for reusable structures

### schemas.ts

**Purpose:** Zod validation schemas for input validation and type safety

**Schema Categories:**

#### Page Schemas

- `pageIdSchema` - Page ID validation
- `pageCreateSchema` - Page creation data validation
- `pageUpdateSchema` - Page update data validation
- `pageSearchSchema` - Search parameters validation
- `pageListSchema` - List parameters validation

#### User Schemas

- `userCreateSchema` - User creation data validation
- `userUpdateSchema` - User update data validation
- `userSearchSchema` - User search parameters validation

#### General Schemas

- `paginationSchema` - Pagination parameters
- `orderBySchema` - Sorting options

**Key Features:**

- Runtime type validation
- Custom error messages
- Optional field handling with defaults
- Complex validation rules (email format, password requirements, etc.)
- Type inference for TypeScript integration

## 🔧 Development Guidelines

### Adding New Tools

1. **Define the tool in `tools.ts`:**

   ```typescript
   export const myNewTool: Tool = {
     name: "my_new_tool",
     description: "Description of what the tool does",
     inputSchema: myNewToolSchema,
   };
   ```

2. **Add validation schema in `schemas.ts`:**

   ```typescript
   export const myNewToolSchema = z.object({
     param1: z.string(),
     param2: z.number().optional(),
   });
   ```

3. **Implement API method in `api.ts`:**

   ```typescript
   async myNewMethod(param1: string, param2?: number): Promise<Result> {
     // Implementation
   }
   ```

4. **Add to tool registry in `tools.ts`:**
   ```typescript
   case 'my_new_tool':
     return await api.myNewMethod(args.param1, args.param2);
   ```

### Error Handling

- Use try-catch blocks for all async operations
- Return structured error responses with meaningful messages
- Log errors for debugging purposes
- Validate inputs using Zod schemas before processing

### Code Style

- Use TypeScript strict mode
- Follow async/await patterns
- Use descriptive variable and function names
- Add JSDoc comments for public APIs (in Russian as per project requirements)
- Keep functions focused and single-purpose

## 🧪 Testing

The source code is tested through:

- Integration tests in `scripts/test_mcp.js`
- STDIN protocol tests in `scripts/test_mcp_stdin.js`
- Manual testing via Cursor IDE integration

## 🔄 Build Process

1. **TypeScript compilation:** `npm run build`
2. **Output location:** `dist/` directory
3. **Source maps:** Generated for debugging
4. **Type checking:** Strict TypeScript validation

## 📚 Dependencies

### Runtime Dependencies

- `express` - HTTP server framework
- `cors` - Cross-origin resource sharing
- `graphql-request` - GraphQL client
- `zod` - Runtime type validation
- `dotenv` - Environment variable loading
- `uuid` - Unique identifier generation

### Development Dependencies

- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `@types/express` - Express.js type definitions
- `ts-node` - TypeScript execution environment
- `nodemon` - Development file watcher

## 🚀 Deployment

The compiled JavaScript code in `dist/` directory is ready for production deployment. Key considerations:

- Environment variables must be properly configured
- Wiki.js API endpoint must be accessible
- Node.js ≥18.0.0 required
- Network connectivity for GraphQL API calls

## 🔒 Security Considerations

- API tokens are loaded from environment variables
- Input validation using Zod schemas
- CORS configuration for controlled access
- Error messages don't expose sensitive information
- GraphQL queries use parameterized inputs to prevent injection
