# Prozorro MCP Server

A Model Context Protocol (MCP) server that provides AI models with seamless access to Ukrainian government procurement data from [Prozorro](https://prozorro.gov.ua/) - Ukraine's public procurement system.

**❗❗❗ Providing all the available features requires to have a proxy server and database, so right now MCP API is not available publicly. To get API URL and API token, please contact the author.**

## Features

- **🔍 Search Tenders**: Advanced search capabilities by EDRPOU code, legal name, or date ranges
- **⚡ Fast**: Direct API integration with Prozorro's public procurement database
- **🛠️ Easy Integration**: Simple setup with Claude Desktop and other MCP clients

## Available Tools

### `search_tenders`
Searches for government tenders based on various criteria (Right now data are available only for 2025 year).

**Parameters:**
- `EDRPOUCode` (string, optional): The unique identifier code of the organization (Ukrainian tax ID)
- `legalName` (string, optional): A substring to match against the organization's legal name
- `dateFrom` (string, optional): Start date for the search (ISO 8601 format, e.g., `2025-01-01`)
- `dateTo` (string, optional): End date for the search (ISO 8601 format, e.g., `2025-12-31`)
- `limit` (number, optional): Maximum number of records to return (default: 100, max: 1000)

**Returns:** Array of tender objects with detailed information including tender ID, title, organization details, dates, and procurement status.

## Installation

### Method 1: Install from npm (Recommended)
The easiest way to install the MCP server is via npm:

```bash
npm install -g prozorro-mcp-server
```

After installation, add to Claude Desktop configuration:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "prozorro": {
      "command": "prozorro-mcp-server",
      "env": {
        "PROZORRO_API_TOKEN": "your-api-token-here",
        "PROZORRO_SERVICE_URL": "mcp-api-url-here"
      }
    }
  }
}
```

Restart Claude Desktop and you're ready to use the server!

> **Note**: On Linux/macOS, if you encounter permission issues, you may need to use `sudo npm install -g prozorro-mcp-server` or configure npm to use a user directory.

### Method 2: Install from GitHub

1. **Install globally via npm from GitHub**:

```bash
npm install -g git+https://github.com/VladyslavMykhailyshyn/prozorro-mcp-server.git
```

2. **Add to Claude Desktop configuration**:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "prozorro": {
      "command": "prozorro-mcp-server",
      "env": {
        "PROZORRO_API_TOKEN": "your-api-token-here",
        "PROZORRO_SERVICE_URL": "mcp-api-url-here"
      }
    }
  }
}
```

3. **Restart Claude Desktop** - The server will be ready to use!

### Method 3: Local Development Installation

1. **Clone the repository**:

```bash
git clone https://github.com/VladyslavMykhailyshyn/prozorro-mcp-server.git
cd prozorro-mcp-server
```

2. **Install dependencies**:

```bash
npm install
```

3. **Build the project**:

```bash
npm run build
```

4. **Add to Claude Desktop configuration** (use absolute path):

```json
{
  "mcpServers": {
    "prozorro": {
      "command": "node",
      "args": ["/absolute/path/to/prozorro-mcp-server/build/index.js"],
      "env": {
        "PROZORRO_API_TOKEN": "your-api-token-here",
        "PROZORRO_SERVICE_URL": "https://prozorro.gov.ua"
      }
    }
  }
}
```

## Configuration

The server requires specific environment variables to function correctly. You can set these in the Claude Desktop configuration or in a `.env` file for local development.

| Variable | Description | Required | Example |
|----------|-------------|:--------:|---------|
| `PROZORRO_API_TOKEN` | Your Bearer token for the Prozorro API | Yes | `Bearer abc123...` |
| `PROZORRO_SERVICE_URL` | Base URL for the API | Yes | `https://mcp-service-url....` |

### Getting API Credentials

To obtain API credentials and URL for Prozorro:
1. Contact the author
2. Retrieve API token and URL
3. Use the token and URL in your configuration

## Common Usage Workflows

### Workflow 1: Search Tenders by Organization

```
1. Use search_tenders with EDRPOUCode to find all tenders from a specific organization
2. Review the returned tender details including dates, amounts, and status
3. Filter results by date range if needed
```

### Workflow 2: Find Recent Tenders

```
1. Use search_tenders with dateFrom and dateTo parameters
2. Optionally filter by organization name using legalName
3. Limit results for better performance
```

## Troubleshooting

### Server not appearing in Claude Desktop
1. Check that the path in `claude_desktop_config.json` is correct
2. Ensure you've built the project with `npm run build`
3. Verify that Node.js is installed (version 18 or higher required)
4. Restart Claude Desktop
5. Check Claude Desktop logs for errors

### API Request Failures
- Verify your `PROZORRO_API_TOKEN` is valid and not expired
- Check that `PROZORRO_SERVICE_URL` is correct
- The Prozorro API may have rate limits - consider adding delays between requests
- Network connectivity to prozorro.gov.ua is required
- Some tenders might be temporarily unavailable

### Authentication Errors
- Ensure your API token includes the `Bearer` prefix if required
- Check that your token has the necessary permissions
- Verify the token hasn't expired

## Development

### Project Structure
```
prozorro-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server entry point
│   ├── tenders.ts            # Tender search implementation
│   └── types.ts              # TypeScript type definitions
├── build/                    # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Running in Development Mode

```bash
# Watch mode - auto-rebuild on changes
npm run dev

# In another terminal
npm start
```

### Building for Production

```bash
npm run build
```

## API Information

This server uses the Prozorro public API to retrieve tender information. For more details about the Prozorro system and available data:

- **Prozorro Website**: https://prozorro.gov.ua/
- **API Documentation**: https://prozorro.gov.ua/api
- **Data Format**: JSON responses with detailed tender information

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For issues and questions, please use the [GitHub Issues](https://github.com/VladyslavMykhailyshyn/prozorro-mcp-server/issues) page.