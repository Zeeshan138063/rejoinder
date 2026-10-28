# Reply Queue data

The Reply Queue page (`assets/reply-queue.html`) reads these documents live from its artifact database. The `reply-drafts` skill writes them with the `ArtifactData` tool.

## drafts/<message id>

```json
{
  "lane": "urgent | quick | normal",
  "provider": "teams | slack | discord | gchat",
  "sender": "Priya Shah",
  "senderEmail": "priya.shah@example.com",
  "chat": "Release planning",
  "chatType": "oneOnOne | group | meeting | channel",
  "chatId": "<provider chat id>",
  "receivedAt": "2026-10-27T13:44:35Z",
  "message": "<exact text of the message>",
  "context": "<1-3 lines the draft relies on>",
  "draft": "<reply in the user's voice>",
  "alt": "<shorter reply>",
  "quick": ["sure, 5 mins", "after the meeting"],
  "gaps": "<what the user must fill in before sending; omit if none>",
  "openUrl": "<https link that opens the message in the chat app>",
  "links": [{"label": "PAY-123", "url": "https://..."}],
  "status": "open",
  "createdAt": "<runAt>",
  "updatedAt": "<runAt>"
}
```

## Fields the page writes

| Field | When |
| --- | --- |
| `editedDraft` | The user edits the draft in the page |
| `status` | `sent`, `done`, `snoozed` or `open` |
| `sentDraft` | The text at the moment they pressed Mark sent |
| `snoozeUntil` | Snooze for 1 hour |
| `doneAt`, `updatedAt` | Any status change |

## How the Send button works

The page never sends a message itself. It builds a link instead:

- **Teams, 1:1 chat with `senderEmail`:** opens a chat with the reply already typed in, using `https://teams.microsoft.com/l/chat/0/0?users=<email>&message=<text>`. The user presses Enter in Teams.
- **Anything else:** copies the reply and opens `openUrl`. The user pastes and presses Enter.

Contributions that add a prefilled-compose link for other chat apps are welcome. Add a branch in `sendHref()` in the page.

## meta/run

`{lastRunAt, scanned, skipped, drafted, configCache}`

## meta/digest

`{runAt, items: [{sender, chat, text, at}]}`
