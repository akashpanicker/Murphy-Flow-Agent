Design a modern enterprise SaaS web application called Murphy FlowAgent used for managing procurement requests and workflows.

The design should follow best practices used by enterprise products like Atlassian, Linear, and Stripe dashboards with strong hierarchy, reusable components, and responsive layout.

Use Auto Layout, reusable components, and design tokens.

Global Layout System

Create a three-part layout system used across all screens:

Left Sidebar Navigation
Width: 240px
Background: Light neutral gray

Navigation items:

Dashboard

Open Items

New Request

Users

Requester Mapping

Each item should include:

icon

label

hover state

active state highlight

Top Navigation Bar

Height: 64px

Left:
Murphy FlowAgent (application name)

Right:

User avatar

Role label: Dev Admin

Logout icon

Main Content Area

Light gray background

White cards for sections

8px border radius

Soft shadow

24px spacing grid

Screen 1: Dashboard

Purpose: Overview of procurement activity.

Page Title:
Welcome back

Create 6 metric cards in a responsive grid.

Cards:

Open Items

Active Workflows

Total Users

Pending Approvals

Overdue Tasks

Due This Week

Each card should include:

metric number

icon

label

subtle colored icon background

Example card structure:

Icon container
Metric number (large)
Label text

Below the metrics create a content card titled:

Procurement Requests

Top right actions:

Primary button:
+ New

Secondary buttons:

Edit
Delete

Inside the card create a table container.

Empty state message:

"No recent activity"

Interaction

Click New → Navigate to New Request Upload Screen

Screen 2: Upload Procurement Request

Page Title:
New Procurement Request

Add Back navigation option.

Main content contains a large upload card centered on page.

Upload card contains:

Icon
Drag and drop zone

Text:

"Drag and drop files here, or click to browse"

Supported formats:

PDF
DOCX
XLSX
PNG
JPG

Below upload zone:

Primary button:
Upload

Interaction

When a file is uploaded → Navigate to Procurement Request Form Screen

Screen 3: Procurement Request Form

Page Title:
New Procurement Request

Top right:

Primary button:
Submit

Secondary button:
Back to Upload

Layout

Use a two column layout

Left column width: 55%
Right column width: 45%

Left Panel: Procurement Form

Card Title:
Procurement Form

Section Title:
Procurement Request Form

Expandable group:

Request Info (0/16 filled)

Design fields in structured grid.

Row 1

Request ID

Sub Request ID

Title

Row 2

Description (large textarea)

Row 3

Category

Status

Priority

Row 4

Assigned To

Requestor

Request Start Date (date picker)

Row 5

Due Date (date picker)

Follow-up Date (date picker)

Triage Date (date picker)

Form should support auto-filled values extracted from uploaded document.

Right Panel: Uploaded Document

Card title:
Uploaded Document

Display a document viewer component.

Include:

File name: sample.pdf

PDF viewer frame with:

page navigation

zoom controls

scrollable document

Design System

Typography:
Inter or modern SaaS font

Spacing system:
8px grid

Colors:

Background:
#F6F8FB

Cards:
#FFFFFF

Borders:
#E5E7EB

Primary action color:
Professional enterprise blue

States:

Hover
Focus
Disabled

Components to Generate

Create reusable components for:

Sidebar navigation item

Metric card

Button (Primary / Secondary)

Table container

Input field

Date picker

Upload area

Document viewer container

Form section

All components should support Auto Layout and variants.

UX Flow

Dashboard
→ Click New
→ Upload Procurement Document
→ Document parsed
→ Procurement Form with autofilled fields + document viewer
→ Submit Request
→ The request should be shown in the dashboard table.