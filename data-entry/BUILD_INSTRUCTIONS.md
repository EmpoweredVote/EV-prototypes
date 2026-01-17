# Project: Google Sheets Data Entry Frontend

## Overview
Build a React + Vite frontend for volunteer data entry that connects to Google Sheets via Google Apps Script. This is a tool for volunteers to add and review politician stance data on various political issues.

The app will live in the `data-entry/` folder and be deployed on Netlify at `/data-entry/dist/`.

## Tech Stack
- Frontend: React + Vite
- Backend: Google Apps Script (deployed as web app)
- Styling: CSS (use Manrope font, teal #00657c and coral #ff5740 accent colors to match existing site)
- Hosting: Netlify

## Google Sheets Structure

### Politicians Sheet
| Column | Type | Description |
|--------|------|-------------|
| external_id | string | From external system (blank for new entries) |
| full_name | string | Politician's name |
| party | string | Political party |
| office | string | Office they're running for |
| office_level | string | federal / state / municipal / school_district |
| added_by | string | Volunteer who added this politician |
| added_at | string | ISO timestamp |

### Issues Sheet
| Column | Type | Description |
|--------|------|-------------|
| topic_key | string | Unique identifier (e.g., "abortion", "tariffs") |
| title | string | Full title |
| shortTitle | string | Display name |
| startPhrase | string | "The government should..." |
| stance1 | string | Position 1 (most liberal) |
| stance2 | string | Position 2 |
| stance3 | string | Position 3 (moderate) |
| stance4 | string | Position 4 |
| stance5 | string | Position 5 (most conservative) |
| categories | string | Semicolon-separated categories |

### Stances Sheet
| Column | Type | Description |
|--------|------|-------------|
| context_key | string | {external_id or generated_id}|{topic_key} |
| politician_name | string | Denormalized for convenience |
| politician_external_id | string | May be blank for new politicians |
| topic_key | string | Issue key |
| stance | number | 1-5 |
| reasoning | string | Explanation for the stance |
| sources | string | URLs, semicolon-separated |
| status | string | draft / needs_review / approved |
| added_by | string | Current author's name |
| added_at | string | ISO timestamp |
| reviewed_by | string | Comma-separated list of reviewer names |
| review_count | number | Number of approvals (need 2 for approved status) |
| locked_by | string | Volunteer currently editing |
| locked_at | string | ISO timestamp (locks expire after 10 minutes) |

## User Flow

### Volunteer Login
- Simple "Enter your name" input on first visit
- Stored in localStorage, shown in header throughout app
- Volunteer can change their name from the header if needed

### Home Screen (Mode Selector)
Three cards to choose from:
1. **Add Stances** - Fill in missing politician-issue combinations
2. **Review Stances** - Vet entries from other volunteers
3. **Manage Politicians** - Add new politicians or view existing

### Add Stances Mode

**Dashboard:**
- Shows progress stats (drafts, awaiting review, approved counts)
- "Start Working" button

**Work Queue:**
- Lists politicians with incomplete stances
- Each shows: name, party, completion status (e.g., "3 of 8 issues")
- Click a politician to see their issues

**Politician Detail:**
- Lists all issues for selected politician
- Status per issue: ○ Missing / ✎ Your Draft / ⏳ Needs Review / ✓ Approved
- Click an issue to open the Stance Form

**Stance Form:**
- Politician name (read-only)
- Issue title and start phrase displayed
- Stance selector (1-5) showing full text for each option
- Reasoning (textarea)
- Sources (textarea, semicolon-separated URLs)
- Two buttons: "Save Draft" and "Submit for Review"

### Review Stances Mode

**Review Queue:**
- Shows entries where:
  - status = "needs_review"
  - added_by ≠ current volunteer
  - current volunteer NOT in reviewed_by list
  - not locked OR lock expired (> 10 minutes old)
- Each item shows: politician name, issue, current author
- Clicking an item acquires a lock and opens Review Form

**Review Form:**
- Displays current stance, reasoning, sources (read-only initially)
- Two actions:
  - **Approve**: Adds volunteer to reviewed_by, increments review_count. If review_count reaches 2, status becomes "approved"
  - **Edit & Resubmit**: Unlocks fields for editing. On submit, volunteer becomes new author (added_by), review_count resets to 0, reviewed_by clears, status stays "needs_review"

### Manage Politicians Mode

**Politician List:**
- Shows all politicians with party, office, office_level
- Search/filter functionality
- "Add Politician" button

**Add Politician Form:**
- Full name (text input, required)
- Party (dropdown: Democrat, Republican, Independent, Libertarian, Green, Unknown, Other + custom text input if Other selected)
- Office (text input)
- Office level (dropdown: federal, state, municipal, school_district)
- Submit creates politician with external_id blank, added_by = current volunteer

## Review Workflow

DRAFT (volunteer can edit)
│
│ "Submit for Review"
▼
NEEDS_REVIEW (waiting for 2 approvals)
│
├── Reviewer clicks "Approve"
│   └── review_count++, add to reviewed_by
│       └── If review_count >= 2 → status = APPROVED
│
└── Reviewer clicks "Edit & Resubmit"
└── Reviewer edits fields, becomes new added_by
review_count = 0, reviewed_by cleared
status stays NEEDS_REVIEW


## Row Locking

To prevent simultaneous edits:
- When a volunteer opens a row for editing or review, check if locked_by is empty OR locked_at is > 10 minutes ago
- If available: write volunteer's name to locked_by, current timestamp to locked_at
- If locked by someone else recently: show message "Currently being edited by [name]"
- On save/cancel: clear locked_by and locked_at
- Locks auto-expire after 10 minutes

## Google Apps Script Endpoints

Create a single doGet() and doPost() handler that routes based on an "action" parameter.

**GET actions:**
- `getData`: Returns all data from Politicians, Issues, and Stances sheets

**POST actions:**
- `addPolitician`: Add new politician row
- `addStance`: Create new stance (status = draft)
- `updateStance`: Update existing stance
- `submitForReview`: Change status from draft to needs_review
- `acquireLock`: Set locked_by and locked_at
- `releaseLock`: Clear locked_by and locked_at
- `approveReview`: Add to reviewed_by, increment review_count, set approved if count >= 2
- `editAndResubmit`: Update fields, set new author, reset review_count and reviewed_by

## Folder Structure

data-entry/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── config.js              # Apps Script URL goes here
│   ├── api/
│   │   └── sheets.js          # All API calls to Apps Script
│   ├── context/
│   │   └── VolunteerContext.jsx  # Volunteer name state
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── VolunteerLogin.jsx
│   │   ├── ModeSelector.jsx
│   │   ├── AddMode/
│   │   │   ├── AddDashboard.jsx
│   │   │   ├── WorkQueue.jsx
│   │   │   ├── PoliticianDetail.jsx
│   │   │   └── StanceForm.jsx
│   │   ├── ReviewMode/
│   │   │   ├── ReviewQueue.jsx
│   │   │   └── ReviewForm.jsx
│   │   └── ManageMode/
│   │       ├── PoliticianList.jsx
│   │       └── AddPoliticianForm.jsx
│   └── styles/
│       └── index.css
└── dist/                      # Build output


## Vite Configuration

Configure the base path for Netlify deployment:
```js
export default defineConfig({
  plugins: [react()],
  base: '/data-entry/dist/'
})
```

## Additional Requirements
1. Add a link to the main index.html at the repo root pointing to data-entry/dist/
2. Add a _redirects file for Netlify SPA routing in the data-entry folder
3. Include loading states and error handling for all API calls
4. Make the UI mobile-friendly (responsive design)

## Build Order
1. Set up the React + Vite project in data-entry/
2. Create the Google Apps Script code (provide as a separate file I can copy/paste)
3. Build components in this order:
* VolunteerLogin + VolunteerContext
* Header
* ModeSelector
* Add Mode screens (Dashboard → WorkQueue → PoliticianDetail → StanceForm)
* Review Mode screens (ReviewQueue → ReviewForm)
* Manage Politicians screens (PoliticianList → AddPoliticianForm)
4. Add link to main index.html
5. Test the full workflow

Please build this out completely. Start with the Google Apps Script code, then create the React application.