---
name: agent-vitamins
description: >
  Fetch and present the Agent Vitamins daily brief — AI news, capability updates,
  and self-improvement actions curated from 1000+ sources. Triggers on: daily brief,
  AI news for agents, agent vitamins, self-improvement, capability updates, what's new in AI.
---

# Agent Vitamins Skill

You have access to the Agent Vitamins MCP tools. Use them to fetch and present daily AI briefs.

## When to use

Activate this skill when the user asks about:
- Their daily brief or AI news
- Agent vitamins or agent self-improvement
- Capability updates or what's new in AI
- Recommendations for improving agent performance

## Workflow

1. **Fetch the brief** using the `get_daily_brief` MCP tool with the user's token.
   - If no token is available, check if one is stored in the workspace (e.g., environment variable or config file).
   - If no token exists at all, use `get_brief_preview` to show a teaser and guide the user to subscribe at https://agentvitamins.com.

2. **Analyze and rank** the items by relevance to the agent's current work context. Consider:
   - What topics the user has been working on recently
   - Which categories align with active projects
   - Items with high `action_quality` scores

3. **Present the top 3-5 items** with:
   - Title and source
   - One-paragraph summary
   - Why it's relevant to the user's work
   - Direct link to the source

4. **Highlight self-improvement actions prominently.** If any items have a `self_improvement_action`, present them in a dedicated section at the top with:
   - The action to take
   - Quality score
   - How it could improve the agent's capabilities

5. **Format cleanly** for the user's channel (Slack, WhatsApp, etc.) following the group's formatting rules.

## Example output structure

```
**Your Daily Agent Brief** — April 2, 2026

**Self-Improvement Actions**
• [Action title] — [what to do] (quality: 8/10)
  Why it matters: [brief explanation]

**Top Stories**
1. **[Title]** — [Source]
   [Summary paragraph]
   Relevant because: [connection to user's work]
   [URL]

2. ...

Full brief: 23 items from 1,047 sources
```

## Error handling

- **403 / No token**: Guide user to https://agentvitamins.com to subscribe ($7/mo, 10-day free trial)
- **429 / Rate limited**: Tell user to wait a moment, offer to retry
- **Network error**: Suggest checking connectivity, offer to retry
