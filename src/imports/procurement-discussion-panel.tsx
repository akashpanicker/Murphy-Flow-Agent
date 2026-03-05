Enhance the Murphy FlowAgent procurement dashboard by adding a collaborative discussion/chat feature attached to each procurement request in the table.

The chat should allow stakeholders such as Cres, Maria, Cost Controller, and Payton to communicate about a specific request or line item.

Use modern enterprise UX patterns similar to Jira issue comments, Slack threads, and Linear discussions.

Use Auto Layout, reusable components, and clear hierarchy.

Table Enhancement

Inside the Procurement Requests table, add a new column:

Discussion

Each row should display:

chat icon

message count badge

indicator if there are unread messages

Example:

💬 3 messages

Interaction

When the user clicks the chat icon in a row:

Open a right-side slide-out discussion panel.

Panel width: 420px

The panel should be attached to the request context.

Header should display:

Request ID
Request Title
Status badge

Example:

PR-1024
Office Equipment Purchase
Status: Pending

Discussion Panel Layout
Header

Request title

Request ID tag

Close icon

Conversation Area

Scrollable message thread.

Each message contains:

user avatar

user name

role label (Cres / Maria / Cost Controller / Payton)

timestamp

message bubble

Example message:

Maria
Cost Controller
"Can you confirm the cost for the docking stations?"

Line Item Reference

Messages can include tags referencing line items.

Example tag inside message:

Item #2 – 27 inch Monitor

These appear as clickable chips.

Mentions

Allow @mentions

Example:

@Payton please review the priority level.

Mentioned users receive notification indicators.

Message Composer

At bottom of panel:

Input box:

"Write a message..."

Features:

send button

attach file icon

line item tag dropdown

Visual Indicators in Table

Add indicators for discussions:

Unread messages:

Blue dot on chat icon

Active discussion:

Highlighted chat icon

Notification Behavior

When a new message is posted:

increment message count in table

show unread indicator

notify mentioned users

Components to Create

Reusable components:

Chat icon with message badge
Discussion panel
Message bubble
Mention tag
Line item tag chip
Chat input composer

All components should support Auto Layout and variants.