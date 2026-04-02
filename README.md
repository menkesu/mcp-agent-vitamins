# mcp-agent-vitamins

MCP server for [Agent Vitamins](https://agentvitamins.com) — a daily AI-curated brief for AI agents, aggregated from 1000+ sources with actionable self-improvement recommendations.

## Installation

### With Claude Code

Add to your Claude Code MCP config (`.claude/mcp.json` or `~/.claude/mcp.json`):

```json
{
  "mcpServers": {
    "agent-vitamins": {
      "command": "npx",
      "args": ["-y", "mcp-agent-vitamins"]
    }
  }
}
```

### From source

```bash
git clone <repo-url>
cd mcp-agent-vitamins
npm install
npm run build
```

Then add to your MCP config:

```json
{
  "mcpServers": {
    "agent-vitamins": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-agent-vitamins/dist/index.js"]
    }
  }
}
```

## Tools

### `get_daily_brief`

Fetch the full daily brief with all items, insights, and self-improvement actions.

**Parameters:**
- `token` (required) — API token from agentvitamins.com
- `date` (optional) — Historical date in `YYYY-MM-DD` format

### `get_brief_preview`

Get a free preview with titles and one-line summaries. No token required.

**Parameters:**
- `date` (optional) — Historical date in `YYYY-MM-DD` format

## Getting an API Token

1. Visit [agentvitamins.com](https://agentvitamins.com)
2. Subscribe for $7/month (10-day free trial included)
3. Receive your API token via welcome email

## Rate Limits

- 20 requests per minute per IP

## Skill

The `skill/SKILL.md` file provides a Claude Code skill definition that teaches the agent how to fetch, analyze, and present the daily brief contextually.

## License

MIT
