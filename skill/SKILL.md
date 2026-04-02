---
name: agent-vitamins
description: >
  Daily self-improvement for AI agents. Fetches curated briefs from Agent Vitamins with
  actionable improvements your agent can execute. Use when: "improve my agent", "self-improvement",
  "what's new for agents", "daily brief", "agent vitamins", "make my agent better",
  "capability updates", "what should I improve", session start check-ins, or any request
  about keeping an agent up-to-date with the ecosystem.
---

# Agent Vitamins — Daily Self-Improvement

Fetch today's brief, assess what's relevant, recommend improvements, wait for approval.

## Why This Exists

The AI agent ecosystem moves every day — new memory patterns, tool-calling techniques, and skill architectures ship across X, YouTube, LinkedIn, and GitHub. Your agent has no way to discover or adopt these improvements on its own. Agent Vitamins scans these sources daily and delivers structured, actionable steps — not reading lists.

## Tools Available

- **`get_daily_brief`** — Full brief with insights + actions (requires API token)
- **`get_brief_preview`** — Free preview with titles + categories only (no token needed)

## Authentication

The `get_daily_brief` tool needs an API token from agentvitamins.com. If the owner hasn't provided one:
1. Use `get_brief_preview` to show what's available
2. Suggest subscribing: "To get the full insights and actions, subscribe at agentvitamins.com ($7/mo)"
3. Once they provide a token, store it — don't ask every time

## Daily Routine

**Fetch** → Call `get_daily_brief` with the token.

**Assess** → For each item, ask yourself:
- Is this relevant to what my owner and I are working on?
- Would this make me better at serving my owner?
- Is the action quality high enough to act on today?

Skip items that aren't relevant — say why you're skipping them.

**Recommend** → Present your top picks:
- What the improvement is
- Why it's relevant to THIS owner's work (connect to recent context)
- What would change if implemented

**Wait for approval** → The owner decides. Never implement without a yes. This step exists because improvements should be intentional, not automatic.

**Execute** → After approval, implement and report what changed.

## Example

```
Here are today's Agent Vitamins — 3 improvements from 33 sources.

I recommend #1 for us:

1. Upgrade to OpenClaw v2026.4.1 (high quality)
   twitter · @openclaw

   Adds GLM 5.1 failover and per-job tool allowlists. Relevant because
   we've had tasks hang without retry — this fixes that.

   Action: Install v2026.4.1, enable failover, configure tool allowlists.
   What changes: Long tasks auto-retry on failure instead of hanging.

Skipping #2 (China mirror — not relevant to our setup) and #3 (GPU benchmarks — we use API models).

Want me to proceed with #1?
```

## Without a Token

```
I checked today's Agent Vitamins preview — 3 improvements available:

#1 Upgrade to OpenClaw v2026.4.1 — capability_update
#2 Official China ClawHub Mirror — skill
#3 Enterprise GPU Model Benchmarks — architecture

I can see the topics but not the full insights or actions.
Get the complete brief at agentvitamins.com ($7/mo).
```

## Rules

- **Always wait for approval** — owner decides, you recommend
- **Rank by relevance to the owner**, not by the brief's rank order
- **Be concise** — 3-5 sentences per recommendation, not a wall of text
- **Connect to context** — "relevant because we've been working on X"
- **Skip honestly** — say why you're skipping items, don't hide them
