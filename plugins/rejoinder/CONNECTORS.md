# Connectors

## How tool references work

The skills in this plugin talk about tools by category, written with a `~~` prefix, for example `~~chat` or `~~project tracker`. When you run `/rejoinder:setup`, you choose the actual tool and it is saved in your `config.md`. Every later run reads that file and uses the tool you picked.

## Connectors for this plugin

| Category | Placeholder | Required | Options | What it is used for |
| --- | --- | --- | --- | --- |
| Chat | `~~chat` | Yes | Microsoft Teams (Microsoft 365 connector), Slack, Discord, Google Chat | Find messages that need you, read the thread around them, learn your writing voice from your own messages |
| Project tracker | `~~project tracker` | No | Jira (Atlassian connector), Linear, Asana, GitHub Issues, ClickUp | Add ticket status and owner to a draft when a message mentions a ticket |
| Calendar | `~~calendar` | No | Outlook, Google Calendar | Know when you are in a meeting (hold non-urgent drafts, defer politely) |

## What each chat tool must allow

At minimum, the chat connector has to be able to:

1. Search messages by date, sender and recipient (or list recent messages per conversation).
2. Read one message in full, including who it mentions.
3. Give a link that opens the message in the app.

Sending is **not** needed. The agent only drafts; you send.

## Tested combinations

| Chat | Tracker | Status |
| --- | --- | --- |
| Microsoft Teams (Microsoft 365 connector) | Jira (Atlassian connector) | Used daily by the author |
| Slack | Linear / Jira | Should work; the steps are written for it, but not tested yet |

If you run it on another combination, please open an issue or a pull request with what you changed.
