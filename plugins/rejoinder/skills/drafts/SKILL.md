---
name: drafts
description: Checks the user's work chat for messages that need them since the last run, skips noise, and drafts replies in their voice with context into their Reply Queue. Use for the scheduled hourly run, or when the user says "/rejoinder:drafts", "check my chat", "any replies pending", "draft my replies" or "what needs me".
---

# Reply drafts

Draft replies to `~~chat` messages that need the user, in their voice, with context, into their Reply Queue.

**Never send, post, react to, or edit anything in `~~chat`, email or `~~project tracker`.** The user reviews and sends every reply.

## 0. Load

Read `config.md` from the agent folder (the scheduled prompt names it). If it is missing, tell the user to run `/rejoinder:setup` and stop. From it take:

- the user: name, email, chat user id, time zone
- the tools: chat, tracker, tracker site
- `queue_url`
- the priority rules: VIPs, urgent words, wait limits
- the noise rules: muted chats, mention-only chats, skip patterns

Also read `CLAUDE.md`, `memory/voice.md` and `memory/glossary.md`.

**Cloud copy of the knowledge base.** The queue keeps a copy of the essentials so a run can draft with full context while the computer sleeps:

- `kb/core`: `{text, updatedAt}`, the text of `CLAUDE.md`
- `kb/voice`: `{text, updatedAt}`, the text of `memory/voice.md`
- `kb/people`: `{text, updatedAt}`, a one-line summary per person from `memory/people/`

What to do each run:

- **Agent folder reachable:** read from the folder as usual. If any of `CLAUDE.md`, `voice.md` or the people files changed since the matching `kb/*` doc's `updatedAt`, rewrite that doc. Do this at most once a day per doc, keep each doc under 60 KB, and never copy secrets.
- **Agent folder unreachable** (computer offline): read the three `kb/*` docs, plus `config.md` values cached in `meta/run` (`configCache`). Draft exactly as you would from the folder. Mention "knowledge base: cloud copy" in `context` only if a fact may be stale.
- **Neither available:** draft from this skill alone, and say so in `context`.

## 1. Since when

With the `ArtifactData` tool, read `meta/run` from `queue_url`. The start is `lastRunAt`, or 24 hours ago if there is none. Note the current time as `runAt`.

## 2. Collect

Using the `~~chat` connector, gather everything since the start, paging until done, up to about 150 messages per query:

- **Messages to the user:** direct messages, group messages that @mention them, and channel posts that @mention them.
  - Teams: `chat_message_search` with the `recipient` = their email, plus a `query` of their name.
  - Slack: a mentions search plus their DMs.
- **Messages from the user:** used for step 4 (already answered) and step 8 (learning).

Drop messages the user sent. Drop any message that already has a `drafts/<id>` document.

## 3. Classify

Sort each message into one lane using `references/filter-rules.md`: **skip**, **fyi**, **urgent**, **quick** or **normal**. When the preview isn't enough to decide, read the full message and its mentions.

## 4. Already answered?

If the user posted in the **same conversation** after the message, don't draft. For open cards whose conversation the user has replied in since, update them to `{status:"sent", autoDetected:true}`.

## 5. Context

For each urgent, quick and normal message, write 1–3 lines of context:

- the 3–5 messages before it in the conversation
- the person's file and the chat's file from `memory/`
- if `~~project tracker` is configured: any ticket key that matches `ticket_prefixes`, or that clearly matches the topic, with its status, owner and last update
- **Jira credit guard:**
  - With the Atlassian connector, use only the plain Jira tools: `searchJiraIssuesUsingJql`, `getJiraIssue` and `listJiraIssueComments`. These are single-product lookups and use no Rovo credits.
  - Never use the Atlassian `search` tool or the Teamwork Graph tools (`getGraphContext`, `getGraphObject`, `addGraphContext`). Those are enriched cross-product calls billed in Rovo credits.
  - Ask for only the fields you need, and use at most 10 tracker calls per run.

Never invent facts. Anything the reply needs but you don't know (a link, a date, a decision) goes in `gaps`, and the draft uses a `<placeholder>`. The queue page will not send a draft that still contains `<…>`.

## 6. Draft

Follow `memory/voice.md`, matching the audience. Write one main draft and one shorter `alt`:

- 1–3 lines.
- In group chats, start with the person's name for the @mention.
- Defer with a concrete time.
- No secrets, ever.

For **quick** cards, also give 2–3 one-tap replies in `quick`.

## 7. Write the queue

Make one `ArtifactData` `batch` of up to 50 writes to `queue_url`:

- New `drafts/<message id>` documents in the shape given in `references/card-schema.md`. These are creates, so use no `if_version`.
- `meta/digest`: `{runAt, items:[{sender, chat, text, at}]}`, with one line for each fyi item.
- `meta/run`: `{lastRunAt: runAt, scanned, skipped, drafted, configCache}`, pinned with the `if_version` you read in step 1.
- **Clean-up:** in the same batch, delete `drafts/*` docs whose `status` is `sent` or `done` and whose `doneAt` (or `updatedAt`) is more than 30 days old, at most 50 per run. Never delete `open` or `snoozed` cards. This keeps the queue fast and far below its 25,000-document limit.

## 8. Learn and track

If the agent folder is reachable:

- **Learned edits:** for cards now marked `sent` whose `sentDraft` or `editedDraft` differs from `draft`, add the pair under "Learned edits" in `memory/voice.md`. When the same change shows up 3 or more times, add a rule.
- **Tasks:** promises the user made in their own messages go to `TASKS.md` → Active. Questions they asked others go to → Waiting On. Skip any already there.
- **People and chats:** for a new person or conversation, create a short file in `memory/people/` or `memory/chats/`.
- **Secrets:** if the user's own message contains a password, token or key, add an urgent card from "Security check" telling them to rotate it and delete the message.

## 8b. PR review queue

Track code reviews people ask the user for:

1. **Find review requests.** Look for pull or merge request links in the messages you collected: `bitbucket.org/<ws>/<repo>/pull-requests/<n>`, `github.com/<o>/<r>/pull/<n>`, `gitlab.com/.../merge_requests/<n>`, or the equivalent on your org's hosts. Count a link only when it is addressed to the user or comes with "review", "PR", "approve", "check" or "merge", or the equivalent in the user's other language.
2. **Write a card** for each new one: `prs/<repo>-<n>` = `{url, repo, number, title?, from, chat, chatUrl, at, status:"open"}`. Use the PR title only if the message gives it. Don't call the code host.
3. **Close cards.** Set `{status:"done", doneAt}` when the user later says "approved", "merged", "done" or "reviewed" about that PR in the same chat, or links it with "LGTM". The user can also close a card from the page.
4. **Clean up.** Delete `prs/*` that have been done for more than 14 days.

## 9. Report

End with one short message. A scheduled run turns it into the phone notification:

- If anything is urgent: start with `URGENT:` followed by one line per urgent card (sender and gist).
- Otherwise: `N new drafts in your Reply Queue (X quick, Y normal), Z skipped as noise.`
- If nothing new: `Nothing new needs you.`

When the user runs this on demand, also show the urgent drafts in chat so they can copy them straight away.
