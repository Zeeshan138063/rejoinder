# Instant alerts for VIP and urgent messages

Reply Agent checks your chat once an hour, because scheduled tasks can't run more often. For the few messages that can't wait an hour, such as your manager, the CTO, a client-facing PM, or anything that says "prod is down", add one of the small automations below. It sends a phone notification **the moment** the message arrives. The full draft still lands in your Reply Queue on the next hourly run, or straight away if you run `/reply-drafts`.

The automation never reads more than the one message, never replies, and stores nothing.

---

## Microsoft Teams: Power Automate (about 30 minutes, no extra licence)

**You need:**

- a Microsoft 365 work account that can use Power Automate. Most can; your admin may have turned it off.
- the **Power Automate** mobile app, signed in with the same account, for push notifications.

### Flow 1: chats (1:1 and group)

1. Go to **make.powerautomate.com**, then **Create**, then **Automated cloud flow**.
2. Name it `Reply Agent – VIP alert (chats)`.
3. **Trigger:** Microsoft Teams → **When a new chat message is added**.
4. Add **Get message details** (Microsoft Teams):
   - Message: the *Message id* from the trigger
   - Message type: **Chat**
   - Chat: the *Conversation id* from the trigger
5. Add a **Condition**, set to **OR**, with these rows:
   - `From → User → Email` *is equal to* `manager@example.com` (one row per VIP)
   - `Body → Content` *contains* `prod`
   - `Body → Content` *contains* `urgent`
   - `Body → Content` *contains* `asap`
   - `Body → Content` *contains* `client`
6. Add a second condition so you don't alert yourself: `From → User → Email` *is not equal to* your own address.
7. **If yes:** Notifications → **Send me a mobile notification**:
   - **Text:** `@{From display name}: @{substring(Body plain text, 0, 140)}`
   - **Link:** the message's *Web URL*
   - **Link label:** `Open in Teams`
8. **Save**, then ask a VIP colleague to send you a test message.

### Flow 2: channel @mentions

Copy Flow 1 and change only the trigger to **When I'm @mentioned** (Microsoft Teams). Pick the teams and channels you care about. Keep the same conditions and notification.

### If it doesn't fire

- **Flow run history shows nothing:** your organisation may block Teams triggers for Power Automate (a DLP policy). Ask your admin.
- **It fires for everything:** check the condition is set to **OR** inside the VIP and keyword group, and **AND** for "not from me".
- **No phone notification:** sign in to the Power Automate app on your phone and allow notifications.

---

## Slack: Workflow Builder (about 10 minutes)

**You need:** a paid Slack plan; Workflow Builder isn't on the free plan.

1. In Slack, open **Tools → Workflow Builder → New workflow**.
2. **Trigger:** **When a message is posted** in a channel you choose. Add one workflow per important channel.
3. Add the step **Send a message** to **yourself**, with the message `🔔 {{sender}} in {{channel}}: {{message text}}`. Your phone's Slack app will notify you.
4. To alert only for some people or words, add a **Filter** step before it:
   - *Sender is* one of your VIPs, **or**
   - *message contains* `prod` / `urgent` / `client`.

For DMs, Slack already notifies you instantly. Set VIPs to **Always notify** under *Preferences → Notifications → VIP* instead.

---

## Later: an instant draft as well

The same Power Automate flow can also call Claude and post a draft back to you in seconds. That needs:

- an Anthropic API key, stored in a Power Automate **secure input**, never in the flow text
- the **HTTP** action, which usually needs a Power Automate Premium licence
- your `memory/voice.md` text pasted into the flow's prompt

Start with the alert-only flow above. It covers most of the value at no cost.
