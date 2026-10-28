# Rejoinder

Rejoinder watches your work chat (Microsoft Teams, Slack and others) during your working hours. It skips the noise and drafts replies in your own voice. Each draft comes with context from the thread, from what it knows about the person, and from your tracker (Jira, Linear or others). Drafts land in a private Reply Queue page, urgent ones first. You review, edit and send them yourself; it never sends on its own.

## Install

```
/plugin install rejoinder --marketplace Zeeshan138063/rejoinder
```

## Skills

In Claude Code these show as `/rejoinder:setup` and `/rejoinder:drafts`.

- **`/rejoinder:setup`**: one-time setup. It picks your chat tool and tracker, learns your voice and the people you work with, creates your knowledge-base folder and Reply Queue page, and schedules the hourly run plus the optional brief and wrap.
- **`/rejoinder:drafts`**: the hourly or on-demand run. It collects messages, filters them, adds context, drafts replies and fills the queue.
- **`/rejoinder:brief`**: the morning brief and end-of-day wrap, pinned to the top of the Reply Queue: what to reply to first, meetings, due tickets, promises, and a standup draft.

## When it runs

- **Hourly** in your working hours: `/rejoinder:drafts` fills the Reply Queue and sends a phone notification for anything urgent.
- **Morning brief** about 30 minutes after your day starts, and **end-of-day wrap** about 30 minutes before it ends: `/rejoinder:brief`.
- **On demand** whenever you run either command yourself.
- **Instantly** for VIPs, if you add the optional [instant alerts recipe](../../docs/instant-alerts.md).

Setup creates these schedules in your own time zone; change them any time by asking Claude.

## Requirements

- A chat connector (Microsoft Teams via Microsoft 365, or Slack).
- Optionally, a tracker connector.
- Claude with scheduled tasks and Artifacts.

See [CONNECTORS.md](CONNECTORS.md) for supported tools. See the [project README](../../README.md) for install steps, privacy notes and the roadmap.
