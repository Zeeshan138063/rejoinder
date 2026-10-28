# Reply Agent

Reply Agent watches your work chat (Microsoft Teams, Slack and others) during your working hours. It skips the noise and drafts replies in your own voice. Each draft comes with context from the thread, from what it knows about the person, and from your tracker (Jira, Linear or others). Drafts land in a private Reply Queue page, urgent ones first. You review, edit and send them yourself; it never sends on its own.

## Install

```
/plugin install reply-agent --marketplace Zeeshan138063/reply-agent
```

## Skills

In Claude Code these show as `/reply-agent:reply-setup` and `/reply-agent:reply-drafts`.

- **`/reply-setup`**: one-time setup. It picks your chat tool and tracker, learns your voice and the people you work with, creates your knowledge-base folder and Reply Queue page, and schedules the hourly run.
- **`/reply-drafts`**: the hourly or on-demand run. It collects messages, filters them, adds context, drafts replies and fills the queue.
- **`/reply-brief`**: the morning brief and end-of-day wrap, pinned to the top of the Reply Queue: what to reply to first, meetings, due tickets, promises, and a standup draft.

## Requirements

- A chat connector (Microsoft Teams via Microsoft 365, or Slack).
- Optionally, a tracker connector.
- Claude with scheduled tasks and Artifacts.

See [CONNECTORS.md](CONNECTORS.md) for supported tools. See the [project README](../../README.md) for install steps, privacy notes and the roadmap.
