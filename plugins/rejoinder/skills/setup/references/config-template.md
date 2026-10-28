# config.md template

`/rejoinder:setup` writes this file to the agent folder, and every run reads it. Keep the headings exactly as below; the values are examples.

```markdown
# Rejoinder config

## Me
- name: Alex Rivera
- email: alex.rivera@example.com
- chat_user_id: <id the chat tool uses for you, used to detect real @mentions>
- role: Team lead, Payments squad
- timezone: Europe/London
- working_hours: 09:00-18:00
- working_days: Mon-Fri

## Tools
- chat: Microsoft Teams            # or Slack, Discord, Google Chat
- tracker: Jira                    # or Linear, Asana, GitHub Issues, none
- tracker_site: <cloudId / workspace / org needed by the connector>
- ticket_prefixes: PAY, OPS        # keys like PAY-123 get looked up
- calendar: Outlook                # or Google Calendar, none

## Queue
- queue_url: https://claude.ai/artifact/<id>
- agent_folder: ~/Documents/rejoinder

## Priority
- vips: Sam Lee (manager), Priya Shah (PM), Jordan Kim (CTO), People team
- urgent_words: prod, production, down, outage, client, customer, go live, release, deploy, urgent, asap, eod, today
- wait_limits: dm=2h, group=4h     # past this, a pending request becomes urgent

## Noise
- muted_chats: All-hands, Random, Social   # skipped unless you are @mentioned by a VIP
- mention_only_chats: Platform-wide, Announcements   # only real @mentions count
- skip_patterns: haha, lol, ok, agreed, +1, emoji-only, image-only, system events

## Voice
- languages: English (mix in a second language only where voice.md says so)
- sign_off: Thanks
- never: emoji, exclamation marks
```
