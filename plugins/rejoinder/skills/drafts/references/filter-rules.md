# Filter and priority rules

Apply them in order. The first match decides the lane. `config.md` values override the defaults shown here.

## 1. skip (no card)

- Messages the user sent.
- System events: someone joined, the chat was renamed, a call started or ended.
- Image-only, file-only or emoji-only messages, unless it is a DM from a VIP.
- Matches for `skip_patterns`, e.g. "haha", "lol", "ok", "agreed", "+1", "thanks!".
- Social chat: banter, food, birthdays, polls and votes, campaign posts.
- Anything in `muted_chats`, unless a VIP @mentions the user.
- In `mention_only_chats` and other group chats, messages that only contain the user's **name as text**. A real @mention (the user's `chat_user_id` in the message's mentions) is required. One exception: a direct question that uses the user's name ("Alex, can you…?").

## 2. fyi (one line in the digest, no draft)

- Status updates, deploy notices, test reports, PR links with no question, meeting notes, "done" or "merged" notices aimed at a group.

## 3. urgent

The message needs a reply, and at least one of these is true:

- The sender is in `vips`.
- The text contains an `urgent_words` term, e.g. prod, down, outage, client, go live, release, urgent, asap, eod, today.
- It has waited longer than `wait_limits`: by default 2 hours for a DM, 4 hours for a group.
- It blocks someone else: "waiting on you", "so I can send to the client", "blocked".

## 4. quick

A short yes/no, availability or approval question that needs no research:

- "quick call?", "free?", "should I merge?", "ok to deploy?", "done?", "can I take leave on…?"

Write 2–3 one-tap replies in the user's voice, such as "sure, 5 mins", "in a meeting, after 30 mins", "yes go ahead".

## 5. normal

Anything else that asks the user something, or asks them to do something.

## Signals that something is actionable

- It ends in "?".
- It contains "please", "can you", "could you", "review", "approve", "confirm", "check", "call", "PR", "merge", or the equivalents in the user's other language (learned from `voice.md`).
- It contains a tracker key or a code-review link addressed to the user.
