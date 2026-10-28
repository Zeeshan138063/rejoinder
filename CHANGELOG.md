# Changelog

## 0.2.0

### Added
- **Morning brief and end-of-day wrap.** The new `/reply-brief` skill pins them to the top of the Reply Queue: what to reply to first, meetings, due tickets, promises, and a standup draft.
- **Jira tab.** Your open tickets, live, with priority, type, status, epic, due date and stale flags. You can filter, sort and group them.
- **Ask Jira.** Plain-English questions are turned into JQL. Results show To do / In progress / Done cards, a per-assignee chart and filters (My tasks, type, priority, overdue, project).
- **Jira quick actions.** Move a ticket's status or comment on it from the tab. Both need a confirm click.
- **Write my standup.** Drafts your standup in your voice from Jira activity and the replies you sent.
- **Live Jira status chips** on reply cards for any ticket a message mentions.
- **PR review queue.** Review requests people send you in chat, with their age and a "Mark reviewed" button.
- **Insights** on the Sent tab: typical reply time, % sent as drafted, urgent answered within 2h, busiest people and chats, and a 7-day chart.
- **Cloud copy of the knowledge base.** Hourly runs keep full context while your computer sleeps.
- **Instant alerts recipe** for VIP and urgent messages: Power Automate for Teams, Workflow Builder for Slack.
- **CI.** Manifest, skill, page-script and secret checks run on every push.

### Changed
- Reply Queue redesign: today panel with progress ring, search, filters, keyboard shortcuts, motion, light/dark toggle, platform badges and tab icons.
- Jira stats and banner follow the selected project.
- **Jira credit guard.** The skills use only plain Jira tools, never Rovo cross-product search, so normal use costs no Rovo credits.

### Fixed
- "Mark sent" now asks again if the reply still contains a `<placeholder>`.
- Sent and closed cards are removed after 30 days, so the queue stays fast.

## 0.1.0
- First public release: `/reply-setup` and `/reply-drafts` skills, plus the Reply Queue page with Send in Teams, quick replies, snooze and mark sent.
