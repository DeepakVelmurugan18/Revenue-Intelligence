# SpendNest Revenue Intelligence Inbox

A modern, evidence-first Revenue Intelligence Inbox and Manager Workspace engineered for sales and customer success leadership. It disambiguates noisy telephony and calendar records, highlights verifiable coaching and deal signals, and handles late-arriving transcripts with full idempotent replay and manual override preservation.

---

## 🚀 Quick Start: Running the Workspace

The application is completely self-contained, requires **zero external API keys**, and runs 100% offline.

### Option 1: Direct Browser Launch (Fastest)
1. Navigate to `candidate/app/index.html` in your file explorer.
2. Double-click or open it in any modern browser (Chrome, Edge, Safari, Firefox).
3. The workspace will open immediately in the **final post-update state** (Revision 2 applied, 44 records loaded).

### Option 2: Lightweight Local HTTP Server
If you prefer running via a local server:
```bash
# Using Node.js (npx)
npx serve candidate/app

# OR using Python
cd candidate/app && python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ How to Reproduce the Replay Test (Steps 1–5)

The application includes an interactive **Replay Contract Bar** located at the top of the screen:

| Step | Action in UI | Expected & Verified Behaviour |
|---|---|---|
| **1. Initial Import** | Click **"1. Initial Import (Rev 1)"** | Imports `01_initial.json`. Displays exactly 44 records. **17 usable supplied transcripts** are available (10 calls, 7 meetings). Record `M07` is in intake status (*"Transcript not included in this delivery..."*). |
| **2. Repeat Import** | Click **"2. Repeat Import (Verify 44)"** | Re-imports the initial delivery. Proves **idempotency**: 0 duplicate records created, record count remains strictly **44**, and activity numbers are not inflated. |
| **3. Manual Route Correction** | Click **"3. Correct Route (M07)"** | Manually sets `M07`'s route to `"Product Feedback & Bug Escalation"` (or pick any route from the dropdown and click *Save Override*). The badge changes to purple `MANUAL OVERRIDE`. |
| **4. Import Update** | Click **"4. Import Update (Rev 2)"** | Imports `02_update.json`. Meeting `M07` upgrades to **Revision 2**, unlocking its **late transcript (27 turns)**. Usable texts increase to **18 / 44**. **Crucially, the manual route override from Step 3 is preserved!** |
| **5. Test Persistence** | Click **"5. Test Persistence"** & reload browser | Refreshes the page. The 44 records, 18 usable texts, M07 Revision 2, and the manual route override remain intact via `localStorage`. |

*Note: You can click **"🔄 Clean Reset"** at any time to return to an unimported clean slate, or **"⚡ Demo State"** to return to the full post-update view.*

---

## 🔍 Three Most Important Findings

### Finding 1: Telephony Rep Label vs. Spoken Agent Identity Mismatch (Call C06)
- **What Was Noticed:** The call payload metadata states `rep_name: "Meera"` (`meera@example.com`). However, the audio transcript reveals the caller verbally introduces himself as *"Ravi"*: *"Hello? Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Supporting Citation:** Call C06 (Source ID: `12216d5c-e254-52c6-b344-47de4c6e1ae5`): *"Ravi here. I'll say at the start that this is a cold call."*
- **Product Impact:** In the inbox feed and detail inspector, we display an explicit `REP MISMATCH` badge, separate account login from spoken rep in filters, and highlight this telephony seat-sharing audit issue in the Manager Briefing to prevent improper coaching attribution.

### Finding 2: Misclassified Vendor Evaluation Masquerading as a Deal Demonstration (Meeting M02)
- **What Was Noticed:** Meeting M02 with LedgerBridge is titled `"LedgerBridge / SpendNest discussion"`. Automated CRM classifiers often categorize this as an outbound sales pitch. In reality, SpendNest is evaluating LedgerBridge as a 3rd-party electronic invoicing and accounts receivable supplier.
- **Supporting Citation:** Meeting M02, Turn 1: Team member A: *"I work on strategy and partnerships at SpendNest... we are developing accounts receivable. We want to understand what LedgerBridge offers."* and Turn 2: Supplier A: *"Then I will cover the market strategy as well as the technical integration."*
- **Product Impact:** We introduced a dedicated `Vendor / Supplier Evaluation` routing destination. Categorizing M02 as an active opportunity would distort sales pipeline numbers and generate inappropriate sales coaching for the buyer.

### Finding 3: Critical P1 Software Defect Obscured by Missing Initial Transcript (Meeting M07)
- **What Was Noticed:** In `01_initial.json`, M07 (Willowfield Trust) contained zero turns (`unavailable_reason: "Transcript not included in this delivery..."`). When `02_update.json` delivered revision 2 with 27 turns, screen-sharing revealed two severe software bugs: (a) editing event-payment descriptions fails silently (reverting to old text on save), and (b) document upload is disabled in "Recreate payment".
- **Supporting Citation:** Meeting M07, Turn 3-4: Team member A: *"The field still shows the earlier wording...?"* / Customer A: *"Yes, it is still the old description."* and Turn 8: Customer A: *"When I go through this route, I cannot upload a document."*
- **Product Impact:** When the update is applied, M07 automatically transitions to `Product Feedback & Bug Escalation`, generates engineering reproduction steps with turn timestamps, and alerts leadership in the Daily Briefing.

---

## 🚫 Deliberately Rejected Decision

- **Rejected Decision:** *Automated Pipeline Dollar Forecasting and Win-Probability Scoring based on Conversational Currency Mentions.*
- **Alternative Considered:** Parsing conversational monetary amounts (e.g. M03 Customer B mentioning *"perhaps INR 26–39 lakh a month"* of manual vendor spend, or M10 referencing an *"INR 6,240"* subscription deduction) into CRM pipeline deal values and win-probability forecasts.
- **Why Rejected:** As explicitly stated in `DATA_DICTIONARY.md`, the dataset contains no authoritative CRM deal table, ACV contract values, or closed-won history. The INR 26-39L figure is Asterloom's external vendor payment volume (not SpendNest SaaS software fees), and INR 6,240 is a hypothetical training illustration. Synthesizing pipeline totals from anecdotal conversation mentions is fictitious and corrupts managerial decision-making.
- **Accepted Trade-off & Resulting Choice:** We deliberately omit speculative pipeline dollar forecasts and win rates. Instead, we show an honest *"Signal & Evidence Summary"* indicating qualitative interest level (e.g. "Prepaid Card Evaluation - High Intent", "API Access - Budget Constrained") and verified operational action items, making missing CRM context explicitly visible.

---

## 📊 Metric Definitions & Denominators

All activity falls on **21 August 2026 in Asia/Kolkata** (`UTC+5:30`):
- **Selected Source Records:** **44** unique records (30 calls, 14 meetings). Keyed strictly by `(source_type, source_id)`.
- **Usable Supplied Text Coverage:**
  - *Initial Batch:* **17 / 44 (38.6%)** [Calls: 10/30 (33.3%), Meetings: 7/14 (50.0%)].
  - *Post-Update:* **18 / 44 (40.9%)** [Calls: 10/30 (33.3%), Meetings: 8/14 (57.1%)].
- **Stored Call Connection Rate:** **11 / 30 (36.7%)**. Numerator = calls where `is_connected === true` (C01-C03, C05-C10, B11, B14); Denominator = 30 calls.
- **Stored Conversation Rate:** **9 / 30 (30.0%)**. Numerator = calls where `is_conversation === true` (C01-C03, C05-C10); Denominator = 30 calls.
- **Person Distinction:** Telephony call reps (Arun, Meera, Kiran, Dev, Leela) are separated from meeting organizers (`team06`–`team12`). Meeting organizers are not assumed to be sales reps or attendees.

---

## 📂 Export Package & Manifest Architecture

Generated outputs are written to `candidate/exports/`:
```
candidate/exports/
├── manifest.json              # Machine-readable JSON manifest
├── manifest.csv               # Machine-readable CSV manifest
├── daily_brief/               # Executive intelligence brief for 21 Aug 2026
│   └── 2026-08-21_manager_brief.md
├── deals/                     # M03 Asterloom, C03 Milan, C04 Lanternpath, M06 Mapletrail
├── coaching/                  # C01 Harborlight, C06 Ravi/Meera mismatch, C09 Vedant
├── partners/                  # M01 Harborpath Advisory, C07 Willowbank Advisory
├── vendors/                   # M02 LedgerBridge E-Invoicing Assessment
├── customer_success/          # M04 Cedarwave Migration Risk, M09 Brookmint Auth
├── product_bugs/              # M07 Willowfield Trust Critical Defects (Rev 2)
├── internal_training/         # M10 Billing Engine Operations Walkthrough
├── outbound_leads/            # C05 StoreHarbor, C08 Raghav, C10 Manufacturing
└── intake_unusable/           # B01-B20 Background Calls, M05/M08/M11-M14 Silent Meetings
```

The manifest includes `record_ref`, `source_type`, `source_id`, `applied_revision`, `routes`, `output_path`, `processing_state`, `manual_override`, `analysis_freshness`, `title_or_rep`, and `has_usable_transcript`.
You can also download this entire structure as a `.zip` archive via the **"📦 Export ZIP"** button in the app.

---

## 📑 Five-Slide Presentation Deck

The 5-slide deck is available in two formats:
1. **Interactive In-App Viewer:** Click the **"📑 5-Slide Presentation"** tab in `candidate/app/index.html`.
2. **Standalone HTML Presentation:** Open `candidate/slides/index.html` (supports arrow keys, fullscreen, and print-to-PDF).
3. **Markdown Text:** Read `candidate/slides/SLIDES.md`.

---

## ⏱️ Development Summary & Disclosure
- **Approximate Time Spent:** ~6.5 hours (data modeling, verification, frontend architecture, and report authoring).
- **AI Tool Usage:** Claude / Gemini / DeepMind Antigravity coding assistant was used for exploratory data extraction, script automation, and UI component synthesis. All claims were verified against raw source text.
- **Known Limitations:** Single-day extract (21 Aug 2026); anonymized phone tokens prevent geo-calling analysis; no authoritative CRM deal stage table supplied.
