# Revenue Intelligence Inbox: 5-Slide Executive & Technical Deck
**Candidate Assessment Presentation | SpendNest Platform Analysis**  
**Assessment Date:** 21 August 2026 (Asia/Kolkata)  
**Author:** Antigravity AI Engineering & Product Submission  

---

## Slide 1: The Manager Problem & Top Three Findings

### The Problem Solved
Sales & CS managers drown in disjointed signals across telephony systems and video recorders. Upstream tools dump raw recordings, mislabeled classifications (e.g. classifying a vendor evaluation as a deal pitch, or confusing dialer account logins), and late-arriving transcripts. Managers need an intuitive, actionable inbox that separates empirical conversational evidence from upstream assumptions, surfaces coaching & critical deal signals, and handles late-arriving updates without data duplication or loss of manual judgment.

### Top 3 Verifiable Findings

1. **Finding 1: Source Telephony Rep Label vs. Spoken Identity Discrepancy (C06)**
   - **What We Noticed:** The source payload for call `C06` records `rep_name: "Meera"` (`meera@example.com`). However, the audio transcript shows the caller verbally opening with: `"Hello? Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call."`
   - **Source Citation:** Call C06 (Source ID: `12216d5c-e254-52c6-b344-47de4c6e1ae5`): *"Ravi here. I'll say at the start that this is a cold call."*
   - **Product Impact:** We decoupled raw telephony account metadata from analyzed spoken agent identity. The dashboard introduces a discrepancy badge on C06, flags it in the Manager Briefing, and prevents erroneous coaching attribution to Meera.

2. **Finding 2: Misclassified Vendor Evaluation Masquerading as a Deal Demonstration (M02)**
   - **What We Noticed:** Meeting `M02` with LedgerBridge is titled `"LedgerBridge / SpendNest discussion"`. Conventional CRM classifiers treat this as an outbound sales demo. However, transcript analysis proves SpendNest is evaluating LedgerBridge as a 3rd-party electronic invoicing supplier to expand SpendNest’s Accounts Receivable features!
   - **Source Citation:** Meeting M02, Turn 1: Team member A: *"I work on strategy and partnerships at SpendNest... we are developing accounts receivable. We want to understand what LedgerBridge offers."* and Turn 2: Supplier A: *"Then I will cover the market strategy as well as the technical integration."*
   - **Product Impact:** Created a dedicated `"Vendor / Supplier Evaluation"` route. Categorizing M02 as an active opportunity would corrupt sales pipeline forecasts and trigger nonsensical sales coaching for the buyer.

3. **Finding 3: Critical P1 Product Bugs Obscured by Late Transcript Delivery (M07)**
   - **What We Noticed:** In `01_initial.json`, M07 (Willowfield Trust) contained zero turns (`unavailable_reason: "Transcript not included in this delivery..."`). When `02_update.json` delivered revision 2 with 27 turns, screen-sharing revealed two severe software bugs: (a) editing event-payment descriptions fails silently (reverting on refresh), and (b) document upload is disabled in "Recreate payment".
   - **Source Citation:** Meeting M07, Turn 3-4: Team member A: *"The field still shows the earlier wording...?"* / Customer A: *"Yes, it is still the old description."* and Turn 8: Customer A: *"When I go through this route, I cannot upload a document."*
   - **Product Impact:** When the update is applied, M07 automatically transitions to `"Product Bug Escalation"`, generates an engineering reproduction report, and alerts leadership in the Daily Briefing.

---

## Slide 2: Interface Architecture & Deliberately Rejected Choices

### Interface Hierarchy
- **Executive Daily Briefing (21 Aug 2026 Asia/Kolkata):** Synthesizes urgent escalations, deal follow-ups, and rep coaching in one scannable executive overview.
- **Activity & Coverage Cockpit:** Visualizes true volume, distinguishing call reps (Arun, Meera, Kiran, Dev, Leela) from meeting organizers (`team06`–`team12`), with explicit mathematical denominators.
- **Differentiated Routing Streams:** Replaces generic summaries with specialized views (Coaching cards with behavioral guidance; Deal cards with action items; Bug cards with repro steps).
- **Evidence Inspector & Split-Screen Reader:** Turn-by-turn searchable transcripts, click-to-quote citations, and manual route override with persistent audit history.

### The Deliberately Rejected Decision
- **Rejected Alternative:** Automated Pipeline Dollar Forecasting and Win-Probability Scoring based on conversational currency mentions.
- **Why Rejected:** In M03, Customer B mentions *"perhaps INR 26–39 lakh a month"* of manual vendor spend; in M10, Team member A mentions an *"INR 6,240"* subscription deduction. In naive revenue intelligence tools, algorithms extract these numbers as CRM pipeline deal sizes. However, as documented in `DATA_DICTIONARY.md`, the dataset contains no authoritative CRM deal table. The INR 26-39L figure is Asterloom's external vendor payment volume (not SpendNest SaaS ACV), and INR 6,240 is a training illustration.
- **Accepted Trade-off & Resulting Choice:** We deliberately omitted currency-based pipeline totals and algorithmic win rates. Instead, we show honest qualitative interest indicators (e.g. "Prepaid Card Evaluation - High Intent", "API Access - Budget Constrained") and verified operational action items, making missing CRM context explicitly visible.

---

## Slide 3: Routing Taxonomy, Export Design & The Difficult Case

