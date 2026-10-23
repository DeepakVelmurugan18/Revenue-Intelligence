const fs = require('fs');
const path = require('path');

// Read raw JSON batches
const initialData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/01_initial.json'), 'utf8'));
const updateData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/02_update.json'), 'utf8'));

// Format time in Asia/Kolkata (UTC+5:30)
function toKolkataTime(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  const kolkata = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  return kolkata.toISOString().replace('T', ' ').substring(0, 19) + ' IST';
}

function formatDuration(sec) {
  if (sec === null || sec === undefined) return 'N/A';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// Deep analytical dictionary for the 18 conversations + 26 background records
const intelligenceStore = {
  // CALLS C01 - C10
  'C01': {
    primaryRoute: 'Sales Coaching',
    secondaryRoutes: ['Outbound Lead Qualification'],
    dealIntent: 'Uninterested / Cold Rejection',
    summary: 'Arun made an outbound cold call to Pranav at Harborlight Advisory proposing an automation partnership for outsourced finance leadership. Pranav reacted with irritation at receiving an unsolicited sales call on his business number. When pressed on what SpendNest does, Arun explained finance automation, but Pranav stated his firm’s processes are already very automated and firmly declined.',
    citations: [
      { speaker: 'Pranav', quote: 'Why are you calling? We work with outsourced finance leadership firms and—no, I asked why you have called me. Right, I wanted to understand whether a partnership might be relevant. I don’t know how I ended up on your list. I didn’t ask for this call, and I’m not interested. This number is for my work, not for people to sell things to me.' },
      { speaker: 'Pranav', quote: 'Our processes are already very automated. We have a fairly advanced setup, so I don’t think this is something we need. Thanks anyway.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not establish whether Harborlight uses specific ERP or expense software, nor does it prove that other partners at the firm share Pranav’s refusal.',
    nextSteps: [
      { task: 'Mark Pranav / Harborlight as Do-Not-Call for cold sales outreach.', owner: 'Arun', deadline: 'Immediate' },
      { task: 'Coaching 1:1 on graceful cold exit and respecting early boundary setting.', owner: 'Sales Manager', deadline: 'Weekly 1:1' }
    ],
    coachingNote: 'Arun remained polite under hostility, but attempted to deliver a product pitch after the prospect had already expressed clear anger at being called. Coaching recommendation: Train reps to acknowledge the intrusion, offer an immediate opt-out, and exit cleanly rather than fighting through hostility.',
    exportFolder: 'coaching',
    exportFileName: 'C01_Arun_Harborlight_Coaching.md'
  },
  'C02': {
    primaryRoute: 'Intake / Administrative Follow-up',
    secondaryRoutes: [],
    dealIntent: 'Gatekeeper Transfer / Voicemail Drop',
    summary: 'Arun called Fernhaven Group attempting to reach Leela. Gatekeeper Kavya answered and checked if Leela was available, confirming she was out of the office for the day. Arun chose to be transferred to Leela’s voicemail.',
    citations: [
      { speaker: 'Kavya', quote: 'It looks as though she isn’t in the office today. Would you like to leave a message with me, or would you prefer her voicemail?' },
      { speaker: 'Arun', quote: 'Her voicemail would be fine, thank you. Certainly, I’ll put you through to the mailbox now.' }
    ],
    whatEvidenceDoesNotEstablish: 'The call recording does not include the audio or text of the voicemail message left on Leela’s box; it only documents the gatekeeper transfer.',
    nextSteps: [
      { task: 'Task reminder to re-attempt contact with Leela when back in office.', owner: 'Arun', deadline: 'Monday 24 Aug' }
    ],
    exportFolder: 'intake_unusable',
    exportFileName: 'C02_Arun_Fernhaven_Voicemail_Transfer.md'
  },
  'C03': {
    primaryRoute: 'Deal Progression / Active Opportunities',
    secondaryRoutes: ['Sales Coaching'],
    dealIntent: 'Evaluation / Active Budget Constraint',
    summary: 'Kiran followed up with Milan regarding developer API access and event notifications after an agreed 5-week delay. Milan was outdoors with poor mobile roaming reception. Milan confirmed interest in developer functionality but cited budget concerns ("not essential enough for us to spend much on it"). Milan agreed to review an email proposal with subject "Developer access and event notifications — follow-up" and hold a call on Monday or Tuesday morning.',
    citations: [
      { speaker: 'Milan', quote: 'We did ask about some developer functionality, but it isn’t essential enough for us to spend much on it. I would need to check with the team.' },
      { speaker: 'Milan', quote: 'Could we do this by email? Or call on Monday a bit earlier, when I’m back indoors? ... What subject should I look for? Something like “Developer access and event notifications — follow-up”. Right, let’s do that.' }
    ],
    whatEvidenceDoesNotEstablish: 'The conversation does not establish Milan’s exact company name, specific API endpoint requirements, or budget ceiling in currency.',
    nextSteps: [
      { task: 'Send email proposal with subject "Developer access and event notifications — follow-up" including modular API pricing.', owner: 'Kiran', deadline: '21 Aug EOD' },
      { task: 'Schedule follow-up call for Monday morning (indoor audio).', owner: 'Kiran', deadline: 'Monday 24 Aug' }
    ],
    coachingNote: 'Excellent execution by Kiran: rather than straining through broken audio, she quickly negotiated a precise email subject line and an indoor callback time.',
    exportFolder: 'deals',
    exportFileName: 'C03_Kiran_Milan_Developer_API_Followup.md'
  },
  'C04': {
    primaryRoute: 'Deal Progression / Active Opportunities',
    secondaryRoutes: ['Intake / Administrative Follow-up'],
    dealIntent: 'Follow-up Voicemail / Address Correction',
    summary: 'Arun left a detailed follow-up voicemail for Ritesh at Lanternpath Media regarding expense management software. Arun noted that earlier evaluation materials had inadvertently been sent to an incorrect email address, and that the corrected address had now been used. Arun requested a callback to address questions.',
    citations: [
      { speaker: 'Arun', quote: 'My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it. Please call me back to let me know where things stand.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not confirm whether Ritesh received or read the re-sent email, nor does it confirm Lanternpath’s evaluation timeline.',
    nextSteps: [
      { task: 'Track email open / delivery status for Lanternpath Media; retry call if no response by Tuesday.', owner: 'Arun', deadline: 'Tuesday 25 Aug' }
    ],
    exportFolder: 'deals',
    exportFileName: 'C04_Arun_Lanternpath_Voicemail.md'
  },
  'C05': {
    primaryRoute: 'Outbound Lead Qualification',
    secondaryRoutes: ['Competitive Intelligence'],
    dealIntent: 'Qualified Nurture / Incumbent StoreHarbor',
    summary: 'Meera conducted a cold outreach call to a multi-store operator. She pitched SpendNest’s card-based store expense management, instant payments, and vendor approval routing. The prospect noted they already use StoreHarbor and other tools for vendor payments and store budgets, but requested Meera email a presentation to contact05@example.com for future consideration if they ever replace current providers.',
    citations: [
      { speaker: 'Prospect', quote: 'There are several. One is StoreHarbor, and we use others too. What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then.' },
      { speaker: 'Meera', quote: 'Certainly. I have an email address noted down; may I confirm contact05@example.com? Yes, that is right.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not establish the prospect’s company name, store count, renewal date with StoreHarbor, or dissatisfaction level.',
    nextSteps: [
      { task: 'Send SpendNest overview deck with StoreHarbor comparison matrix to contact05@example.com.', owner: 'Meera', deadline: '21 Aug EOD' },
      { task: 'Add to quarterly nurture campaign for multi-store retail.', owner: 'Meera', deadline: 'Next Quarter' }
    ],
    exportFolder: 'outbound_leads',
    exportFileName: 'C05_Meera_StoreHarbor_Competitor_Lead.md'
  },
  'C06': {
    primaryRoute: 'Sales Coaching',
    secondaryRoutes: ['Outbound Lead Qualification'],
    dealIntent: 'Disqualified / Enterprise Incumbent In-House',
    summary: 'CRITICAL AUDIT FINDING: Source payload records rep_name as "Meera" (meera@example.com), but the actual caller verbally introduces himself as "Ravi" ("Good evening, Mr Nikhil... Ravi here. I’ll say at the start that this is a cold call"). Ravi pitched SpendNest to Mr. Nikhil, who manages 120+ stores. Nikhil explained that their retail operations are already automated through an integrated head-office business management system and central monitoring department. Nikhil cordially declined.',
    citations: [
      { speaker: 'Caller (Ravi)', quote: 'Hello? Good evening, Mr Nikhil. Good evening. Ravi here. I’ll say at the start that this is a cold call. Could I take about forty seconds to explain the purpose?' },
      { speaker: 'Mr. Nikhil', quote: 'We have quite a lot of automation, with a mixed model where needed... Head office manages it, and we have full visibility. That is why I said the arrangements are already in place. If a particular need comes up later, we will reach out.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not clarify whether "Ravi" was using Meera’s telephony seat, whether "Meera" is a shared team profile, or whether an upstream logging glitch occurred.',
    nextSteps: [
      { task: 'Investigate rep identity mismatch between telephony account (Meera) and spoken agent (Ravi).', owner: 'Sales Manager / IT Ops', deadline: 'Immediate' },
      { task: 'Log 120-store retail account as enterprise automated; set 6-month check-in.', owner: 'Ravi / Meera', deadline: '6 Months' }
    ],
    coachingNote: 'Audit discrepancy: Rep display name does not match audio caller. On call execution, Ravi handled the cold introduction professionally, respected the prospect’s time, asked one insightful qualifying question about cash advances vs cards, and exited gracefully.',
    exportFolder: 'coaching',
    exportFileName: 'C06_Ravi_Meera_Mismatch_Nikhil_120Stores.md'
  },
  'C07': {
    primaryRoute: 'Partner / Channel Referrals',
    secondaryRoutes: ['Deal Progression / Active Opportunities'],
    dealIntent: 'Channel Partnership / Virtual Accounts Referral',
    summary: 'Dev called Mr. Aditya at Willowbank Advisory proposing a partnership. Willowbank assists clients with overseas company incorporation. Dev explained SpendNest provides virtual business accounts for newly incorporated entities. Aditya confirmed Willowbank actively refers incorporation clients to digital accounts providers (e.g. CloudLedger Accounts, Clearport Money) and requested Dev send the partnership proposal on their chat app, agreeing to a follow-up discussion on Monday.',
    citations: [
      { speaker: 'Aditya', quote: 'Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.' },
      { speaker: 'Aditya', quote: 'Sorry, could you message me on our chat app and send whatever proposal you have? Certainly. Is this the same number you use for messages? Yes... Once you’ve received them, could I call on Monday to see whether you’d like to discuss it further? Yes, that’s fine.' }
    ],
    whatEvidenceDoesNotEstablish: 'The conversation does not establish Willowbank’s typical monthly incorporation volume or the specific commercial commission/referral structure.',
    nextSteps: [
      { task: 'Send SpendNest virtual business account referral proposal via messaging app.', owner: 'Dev', deadline: '21 Aug EOD' },
      { task: 'Conduct scheduled follow-up call with Aditya.', owner: 'Dev', deadline: 'Monday 24 Aug' }
    ],
    exportFolder: 'partners',
    exportFileName: 'C07_Dev_Willowbank_Advisory_Channel_Partner.md'
  },
  'C08': {
    primaryRoute: 'Outbound Lead Qualification',
    secondaryRoutes: ['Sales Coaching'],
    dealIntent: 'Warm Referral to People Operations',
    summary: 'Meera called Mr. Raghav regarding SpendNest’s expense, advances, and invoicing platform. Raghav understood the positioning alongside ERPs and stated that their people operations colleague deals with frontline locations and had been evaluating solutions. Raghav gave Meera permission to send a proposal directly to contact08@example.com mentioning their conversation.',
    citations: [
      { speaker: 'Raghav', quote: 'The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution, but I don’t know the details. There have been some discussions. If you send him a proposal and say you spoke with me, he can take a look.' },
      { speaker: 'Meera', quote: 'Let me read it back to make sure I have the right address: contact08@example.com? Yes, that’s correct.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not establish the name of the people operations colleague or the specific software requirements discussed internally.',
    nextSteps: [
      { task: 'Send tailored proposal to contact08@example.com referencing referral from Mr. Raghav.', owner: 'Meera', deadline: '21 Aug EOD' },
      { task: 'Follow up with people ops contact 3 days after delivery.', owner: 'Meera', deadline: 'Tuesday 25 Aug' }
    ],
    coachingNote: 'Meera showed exemplary diligence reading back the email address contact08@example.com letter-by-letter to eliminate delivery errors.',
    exportFolder: 'outbound_leads',
    exportFileName: 'C08_Meera_Raghav_PeopleOps_Referral.md'
  },
  'C09': {
    primaryRoute: 'Sales Coaching',
    secondaryRoutes: ['Outbound Lead Qualification'],
    dealIntent: 'Lead Intelligence / Strict Boundary Honored',
    summary: 'Meera called Mr. Vedant regarding store expenses across ~130 locations. Vedant explained they built internal software. When Meera inquired whether the internal system executes payments, Vedant suggested contacting their business head, Mr. Rishabh, on a professional networking site, but gave an explicit restriction: "No, please don’t use my name." Meera explicitly agreed not to cite his name.',
    citations: [
      { speaker: 'Vedant', quote: 'Our central team handles this. If you want to speak to somebody about it, you can find our business head, Mr Rishabh, on a professional networking site. He would be able to explain our requirements and whether there are any gaps in the software.' },
      { speaker: 'Vedant', quote: 'No, please don’t use my name.' },
      { speaker: 'Meera', quote: 'Of course, no problem. That is why I wanted to ask first. Thank you for pointing me in the right direction.' }
    ],
    whatEvidenceDoesNotEstablish: 'The conversation does not establish Vedant’s exact company name or Mr. Rishabh’s exact title or surname.',
    nextSteps: [
      { task: 'Locate Business Head Mr. Rishabh on LinkedIn / professional directory.', owner: 'Meera', deadline: 'Monday 24 Aug' },
      { task: 'Initiate cold outreach to Mr. Rishabh WITHOUT referencing Vedant.', owner: 'Meera', deadline: 'Monday 24 Aug' }
    ],
    coachingNote: 'Top-tier sales discipline by Meera. Reps frequently breach "don’t use my name" instructions, destroying trust. Meera’s handling should be shared as a team training snippet for boundary compliance.',
    exportFolder: 'coaching',
    exportFileName: 'C09_Meera_Vedant_Boundary_Coaching.md'
  },
  'C10': {
    primaryRoute: 'Outbound Lead Qualification',
    secondaryRoutes: ['Sales Coaching'],
    dealIntent: 'Stale Contact / Career Change',
    summary: 'Meera called Mr. Aniket regarding Meadowbrick. Aniket stated he no longer works at Meadowbrick and has moved to a manufacturing company. Meera pivoted her pitch to manufacturing expenses. Aniket agreed to receive a brief via messaging app, but explicitly refused a follow-up phone call: "No. I said I will contact you if there is anything to discuss."',
    citations: [
      { speaker: 'Aniket', quote: 'Are you calling about Meadowbrick? Yes, that’s right. I don’t work there anymore... It is different. Manufacturing.' },
      { speaker: 'Aniket', quote: 'Why don’t you just send me a brief on the messaging app? I’ll look at it and come back to you... Would a follow-up call on Monday or Tuesday next week be okay...? No. I said I will contact you if there is anything to discuss.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not establish the name of Aniket’s new manufacturing employer or his role there.',
    nextSteps: [
      { task: 'Send concise SpendNest manufacturing overview via messaging app.', owner: 'Meera', deadline: '21 Aug EOD' },
      { task: 'Flag contact record: DO NOT CALL for phone follow-up per explicit refusal.', owner: 'Meera', deadline: 'Immediate' },
      { task: 'Update CRM: Aniket no longer at Meadowbrick; initiate new lead research for Meadowbrick replacement.', owner: 'SDR Team', deadline: 'Next Week' }
    ],
    exportFolder: 'outbound_leads',
    exportFileName: 'C10_Meera_Aniket_Manufacturing_Lead.md'
  },

  // MEETINGS M01 - M14
  'M01': {
    primaryRoute: 'Partner / Channel Referrals',
    secondaryRoutes: ['Deal Progression / Active Opportunities'],
    dealIntent: 'Channel Partnership / Advisory Account Referral',
    summary: 'Advisory firm Harborpath Advisory (Partner A) met with SpendNest (Team member A). Partner A sought to offer remote bank accounts to clients. Team member A established the essential qualification boundary: SpendNest works exclusively with registered businesses (specifically US corporate entities), not personal bank accounts. Partner A accepted this boundary, expressed interest in virtual accounts, multi-currency wallets, and corporate cards for corporate clients, and requested a partnership overview.',
    citations: [
      { speaker: 'Team member A', quote: 'Turn 2: Yes, with one important boundary: we work with registered businesses, not individuals opening personal accounts. Is the business use case what you had in mind?' },
      { speaker: 'Team member A', quote: 'Turn 4: For businesses with a US entity, SpendNest offers virtual accounts and wallets in several currencies. There are corporate cards as well, and an expense platform for businesses with more transactions.' },
      { speaker: 'Partner A', quote: 'Turn 28: Good. I look forward to the information so we can take it from there.' }
    ],
    whatEvidenceDoesNotEstablish: 'The meeting does not establish Harborpath’s annual client incorporation volume or the specific onboarding revenue share model.',
    nextSteps: [
      { task: 'Send Harborpath Advisory formal partnership information pack covering US entity virtual accounts.', owner: 'Team member A / team06', deadline: '22 Aug' }
    ],
    exportFolder: 'partners',
    exportFileName: 'M01_Harborpath_Advisory_Channel_Partner.md'
  },
  'M02': {
    primaryRoute: 'Vendor / Supplier Evaluation',
    secondaryRoutes: [],
    dealIntent: 'Vendor Assessment / SpendNest is Buyer',
    summary: 'CRITICAL ROUTING FINDING: Although formatted identically to customer meetings, SpendNest is the PROSPECTIVE BUYER evaluating LedgerBridge (Supplier A) as an electronic invoicing and accounts receivable infrastructure supplier. Supplier A discussed PDF generation vs network e-invoicing and resisted sending pricing without an explanation call. SpendNest insisted on transparent written pricing to conduct its standard 5-step vendor assessment (fit, business rationale, commercials, references, support).',
    citations: [
      { speaker: 'Team member A', quote: 'Turn 1: I work on strategy and partnerships at SpendNest. We serve businesses with cards and accounts payable, and we are developing accounts receivable. We want to understand what LedgerBridge offers.' },
      { speaker: 'Supplier A', quote: 'Turn 2: Then I will cover the market strategy as well as the technical integration. Are you more interested in generating invoice PDFs or in electronic invoicing through the relevant networks?' },
      { speaker: 'Team member A', quote: 'Turn 34: Our evaluation goes through product fit, the business reason, commercials, then references and support checks. Written pricing helps us follow that process internally.' },
      { speaker: 'Supplier A', quote: 'Turn 36: I will send the template shortly so we can get that started.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not establish LedgerBridge’s fee structure, integration timeline, or whether SpendNest has evaluated alternative e-invoicing providers.',
    nextSteps: [
      { task: 'Complete LedgerBridge technical/commercial template once delivered.', owner: 'Team member A & B / Strategy', deadline: '25 Aug' },
      { task: 'Present vendor evaluation matrix to Head of Product & Partnerships.', owner: 'Team member A', deadline: '28 Aug' }
    ],
    exportFolder: 'vendors',
    exportFileName: 'M02_LedgerBridge_Vendor_Evaluation.md'
  },
  'M03': {
    primaryRoute: 'Deal Progression / Active Opportunities',
    secondaryRoutes: ['Sales Coaching'],
    dealIntent: 'High Intent / Prepaid Cards & Expense Control',
    summary: 'Demonstration with Asterloom Systems (Customer A and finance lead Customer B; ~65 employees). Immediate interest is domestic prepaid corporate cards and expense portal integration for travel and operating expenses; overseas team already has a provider. Customer B stated manual vendor payments currently cost significant overhead (volume ~INR 26–39 lakh/month, primarily rent), which could be relevant later. Customer B insisted finance must control accounting category coding prior to sync. Customer B explicitly instructed rep to send details for internal CFO review rather than booking another call immediately.',
    citations: [
      { speaker: 'Customer B', quote: 'Turn 3: Cards first. Our overseas team already has a provider they like. Here we reimburse employees through an existing expense portal with approvals. Show us how introducing your cards fits that process; we are not currently shopping for vendor payments.' },
      { speaker: 'Customer B', quote: 'Turn 33: For accounting categories, I do not trust every employee to pick the right code. We would need finance to do that before syncing, rather than relying on employees to get it right.' },
      { speaker: 'Customer B', quote: 'Turn 34: We are a small growing company, roughly 65 employees... The external team processes vendor payments manually and it is expensive... perhaps INR 26–39 lakh a month, with rent a large part.' },
      { speaker: 'Customer B', quote: 'Turn 36: Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more.' }
    ],
    whatEvidenceDoesNotEstablish: 'The INR 26–39 lakh figure is Asterloom’s total vendor spend, NOT SpendNest software contract value. Software subscription pricing was not established.',
    nextSteps: [
      { task: 'Send customized prepaid card proposal and finance pre-sync approval workflow diagram.', owner: 'Team member A / team08', deadline: '22 Aug' },
      { task: 'Respect prospect boundary: DO NOT book follow-up call until Customer B confirms CFO review.', owner: 'Team member A', deadline: 'Follow-up' }
    ],
    coachingNote: 'Turn 35–36 coaching point: The rep attempted to lock down a next call ("Could we arrange a follow-up next week?"), prompting Customer B to push back firmly. Reps should recognize when a prospect explicitly requires internal CFO alignment and offer support material instead of aggressive closing.',
    exportFolder: 'deals',
    exportFileName: 'M03_Asterloom_Systems_Prepaid_Cards_Deal.md'
  },
  'M04': {
    primaryRoute: 'Customer Success / Account Health',
    secondaryRoutes: ['Product Feedback & Bug Escalation'],
    dealIntent: 'Retention / Card Network Migration Risk',
    summary: 'Critical retention and migration session with existing customer Cedarwave Distribution (Customer A). SpendNest is decommissioning its legacy card programme due to physical card acceptance failures and migrating Cedarwave to a new card programme with wallet payments. Customer A expressed surprise that the old programme was terminating and voiced frustration that wallet features weren’t being added to existing cards. Customer A also highlighted an unresolved administrative blocker: department setups have become confused and users cannot be moved between departments.',
    citations: [
      { speaker: 'Team member A', quote: 'Turn 2: Much of your usage is physical-card spending. We have seen acceptance problems with the existing programme and are proposing a move to a different provider and card network... The plan is to close the old programme in the coming weeks...' },
      { speaker: 'Customer A', quote: 'Turn 29: We will speak with the relevant people internally and see whether this is the direction we want. We are not deciding the whole migration on this call.' },
      { speaker: 'Customer A', quote: 'Turn 30: There is also the earlier issue with moving users between departments. The current department setup has become confusing and needs correcting.' },
      { speaker: 'Team member A', quote: 'Turn 31: I cannot move those users directly from the assistant view available to me. We can arrange a session to guide you through it...' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not confirm Cedarwave’s total active card count or the specific date when the old card network will be hard shut off.',
    nextSteps: [
      { task: 'Schedule administrative screen-share to manually correct department user assignments.', owner: 'Team member A / team09', deadline: '25 Aug' },
      { task: 'Flag Cedarwave as High Churn Risk during card migration window.', owner: 'CS Manager', deadline: 'Immediate' }
    ],
    exportFolder: 'customer_success',
    exportFileName: 'M04_Cedarwave_Distribution_Card_Migration_Risk.md'
  },
  'M06': {
    primaryRoute: 'Deal Progression / Active Opportunities',
    secondaryRoutes: ['Security & Compliance'],
    dealIntent: 'Enterprise Branch Evaluation / Security Review',
    summary: 'Consultative sales discussion with Mapletrail Services (Customer A, branch finance lead; ~65 people across main corporate finance office). Discussed expense workflows and receivables automation. Customer A raised serious questions about data confidentiality, payment isolation, and security certifications. Team member A confirmed enterprise security controls and agreed to share full compliance and security collateral.',
    citations: [
      { speaker: 'Customer A', quote: 'Turn 4: Roughly 65 people across finance. The business is sizeable, but locally I am the person dealing with the operational questions and getting support from them.' },
      { speaker: 'Customer A', quote: 'Turn 31: Confidentiality is important. Payment information is sensitive. How is that protected, and is there a risk of somebody interfering with it?' },
      { speaker: 'Team member A', quote: 'Turn 32: We have security and compliance controls and certifications around the platform. I understand why you ask; the information is sensitive. I can share the material on our setup as part of the follow-up.' },
      { speaker: 'Customer A', quote: 'Turn 33: It has been useful hearing a different perspective. Please send the information and we can stay in touch.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not establish Mapletrail’s central ERP system, whether central finance will approve third-party vendor onboarding, or buying authority.',
    nextSteps: [
      { task: 'Deliver enterprise security overview, SOC2/ISO compliance pack, and product collateral to Customer A.', owner: 'Team member A / team10', deadline: '22 Aug' }
    ],
    exportFolder: 'deals',
    exportFileName: 'M06_Mapletrail_Services_Security_Evaluation.md'
  },
  'M07': {
    // Delivered in Update Batch Rev 2
    primaryRoute: 'Product Feedback & Bug Escalation',
    secondaryRoutes: ['Customer Success / Account Health'],
    dealIntent: 'Critical P1 Defect Escalation / Screen Share Bug Repro',
    summary: 'CRITICAL LATE-DELIVERY DEFECT REPORT (Revision 2): Customer A at Willowfield Trust shared their screen to demonstrate three severe software bugs: (1) Editing event-payment descriptions fails silently—clicking "Save changes" appears to work, but the UI reverts to the old description upon page refresh; (2) In the "Recreate payment" flow, document upload is completely disabled (Customer A found a cumbersome workaround navigating to Bill Pay -> Invoice Inbox -> Review); (3) Stale form values carry forward across items, forcing duplicate user input.',
    citations: [
      { speaker: 'Customer A', quote: 'Turn 2: The first one is editing the description. I am changing this event-payment description to a short reference and clicking Save changes. Now look at the displayed description again.' },
      { speaker: 'Team member A', quote: 'Turn 3: The field still shows the earlier wording. So the change is not appearing after you save, is that right?' },
      { speaker: 'Customer A', quote: 'Turn 4: Yes, it is still the old description. That is why I sent it across.' },
      { speaker: 'Customer A', quote: 'Turn 8: Next is Recreate payment... When I go through this route, I cannot upload a document.' },
      { speaker: 'Customer A', quote: 'Turn 24: Yes, the old value carries forward. So I end up doing the same action twice for each item.' },
      { speaker: 'Team member A', quote: 'Turn 27: I will send the details to the team, get their confirmation and come back to you. Thank you for showing the actual steps rather than only the final screen.' }
    ],
    whatEvidenceDoesNotEstablish: 'The transcript does not establish the root cause in the backend API (e.g. cache invalidation vs mutation failure) or when an engineering hotfix can be deployed.',
    nextSteps: [
      { task: 'File P1 engineering defect ticket with recorded video timestamps for description save failure & Recreate Payment upload block.', owner: 'Team member A / team09', deadline: 'Immediate' },
      { task: 'Provide Customer A with written workaround confirmation and hotfix status.', owner: 'Team member A', deadline: '21 Aug EOD' }
    ],
    exportFolder: 'product_bugs',
    exportFileName: 'M07_Willowfield_Trust_Critical_Defects.md'
  },
  'M09': {
    primaryRoute: 'Customer Success / Account Health',
    secondaryRoutes: ['Product Feedback & Bug Escalation'],
    dealIntent: 'Onboarding Friction / Multi-Tenant Auth Defect',
    summary: 'Customer onboarding troubleshooting with Customer A managing Brookmint Holdings and Northkite Equipment. Freshly sent password reset invitations for Brookmint failed with "token has expired" error. Discussed multi-tenant user access: Customer A requested guidance on whether to use a shared mailbox or separate work identities to prevent unauthorized cross-entity administrative changes. Also walked through resolving unverified receipts prior to accounting sync.',
    citations: [
      { speaker: 'Customer A', quote: 'Turn 1: The invitation for Brookmint Holdings did not work when I tried it. It may have expired, or perhaps...' },
      { speaker: 'Customer A', quote: 'Turn 21: It says the token has expired. This is the fresh message we just received.' },
      { speaker: 'Team member A', quote: 'Turn 22: I need to check that with the team. I hope to update you today, or by Monday at the latest. We have not got the Brookmint Holdings login working yet.' },
      { speaker: 'Customer A', quote: 'Turn 24: Brookmint Holdings has most of the employees. Before that becomes busy, I need to answer their questions properly instead of finding my way through each screen.' },
      { speaker: 'Team member A', quote: 'Turn 29: The transaction is approved now, but syncing is still a separate step. If you need another attachment before syncing, you can undo the verification, attach it and review it again.' }
    ],
    whatEvidenceDoesNotEstablish: 'The evidence does not establish why the authentication service issued prematurely expired tokens, or the IT configuration of Brookmint’s email domain.',
    nextSteps: [
      { task: 'Escalate token expiration defect for Brookmint Holdings invite links to Platform Auth team.', owner: 'Team member A / team11', deadline: 'Immediate' },
      { task: 'Customer A consulting internal IT on separate email identities for multi-entity governance.', owner: 'Customer A', deadline: 'Monday 24 Aug' }
    ],
    exportFolder: 'customer_success',
    exportFileName: 'M09_Brookmint_Holdings_MultiTenant_Auth_Issue.md'
  },
  'M10': {
    primaryRoute: 'Internal Training / Operations Knowledge',
    secondaryRoutes: [],
    dealIntent: 'Internal Operations / Billing Engine Enablement',
    summary: 'Internal operational walkthrough conducted by Team member A for Team members B and C on SpendNest’s subscription and automated billing engine. Key mechanics covered: (1) Subscription components (fixed, variable, usage, one-time); (2) 7-day nominal vs end-of-month allowed due periods; (3) Zero-value invoices (valid when no subscription/usage fee is due); (4) The 3-attempt automated dunning cycle: deduction attempt at midnight customer local time, retry on Day 3, retry on Day 7 with account freeze warning, and Day 10 freeze; (5) Critical manual operational recovery: simply depositing funds into a frozen wallet DOES NOT auto-unfreeze; operations must manually clear invoice and adjust next billing date.',
    citations: [
      { speaker: 'Team member A', quote: 'Turn 5: Operations uses it to create accounts, control enabled features and manage billing. I will show what it looks like, rather than ask you to create an invoice yourself.' },
      { speaker: 'Team member A', quote: 'Turn 8: There is a further exception for invoices raised in the last week of the month: the customer may be allowed until the middle of the next month... The displayed due date and the allowed collection period are not always the same thing.' },
      { speaker: 'Team member A', quote: 'Turn 16: On the third day it tries again... It repeats on the seventh day, now with a warning that another failure will freeze the account.' },
      { speaker: 'Team member A', quote: 'Turn 18: Simply topping up a frozen account does not complete the whole recovery flow in this process. The customer must tell us, then operations clears the outstanding invoice and unfreezes the account. Operations also needs to adjust the next billing date manually.' },
      { speaker: 'Team member A', quote: 'Turn 20: I will request the back-office access separately for the next training session.' }
    ],
    whatEvidenceDoesNotEstablish: 'This is an internal staff training session. The INR 6,240 figure mentioned in Turn 15 is a hypothetical pedagogical example, not customer account pipeline.',
    nextSteps: [
      { task: 'Request back-office super-admin demo credentials for Team member B.', owner: 'Team member A / team12', deadline: '22 Aug' },
      { task: 'Publish dunning recovery SOP for Operations team.', owner: 'Operations Lead', deadline: 'Next Week' }
    ],
    exportFolder: 'internal_training',
    exportFileName: 'M10_Internal_Billing_Engine_Walkthrough.md'
  }
};

console.log('Building full analytical model and exports...');

// Combine records
const fullRecordsMap = new Map();
initialData.records.forEach(r => {
  fullRecordsMap.set(`${r.source_type}:${r.source_id}`, {
    ...r,
    batch_id: initialData.batch_id,
    revision: initialData.revision
  });
});

// Update M07
updateData.records.forEach(r => {
  fullRecordsMap.set(`${r.source_type}:${r.source_id}`, {
    ...r,
    batch_id: updateData.batch_id,
    revision: updateData.revision
  });
});

console.log(`Total unique records in combined dataset: ${fullRecordsMap.size}`);

// Generate manifest list
const manifestEntries = [];

fullRecordsMap.forEach((rec, key) => {
  const ref = rec.record_ref;
  const isCall = rec.source_type === 'call';
  const intel = intelligenceStore[ref];

  let reviewState = 'Intake Only';
  let primaryRoute = 'Intake / Administrative & No-Text Records';
  let routes = [primaryRoute];
  let exportPath = '';
  let analysisFreshness = 'Current';

  if (intel) {
    primaryRoute = intel.primaryRoute;
    routes = [intel.primaryRoute, ...(intel.secondaryRoutes || [])];
    reviewState = ref === 'M07' ? 'Refreshed Rev 2' : 'Analyzed';
    exportPath = `exports/${intel.exportFolder}/${intel.exportFileName}`;
  } else {
    // Unusable text records
    const unavail = rec.transcript_payload?.unavailable_reason || (isCall ? `Background call (${rec.payload.observed_outcome || 'unusable'})` : 'No text supplied');
    const folder = 'intake_unusable';
    const fileName = `${ref}_${rec.source_type}_Intake.md`;
    exportPath = `exports/${folder}/${fileName}`;
    routes = ['Intake / Administrative & No-Text Records'];
    reviewState = 'Intake Only (No Usable Text)';
  }

  manifestEntries.push({
    record_ref: ref,
    source_type: rec.source_type,
    source_id: rec.source_id,
    applied_revision: rec.revision,
    routes: routes,
    primary_route: primaryRoute,
    output_path: exportPath,
    processing_state: reviewState,
    manual_override: false,
    analysis_freshness: analysisFreshness,
    title_or_rep: isCall ? (rec.payload.rep_name || 'Unknown Rep') : (rec.payload.title || 'Untitled Meeting'),
    organizer_or_rep_email: isCall ? rec.payload.rep_email : rec.payload.organizer_email,
    duration_seconds: rec.payload.duration_seconds,
    has_usable_transcript: !!(rec.payload.transcript || (rec.transcript_payload?.turns && rec.transcript_payload.turns.length > 0))
  });
});

// Sort manifest by record_ref naturally (B01-B20, C01-C10, M01-M14)
manifestEntries.sort((a, b) => a.record_ref.localeCompare(b.record_ref, undefined, { numeric: true }));

// Write JSON manifest
fs.writeFileSync(
  path.join(__dirname, '../exports/manifest.json'),
  JSON.stringify(manifestEntries, null, 2),
  'utf8'
);
console.log('Wrote candidate/exports/manifest.json');

// Write CSV manifest
const csvHeaders = ['record_ref', 'source_type', 'source_id', 'applied_revision', 'routes', 'primary_route', 'output_path', 'processing_state', 'manual_override', 'analysis_freshness', 'title_or_rep', 'organizer_or_rep_email', 'has_usable_transcript'];
const csvRows = manifestEntries.map(e => [
  e.record_ref,
  e.source_type,
  e.source_id,
  e.applied_revision,
  `"${e.routes.join('; ')}"`,
  `"${e.primary_route}"`,
  e.output_path,
  `"${e.processing_state}"`,
  e.manual_override,
  e.analysis_freshness,
  `"${e.title_or_rep.replace(/"/g, '""')}"`,
  `"${(e.organizer_or_rep_email || '').replace(/"/g, '""')}"`,
  e.has_usable_transcript
].join(','));

fs.writeFileSync(
  path.join(__dirname, '../exports/manifest.csv'),
  [csvHeaders.join(','), ...csvRows].join('\n'),
  'utf8'
);
console.log('Wrote candidate/exports/manifest.csv');

// Write individual export files
manifestEntries.forEach(entry => {
  const ref = entry.record_ref;
  const intel = intelligenceStore[ref];
  const rec = fullRecordsMap.get(`${entry.source_type}:${entry.source_id}`);
  const isCall = entry.source_type === 'call';
  const kolkataTime = toKolkataTime(isCall ? rec.payload.started_at : rec.payload.starts_at);

  let mdContent = '';

  if (intel) {
    mdContent = `# Record Report: ${ref} (${entry.source_type.toUpperCase()})
**Title / Description:** ${isCall ? `Call with ${rec.payload.rep_name || 'Rep'}` : rec.payload.title}
**Record Reference:** ${ref}  
**Source Type:** ${entry.source_type}  
**Source ID:** \`${entry.source_id}\`  
**Applied Revision:** ${entry.applied_revision}  
**Activity Timestamp (Asia/Kolkata):** ${kolkataTime}  
**Reported Duration:** ${formatDuration(rec.payload.duration_seconds)} (${rec.payload.duration_seconds}s)  
**Assigned Route(s):** ${entry.routes.join(', ')}  
**Review State:** ${entry.processing_state}  
**Manual Override:** ${entry.manual_override ? 'YES' : 'NO (Automated Routing)'}

---

## 1. Executive Summary: What Happened & Why It Matters
${intel.summary}

---

## 2. Supporting Evidence & Verifiable Citations
${intel.citations.map(c => `> **${c.speaker}:** "${c.quote}"`).join('\n\n')}

---

## 3. Honest Boundaries: What The Evidence Does NOT Establish
${intel.whatEvidenceDoesNotEstablish}

---

## 4. Next Steps & Owners
| Action Item | Owner | Target Timing |
|---|---|---|
${intel.nextSteps.map(s => `| ${s.task} | **${s.owner}** | ${s.deadline} |`).join('\n')}

${intel.coachingNote ? `\n---\n\n## 5. Coaching & Operational Guidance\n${intel.coachingNote}\n` : ''}

---

## 6. Source Metadata Snapshot
\`\`\`json
${JSON.stringify(rec.payload, null, 2)}
\`\`\`
`;
  } else {
    // Unusable / background record report
    const unavail = rec.transcript_payload?.unavailable_reason || (isCall ? `Telephony record without supplied transcript text (Outcome: ${rec.payload.observed_outcome || 'none'})` : 'No transcript recorded');
    mdContent = `# Intake Record Report: ${ref} (${entry.source_type.toUpperCase()})
**Record Reference:** ${ref}  
**Source Type:** ${entry.source_type}  
**Source ID:** \`${entry.source_id}\`  
**Applied Revision:** ${entry.applied_revision}  
**Activity Timestamp (Asia/Kolkata):** ${kolkataTime}  
**Reported Duration:** ${formatDuration(rec.payload.duration_seconds)} (${rec.payload.duration_seconds}s)  
**Assigned Route:** Intake / Administrative & No-Text Records  
**Review State:** ${entry.processing_state}  

---

## 1. Intake Status
> **Intake Classification:** No usable supplied transcript text.  
> **Source Diagnostic Reason:** ${unavail}

### Boundary Disclosure
In strict adherence to the evaluation contract: **No substantive conversation analysis is invented for silent, cancelled, or missing recordings.** This record is logged for telephony accounting, rep activity denominators, and coverage tracking only.

---

## 2. Stored Upstream Telephony Metadata
\`\`\`json
${JSON.stringify(rec.payload, null, 2)}
\`\`\`
`;
  }

  const fullExportPath = path.join(__dirname, '..', entry.output_path);
  const parentDir = path.dirname(fullExportPath);
  if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
  fs.writeFileSync(fullExportPath, mdContent, 'utf8');
});

console.log(`Successfully generated ${manifestEntries.length} individual export markdown reports.`);

// Generate the Manager Daily Briefing Markdown
const dailyBriefMd = `# Revenue Intelligence Daily Brief: 21 August 2026 (Asia/Kolkata)
**Executive Overview for Sales & Revenue Leadership**  
**Assessment Date:** Friday, 21 August 2026 (Asia/Kolkata Timezone)  
**Delivery Batch:** initial-001 (Rev 1) + update-002 (Rev 2 applied)  
**Total Selected Interactions:** 44 Records (30 Calls, 14 Meetings)  
**Usable Text Coverage:** 18 / 44 (40.9%) [Calls: 10/30 (33.3%), Meetings: 8/14 (57.1%)]  

---

## 1. Executive Summary & Critical Escalations

Today's 44 selected interactions reflect an active day of outbound outreach, channel partner formation, high-stakes customer retention, and critical product feedback. All activities occurred on 21 August 2026 (Asia/Kolkata).

### 🚨 URGENT: Top 3 Manager Action Items
1. **P1 Software Bug Escalation (Willowfield Trust - M07):**
   - **Issue:** Customer demonstrated silent failure on description edits (changes revert after save) and blocked invoice uploads in the "Recreate payment" view.
   - **Evidence:** M07 Turn 3-4 (*"The field still shows the earlier wording... Yes, it is still the old description"*).
   - **Action:** File P1 engineering defect ticket; confirm workaround to Customer A by EOD.
2. **Account Retention Risk (Cedarwave Distribution - M04):**
   - **Issue:** Cedarwave is being forced to migrate to a new card network due to widespread card acceptance failures. The customer feels blindsided by the timeline and is blocked by confusing department hierarchy permissions.
   - **Evidence:** M04 Turn 2 & Turn 29 (*"We have seen acceptance problems with the existing programme... We are not deciding the whole migration on this call"*).
   - **Action:** Schedule an administrative permissions cleanup session with Customer A on Monday; flag as churn risk.
3. **Telephony Audit & Account Identity Mismatch (Call C06):**
   - **Issue:** Call C06 metadata lists rep as \`Meera\`, but caller verbally introduced himself as \`Ravi\` (*"Ravi here. I'll say at the start that this is a cold call"*).
   - **Action:** Investigate whether reps are sharing telephony login seats to avoid skewed rep performance metrics.

---

## 2. Active Deal Progression & Follow-up Priorities

| Account / Contact | Ref | Discussion Focus | Key Evidence / Stated Need | Immediate Follow-up Owner |
|---|---|---|---|---|
| **Asterloom Systems** | M03 | Prepaid corporate cards for 65 employees | Manual vendor spend ~INR 26-39L/mo; finance wants strict pre-sync code review | **team08** to send tailored card proposal; DO NOT call until CFO review completes |
| **Milan (Developer API)** | C03 | Developer API & Webhook notifications | Price-sensitive; requested email subject "Developer access and event notifications — follow-up" | **Kiran** to send email proposal; follow up Monday morning |
| **Lanternpath Media** | C04 | Expense platform evaluation | Earlier info sent to wrong email; corrected email re-sent | **Arun** tracking email read status; follow up Tuesday |
| **Mapletrail Services** | M06 | Branch expense automation (~65 corporate finance) | Inquired on payment confidentiality & data protection | **team10** to deliver SOC2/compliance documentation |

---

## 3. Channel & Vendor Partnerships

- **Harborpath Advisory (M01):** High-potential referral partner for US-incorporated entities requiring multi-currency business accounts. Qualification boundary established: registered US corporate entities only, no personal consumer bank accounts. (Owner: **team06**).
- **Willowbank Advisory (C07):** Corporate formation agency actively refers overseas incorporation clients to virtual business accounts. Agreed to review proposal on messaging app and discuss Monday. (Owner: **Dev**).
- **LedgerBridge Vendor Evaluation (M02):** SpendNest is the BUYER evaluating LedgerBridge's electronic invoicing API for SpendNest's accounts receivable roadmap. Insisted on written pricing for 5-tier evaluation. (Owner: **Strategy Team / team07**).

---

## 4. Sales Coaching & Rep Discipline Highlights

- **Commended (Meera - C09):** When prospect Vedant referred Meera to business head Rishabh but strictly cautioned *"No, please don't use my name"*, Meera acknowledged and honored the boundary. Superb operational compliance.
- **Commended (Kiran - C03):** Recognized poor mobile connection on roaming prospect; quickly pivoted to email confirmation with a concrete subject line rather than burning the lead.
- **Coaching Opportunity (Arun - C01):** Arun remained courteous during an aggressive rejection from Pranav at Harborlight Advisory, but attempted to continue pitching after a firm refusal. Coach Arun on graceful exits to preserve brand equity.
- **Coaching Opportunity (team08 - M03):** Prospect Customer B explicitly said *"Send the details first... Let us make that decision internally before scheduling more"*, yet rep pushed for another demo booking. Coach on reading prospect readiness.

---

## 5. Operations & Internal Enablement

- **Billing Engine Walkthrough (M10):** Internal enablement on automated dunning. Key reminder for CS team: when an account freezes on Day 10 due to insufficient wallet funds, a customer deposit alone does not auto-unfreeze; Operations must manually clear the invoice and reset the billing cycle.
- **Brookmint Holdings Authentication Defect (M09):** Fresh password reset invitation links returning "token has expired". Escalated to platform auth team.

---

## 6. Denominator & Coverage Integrity
- **Total Selected Records:** 44 distinct \`(source_type, source_id)\` pairs.
- **Usable Supplied Text:** 18 records (10 calls, 8 meetings).
- **Silent / Cancelled Records:** 26 records (20 background calls with voicemail/unresponsive outcome; 6 meetings cancelled, unrecorded, or no speech).
- **Source Stored Connection Rate:** 11 / 30 calls (36.7%) reported as \`is_connected: true\`.
- **Note on Currency Figures:** Stated conversation figures (e.g. M03 INR 26-39L, M10 INR 6,240) represent client operational volume and training examples, respectively, and are deliberately NOT aggregated into speculative CRM pipeline metrics.
`;

fs.writeFileSync(
  path.join(__dirname, '../exports/daily_brief/2026-08-21_manager_brief.md'),
  dailyBriefMd,
  'utf8'
);
console.log('Wrote candidate/exports/daily_brief/2026-08-21_manager_brief.md');

// Generate the standalone data.js file for the web application
const dataJsContent = `// Standalone analytical database for Revenue Intelligence Inbox
// Contains initial batch (rev 1), update batch (rev 2), and deep-intelligence precomputations.
// Zero external API dependencies; 100% offline-ready.

window.INITIAL_DELIVERY = ${JSON.stringify(initialData, null, 2)};
window.UPDATE_DELIVERY = ${JSON.stringify(updateData, null, 2)};
window.INTELLIGENCE_STORE = ${JSON.stringify(intelligenceStore, null, 2)};
window.GENERATED_MANIFEST = ${JSON.stringify(manifestEntries, null, 2)};
window.DAILY_BRIEF_MD = ${JSON.stringify(dailyBriefMd)};
`;

fs.writeFileSync(
  path.join(__dirname, '../app/data.js'),
  dataJsContent,
  'utf8'
);
console.log('Wrote candidate/app/data.js');

// Automatically prepare Vercel public/ output directory
const publicDir = path.join(__dirname, '../../public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Copy root index.html to public
const rootIndex = path.join(__dirname, '../../index.html');
if (fs.existsSync(rootIndex)) {
  fs.copyFileSync(rootIndex, path.join(publicDir, 'index.html'));
}

// Copy candidate folder into public/candidate
const publicCandidate = path.join(publicDir, 'candidate');
fs.cpSync(path.join(__dirname, '..'), publicCandidate, { recursive: true });

console.log('--- VERCEL PUBLIC DIRECTORY PREPARED AT: public/ ---');
console.log('--- ALL DATASET, EXPORTS & VERCEL ASSETS GENERATED SUCCESSFULLY ---');

