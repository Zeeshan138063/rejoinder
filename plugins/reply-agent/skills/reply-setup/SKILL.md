---
name: reply-setup
description: One-time setup for the reply agent. Creates the user's config, knowledge base and Reply Queue page, learns their writing voice from their own chat messages, and schedules the hourly run. Use when the user says "/reply-setup", "set up my reply agent", "learn my voice", or wants to change working hours, VIPs or muted chats.
---

# Reply agent setup

Set up a personal reply agent: it watches `~~chat` during working hours, skips noise, and drafts replies in the user's voice into a Reply Queue page. It never sends anything. Run the steps in order, and keep each message to the user short and plain.

If `config.md` already exists in the agent folder, treat the request as a change: read it, ask only about what the user wants to change, update it, and stop.

## 1. Ask the basics

Ask with AskUserQuestion, at most four questions per call:

- Which chat tool: Microsoft Teams, Slack, or another.
- Which project tracker, if any: Jira, Linear, Asana, GitHub Issues, or none.
- Working hours, days and time zone (suggest the zone the session reports).
- Where to keep the agent folder: a folder on their computer (recommended, so they can read and edit the files) or the session workspace.

Then check the connectors. Search the connector registry for the chosen chat tool and tracker. If either isn't connected, suggest it and wait until it is. Confirm the chat connector works with one harmless read: the user's own profile, or their last few messages.

## 2. Learn who they work with

Read the last 14 days of their chat activity (messages they sent and messages sent to them, about 100–150 of each). Build:

- **People:** name, likely role, how often they interact, how they write to the user.
- **Chats:** each active conversation, its purpose, how noisy it is.
- **Projects and terms:** codenames, ticket prefixes and acronyms that come up.
- **Open items:** questions to the user with no reply in the same chat, and promises the user made ("I'll check", "will send by EOD").

Present the people and terms grouped by confidence. Ask only about what you couldn't tell, in one batch. Suggest VIPs (manager, skip-level, PM, client-facing people, HR) and noisy chats to mute, and let the user confirm.

## 3. Learn their voice

Analyse only messages the user wrote. Follow `references/voice-guide.md` and write `memory/voice.md`: rules by audience plus 20–30 real samples. Leave out any message that contains a password, token, key, payslip or personal data. Show the user a five-line summary of their style and ask whether it sounds right.

## 4. Write the files

Create the agent folder as laid out in `references/kb-layout.md`:

- `config.md`, filled in from `references/config-template.md`.
- `CLAUDE.md`, the short working memory.
- The `memory/` files from steps 2 and 3.
- `TASKS.md` with the open items, only the ones the user accepts.

## 5. Publish the Reply Queue

Load the `artifact-capabilities` skill first. Then publish `${CLAUDE_PLUGIN_ROOT}/assets/reply-queue.html` with the Artifact tool:

- title "Reply Queue", icon `inbox`
- `capabilities: {"db": {"rules": [{"path": "", "read": "admin", "write": "admin"}]}, "user": {}}`, so that only the owner and their editors can read the drafts.

Save the artifact URL in `config.md` as `queue_url`. Write `meta/run` with `{lastRunAt: <now minus 24h>}` through the `ArtifactData` tool, so the first run has a start point.

## 6. Schedule the hourly run

Use the scheduled-task tool (`create_trigger`):

- **Schedule:** cron in the user's time zone, at a minute other than :00, every hour across their working hours and days. Example: `CRON_TZ=Europe/London 7 9-18 * * 1-5`.
- **Computer:** set `requires_local_device: true` if the agent folder is on their computer.
- **Notifications:** turn on push notifications.
- **Prompt:** "Run the `reply-drafts` skill for <name>, using the config at <agent folder>/config.md. Drafts only; never send, post or edit anything in chat, email or the tracker."

Tell the user the first run time, and how to pause the task or change it.

## 7. First run and hand-off

Run the `reply-drafts` skill once now, so the queue has real drafts. Then tell the user, in 3–5 lines:

- where the queue is
- when the next run is
- that `/reply-drafts` runs it on demand
- that editing a draft before sending teaches the agent their voice

## Rules

- Never send, post, react or edit in `~~chat`, email or `~~project tracker`.
- Never copy secrets into any file.
- Only read conversations the user can already see.
- Never publish the Reply Queue with looser access rules than above.
