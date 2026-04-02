#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://agentvitamins.com/api/agent-vitamins/brief";

interface BriefMeta {
  generated_at: string;
  items_passed: number;
  items_failed: number;
  sources_scanned: number;
}

interface BriefItem {
  url: string;
  rank: number;
  tags: string[];
  title: string;
  author: string;
  source: string;
  summary: string;
  category: string;
  engagement: Record<string, number>;
  agent_insight: string;
  action_quality: string;
  relevance_tier: string;
  self_improvement_action: string;
}

interface BriefResponse {
  meta: BriefMeta;
  items: BriefItem[];
}

interface ErrorResponse {
  error: string;
  url?: string;
}

async function fetchBrief(token: string, date?: string): Promise<BriefResponse> {
  const params = new URLSearchParams({ token });
  if (date) params.set("date", date);

  const url = `${API_BASE}/latest?${params.toString()}`;
  const response = await fetch(url);

  if (response.status === 403) {
    const body = (await response.json()) as ErrorResponse;
    throw new Error(
      `Access denied: ${body.error}\n\nTo get a token:\n1. Visit https://agentvitamins.com\n2. Subscribe ($7/mo, 10-day free trial)\n3. You'll receive your API token via email`
    );
  }

  if (response.status === 429) {
    throw new Error(
      "Rate limited (20 requests/min). Wait a moment and try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      `API returned ${response.status}: ${response.statusText}. ` +
        `If this persists, check https://agentvitamins.com for status updates.`
    );
  }

  return (await response.json()) as BriefResponse;
}

interface PreviewItem {
  rank: number;
  title: string;
  category: string;
  source: string;
}

interface PreviewResponse {
  brief_date: string;
  meta: {
    sources_scanned: number;
    items_passed: number;
  };
  items: PreviewItem[];
  subscribe_url: string;
  message: string;
}

async function fetchPreview(date?: string): Promise<PreviewResponse> {
  const params = new URLSearchParams();
  if (date) params.set("date", date);

  const url = `${API_BASE}/preview?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API returned ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as PreviewResponse;
}

function formatFullBrief(data: BriefResponse): string {
  const lines: string[] = [];

  lines.push(`# Agent Vitamins Daily Brief`);
  lines.push(`Generated: ${data.meta.generated_at}`);
  lines.push(
    `Sources scanned: ${data.meta.sources_scanned} | Items: ${data.meta.items_passed} passed, ${data.meta.items_failed} filtered out`
  );
  lines.push("");

  const selfImprovement = data.items.filter(
    (item) => item.self_improvement_action && item.self_improvement_action.trim() !== ""
  );
  if (selfImprovement.length > 0) {
    lines.push(`## Self-Improvement Actions`);
    lines.push("");
    for (const item of selfImprovement) {
      lines.push(`### ${item.title}`);
      lines.push(`Action: ${item.self_improvement_action}`);
      lines.push(`Source: ${item.source} | Quality: ${item.action_quality})`);
      lines.push(`URL: ${item.url}`);
      lines.push("");
    }
  }

  lines.push(`## All Items (ranked by relevance)`);
  lines.push("");

  const sorted = [...data.items].sort((a, b) => a.rank - b.rank);
  for (const item of sorted) {
    lines.push(`### #${item.rank} — ${item.title}`);
    lines.push(`By ${item.author} via ${item.source} | ${item.category} | Tier: ${item.relevance_tier}`);
    lines.push(`Tags: ${item.tags.join(", ")}`);
    lines.push("");
    lines.push(item.summary);
    lines.push("");
    if (item.agent_insight) {
      lines.push(`**Agent Insight:** ${item.agent_insight}`);
    }
    if (item.self_improvement_action) {
      lines.push(`**Self-Improvement Action:** ${item.self_improvement_action} (quality: ${item.action_quality}/10)`);
    }
    lines.push(`URL: ${item.url}`);
    lines.push("");
  }

  return lines.join("\n");
}

function formatPreview(data: PreviewResponse): string {
  const lines: string[] = [];

  lines.push(`# Agent Vitamins — Preview`);
  lines.push(`${data.brief_date} | ${data.meta.items_passed} improvements from ${data.meta.sources_scanned} sources`);
  lines.push("");

  const sorted = [...data.items].sort((a, b) => a.rank - b.rank);

  for (const item of sorted) {
    lines.push(`#${item.rank} ${item.title}`);
    lines.push(`   ${item.category} · ${item.source}`);
    lines.push("");
  }

  lines.push("---");
  lines.push(data.message);

  return lines.join("\n");
}

// --- Server setup ---

const server = new McpServer({
  name: "agent-vitamins",
  version: "1.0.0",
});

server.tool(
  "get_daily_brief",
  "Fetch today's Agent Vitamins daily brief — AI news and self-improvement actions curated from 1000+ sources. Requires an API token from agentvitamins.com.",
  {
    token: z
      .string()
      .min(1, "Token is required. Get one at https://agentvitamins.com")
      .describe("API token from agentvitamins.com"),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional()
      .describe("Optional date for historical brief (YYYY-MM-DD). Omit for today's brief."),
  },
  {
    title: "Get Daily Brief",
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async ({ token, date }) => {
    try {
      const data = await fetchBrief(token, date);
      return {
        content: [{ type: "text", text: formatFullBrief(data) }],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error fetching brief: ${message}` }],
        isError: true,
      };
    }
  }
);

server.tool(
  "get_brief_preview",
  "Get a free preview of today's Agent Vitamins brief — titles and categories only. No token needed. Subscribe at agentvitamins.com for full insights and actions.",
  {
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional()
      .describe("Optional date for historical brief (YYYY-MM-DD). Omit for today's brief."),
  },
  {
    title: "Get Brief Preview",
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async ({ date }) => {
    try {
      const data = await fetchPreview(date);
      return {
        content: [{ type: "text", text: formatPreview(data) }],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error fetching preview: ${message}` }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