### Specialized Routing Taxonomy
1. **Sales Coaching:** Behavioral reinforcement (C09 honoring boundaries) and correction (C01 cold pushback, M03 premature closing).
2. **Deal Progression / Active Opportunities:** Commercial evaluations with verified next steps (M03, C03, C04, M06).
3. **Partner / Channel Referrals:** Advisory firms referring incorporation clients (M01 Harborpath, C07 Willowbank).
4. **Vendor / Supplier Evaluation:** Inward vendor assessments (M02 LedgerBridge).
5. **Customer Success / Account Health:** Retention risks and operational support (M04 Cedarwave migration, M09 Brookmint auth).
6. **Product Feedback & Bug Escalation:** Engineering defect reports (M07 silent description save failure, M09 expired token).
7. **Internal Training / Operations Knowledge:** Staff enablement (M10 billing engine walkthrough).
8. **Outbound Lead Qualification:** Nurture leads and competitor intelligence (C05 StoreHarbor, C08 Raghav referral, C10).
9. **Intake / Administrative & No-Text Records:** Strict non-hallucinatory logging for silent/cancelled records (B01–B20, M05, M08, M11–M14).

### Export & Manifest Structure
- Outputs are organised into clean semantic directories (`exports/deals/`, `exports/coaching/`, `exports/product_bugs/`, etc.).
- Accompanied by machine-readable `manifest.json` and `manifest.csv` tracking `source_type`, `source_id`, `applied_revision`, `routes`, `output_path`, `processing_state`, `manual_override`, and `analysis_freshness`.
- When multiple routes apply to one record (e.g. M03 is both Deal Progression and Sales Coaching), the primary route defines the home directory, while secondary tags and cross-links prevent context loss.

### The Difficult Case: Meeting M02 (LedgerBridge)
- **The Challenge:** M02 was labeled as a regular SpendNest calendar meeting. Its conversational dynamics mirror a technology demo.
- **Resolution:** Only deep semantic parsing revealed that LedgerBridge is an external vendor pitching SpendNest. Our routing engine routes M02 to `Vendor Evaluation`, protecting sales pipeline data from contamination.

---

## Slide 4: Verification of Numbers & Analytical Grounding

### Denominator & Metric Verification Table
All calculations are strictly verified against the underlying JSON source records:

| Metric | Verified Value | Exact Denominator Definition | Audit Reference |
|---|---|---|---|
| **Total Selected Records** | **44** | Total unique \`(source_type, source_id)\` pairs across all deliveries | Contract rule #1: no duplicate keys |
| **Source Date Range** | **21 Aug 2026** | Timestamps converted to Asia/Kolkata (\`UTC+5:30\`) | All 44 records fall on 2026-08-21 |
| **Initial Usable Coverage** | **17 / 44 (38.6%)** | Records with non-null transcript or turns > 0 in Batch 1 | 10 calls (C01–C10) + 7 meetings |
| **Post-Update Coverage** | **18 / 44 (40.9%)** | Usable records after M07 Rev 2 arrives with 27 turns | 10 calls + 8 meetings (M01-M04, M06, M07, M09, M10) |
| **Stored Connection Rate** | **11 / 30 (36.7%)** | Calls with \`is_connected === true\` / total calls with non-null field | 9 calls from C + B11 & B14 |
| **Stored Conversation Rate** | **9 / 30 (30.0%)** | Calls with \`is_conversation === true\` / total calls (30) | C01, C02, C03, C05, C06, C07, C08, C09, C10 |
| **Rep vs. Organiser Isolation** | **5 Reps, 7 Orgs** | Call \`rep_name\` separated from Meeting \`organizer_email\` | Prevents treating meeting hosts as SDRs |

### Verification of Analytical Conclusions
Every recommendation in the system links directly to an immutable source citation:
- *M03 Turn 36:* Customer B explicitly pauses scheduling until CFO review -> Recommendation: Hold sales calls.
- *M07 Turn 2-4:* Verified screen-share timestamps of description reversion -> Recommendation: P1 Engineering Bug.
- *M10 Turn 16-18:* Verified operational dunning logic -> Recommendation: SOP on manual account recovery.

---

## Slide 5: Trade-offs, AI Usage, Limitations & Future Roadmap

### Technical Trade-offs
1. **Pre-Generated Deep Analytics vs. Live Model Invocations:**
   - *Choice:* Embedded comprehensive, deterministic analytical artifacts for all 44 records.
   - *Rationale:* Eliminates runtime API key dependencies, network latency, and billing costs for reviewers while ensuring 100% reproducible test runs.
2. **Client-Side Replay Engine vs. Heavy Backend Database:**
   - *Choice:* Engineered an in-browser transactional state machine with \`localStorage\` persistence and dynamic ZIP compilation.
   - *Rationale:* Instant, zero-install setup: reviewers can double-click \`index.html\` or run a lightweight web server.

### AI Methodology
- AI was utilized as an analytical accelerator to extract structured entities, cross-reference timeline events, identify conversational contradictions (e.g. C06 Meera vs. Ravi), and construct Markdown reports.
- All extracted claims were verified against raw source text prior to inclusion. No synthetic text or hallucinations were permitted for background records.

### Known Limitations
- Single-day cross-section (21 August 2026); long-term account velocity cannot be verified.
- Phone tokens are non-dialable; true geographic area codes cannot be deduced.
- Caller-to-attendee mapping on meetings relies on contextual clues rather than email attendee lists.

### Next Steps & Production Roadmap
1. **Real-time Webhook Ingestion:** Ingest Gong, Zoom, and Twilio webhooks with idempotency queues.
2. **Bi-directional CRM Sync:** Push verified MEDDPICC action items and coaching notes directly to Salesforce/HubSpot.
3. **Automated Bug Ticket Dispatch:** Convert screen-share bug transcripts (like M07) directly into Jira P1 tickets with turn timestamps.
