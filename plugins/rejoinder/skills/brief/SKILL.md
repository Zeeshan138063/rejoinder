---
name: brief
description: Writes the user's morning brief or end-of-day wrap from their Reply Queue, chat, calendar and tracker, and pins it to the top of the Reply Queue page. Use for the scheduled morning and evening runs, or when the user says "/rejoinder:brief", "morning brief", "what's on today", "end of day wrap" or "wrap up my day".
---

# Reply brief

Write a short brief and pin it to the top of the user's Reply Queue. **Read-only everywhere except the queue's `meta/brief` doc.** Never send, post or edit anything in chat, email, calendar or the tracker.

## 0. Load

- Read `config.md` from the agent folder for the user's name, email, time zone, tools, `queue_url`, VIPs and ticket prefixes.
- If the folder can't be reached, use `meta/run.configCache` and the `kb/*` docs in the queue.
- **Kind:** use `morning` before 14:00 in the user's time zone and `evening` after, unless the user or the scheduled prompt says otherwise.

## 1. Gather (keep it cheap: at most ~15 tool calls)

**Reply Queue** (`ArtifactData` on `queue_url`):

- `drafts`: open cards (urgent first), snoozed cards, and cards marked sent or done today
- `prs`: open review requests
- `meta/run`: when the agent last ran

**Chat** (`~~chat`), morning only: count the messages to the user since their last evening (18:00 yesterday), and note any from VIPs that have no draft yet.

**Calendar** (`~~calendar`, if configured): today's meetings (morning), or tomorrow's first three (evening). Show times in the user's time zone.

**Tracker** (`~~project tracker`, if configured):

- Use **only** plain JQL search (`searchJiraIssuesUsingJql`), never cross-product search; see the credit guard in `rejoinder:drafts`.
- One query: `assignee = currentUser() AND statusCategory != Done AND (duedate <= endOfDay() OR priority in (Highest, High)) ORDER BY duedate ASC, priority DESC`.
- Evening also runs: `assignee = currentUser() AND updated >= startOfDay() ORDER BY updated DESC`.

**Tasks:** `TASKS.md` → Active items due today or overdue, and Waiting On items older than 2 days.

## 2. Write `meta/brief`

`set` this document (create it if missing; pin `if_version` if it exists):

```json
{
  "id": "<YYYY-MM-DD>-morning | <YYYY-MM-DD>-evening",
  "kind": "morning | evening",
  "at": "<ISO now>",
  "headline": "<one line, e.g. '3 replies waiting, 1 urgent · 2 tickets overdue · 4 meetings'>",
  "sections": [
    {"title": "Reply first", "icon": "bubble", "items": [{"text": "Priya: client go-live confirmation (22h)", "tone": "urgent", "link": "<openUrl>"}]},
    {"title": "Today's meetings", "icon": "cal", "items": [{"text": "12:20 Team standup"}]},
    {"title": "Jira", "icon": "ticket", "items": [{"text": "PAY-31 overdue 1d · In Progress", "tone": "urgent", "link": "<webUrl>"}]},
    {"title": "Promises due", "icon": "check", "items": [{"text": "Review API guidelines for Alex"}]},
    {"title": "Waiting on others", "icon": "clock", "items": [{"text": "Sam: PDF library versions (2d)"}]}
  ]
}
```

**Morning sections, in this order** (skip any that are empty):

1. **Reply first:** urgent cards, then the oldest waiting
2. **Today's meetings**
3. **Jira:** overdue, due today, Highest
4. **Promises due**
5. **PRs to review**
6. **Waiting on others**

**Evening sections:**

1. **Done today:** replies cleared and tickets moved
2. **Still waiting on you**
3. **Promises not done:** suggest moving them to tomorrow
4. **Tomorrow:** first meetings and due tickets
5. **Standup draft:** 3 lines in the user's voice ("Yesterday / Today / Blockers"), built from today's ticket updates and sent replies

**Writing rules:**

- Each item is one line, at most ~90 characters, with names and ticket keys, no filler.
- `tone` is `urgent`, `warn` or omitted.
- Links must be `https`.
- Never include secrets or message bodies longer than one line.

## 3. Report

End with one message that becomes the phone notification:

- `Morning brief: <headline>`
- `Day wrap: <headline>`
