# Learning the user's voice

The goal is that the user can send most drafts unedited. Learn their voice only from messages they wrote themselves.

## What to measure

| Trait | How to read it |
| --- | --- |
| Length | Median words per message; whether they send several short messages instead of one long one |
| Languages | Share of each language; who gets which. Many people mix languages with peers and use one with managers or clients |
| Greeting / address | Do they greet? How do they address peers, managers, clients ("Sir", "bro", first name, @mention first)? |
| Sign-off | "Thanks", "Thanks...", "Cheers", none |
| Case and punctuation | Lowercase? Little punctuation? Arrows like "-->"? ALL CAPS for emphasis? |
| Emoji | Never / rarely / often, and which ones |
| Decisions | Do they state a decision then a reason, or ask questions? |
| Deferring | How they say "not now": "after the meeting", "eod today", "tomorrow first thing" |
| Pet phrases | Words they use a lot: "sure", "done", "shall", "please", "noted" |

## By audience

Group samples by who received them: direct reports or peers, manager, senior leadership, QA or PM, clients or external people. Write one line of rules for each audience.

## voice.md structure

```markdown
# <Name>'s writing voice
Learned from <N> messages, <date range>. Updated from every edit to a draft.

## Rules
- ...

## By audience
| Audience | Style |
|---|---|

## Samples
### To <audience>
- "<verbatim message>"

## Learned edits
- <date>: draft "<draft>" → sent "<what they sent>" → rule: <one line>
```

## Do not

- Copy typos. Keep their casual style, but spell words correctly.
- Include samples that carry secrets, personal data, or other people's private information.
- Over-fit to one conversation. Rules need at least 3 supporting samples.
