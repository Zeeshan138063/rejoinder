# Agent folder layout

```
<agent folder>/
├── config.md            settings (see config-template.md)
├── CLAUDE.md            short working memory: me, key people, terms, projects, key chats (50–80 lines)
├── TASKS.md             Active / Waiting On / Someday / Done
└── memory/
    ├── voice.md         style rules by audience + 20–30 samples + "Learned edits"
    ├── glossary.md      acronyms, codenames, ticket prefixes, nicknames
    ├── people/<name>.md role, team, how they write, how the user answers them, open items
    ├── chats/<chat>.md  purpose, members, noise level, rolling 14-day summary, decisions, open questions
    └── projects/<name>.md status, deadlines, linked tickets, people
```

## Rules

- **Short files.** A person or chat file should be under 40 lines. Roll old detail into one line per week.
- **Facts, not guesses.** Write "role: unclear" rather than inventing a role.
- **No secrets.** Leave out passwords, tokens, keys, salaries and health details.
- **Dates are absolute.** Write "2026-11-04", never "next Tuesday".
- **The user owns these files.** If they edit one, their version wins.

## TASKS.md format

```markdown
# Tasks

## Active
- [ ] **Confirm release readiness to Priya** - she is waiting to email the customer (asked 2026-10-27)

## Waiting On
- [ ] **Sam: approval for the new pipeline** - asked 2026-10-28

## Someday

## Done
- [x] ~~Review PR #278~~ (2026-10-28)
```
