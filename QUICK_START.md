# 🚀 Wiki.js MCP Server Quick Start

## From Zero to Full Cursor Integration in 5 Minutes

### 1. Installation (2 minutes)

```bash
git clone https://github.com/heAdz0r/wikijs-mcp-server.git
cd wikijs-mcp-server
npm run setup
```

### 2. Configuration (2 minutes)

**Edit the `.env` file:**

```bash
nano .env
```

**Replace placeholders with real values:**

```env
PORT=3200
WIKIJS_BASE_URL=http://your-wiki.example.com
WIKIJS_TOKEN=your_real_wiki_js_api_token
```

**Edit the `.cursor/mcp.json` file:**

```bash
nano .cursor/mcp.json
```

**Replace token with real one:**

```json
{
  "mcpServers": {
    "wikijs": {
      "transport": "http",
      "url": "http://localhost:3200/mcp",
      "events": "http://localhost:3200/mcp/events",
      "cwd": ".",
      "env": {
        "WIKIJS_BASE_URL": "http://your-wiki.example.com",
        "WIKIJS_TOKEN": "your_real_wiki_js_api_token"
      }
    }
  }
}
```

### 3. Launch and Testing (1 minute)

```bash
# Start HTTP server
npm start

# In another terminal - test
npm test
```

### 4. Cursor Integration

1. **Restart Cursor**
2. **Check tool availability** - these should appear in Cursor:
   - `mcp_wikijs_list_pages()`
   - `mcp_wikijs_search_pages()`
   - `mcp_wikijs_get_page()`
   - And others...

### 5. First Usage

**Try in Cursor chat:**

```
Show me a list of pages from Wiki.js
```

```
Find all pages related to "documentation"
```

```
Create a new page "Test Page" with content "This is a test"
```

### 5. Test New Features (1 minute)

Try the new unpublished pages management:

```bash
# In Cursor, try these MCP commands:
# - List all pages including unpublished
# - Search in unpublished pages only
# - Check page publication status
# - Force delete pages (works with unpublished)
# - Publish unpublished pages
```

**Example in Cursor:**

```
@wikijs get me all unpublished pages
@wikijs check status of page ID 123
@wikijs publish page ID 123
```

## ⚡ If Something Doesn't Work

### Issue: Cursor doesn't see tools

**Solution:**

1. Make sure HTTP server is running (`npm start`)
2. Check `.cursor/mcp.json` - token must be real
3. Restart Cursor

### Issue: Wiki.js connection errors

**Solution:**

1. Check `WIKIJS_BASE_URL` in `.env`
2. Make sure API token is valid
3. Verify Wiki.js accessibility

### Issue: Server won't start

**Solution:**

```bash
# Check Node.js version (should be ≥18)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Support

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issue](https://github.com/heAdz0r/wikijs-mcp-server/issues)
- 💬 [Discussions](https://github.com/heAdz0r/wikijs-mcp-server/discussions)

---

**🎉 Done! You now have full Wiki.js integration with Cursor via MCP!**
