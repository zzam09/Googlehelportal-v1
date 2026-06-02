# SpaceX HQ Membership Portal — User Page Export

> Exported from `pages/user.html` and `js/user.js`

## Overview

This document captures the full user-facing membership portal experience on the `pages/user.html` page.
It includes the page structure, visible content, interactive sections, UI states, and client-side behavior from `js/user.js`.

## Page Metadata

- Page title: `SpaceX HQ | Membership Portal`
- Primary purpose: Membership dashboard and upgrade portal for authenticated users.
- Main libraries and resources:
  - Google Fonts (`Inter`, `JetBrains Mono`)
  - Lucide icons via CDN
  - Firebase Firestore client via CDN
  - Supabase / Firebase authentication helpers from local modules

## Header Section

### Brand and Header Layout

- Fixed header with blurred background.
- Centered brand logo image from SpaceX.
- Action menu with two controls:
  - `Toggle Theme`
  - `Sign Out`

### Theme Controls

- Theme persists in `localStorage` under key `spacex_theme`.
- Toggle updates the `html.light` class.
- Header icon switches between sun and moon icons based on theme.

## Main Portal Structure

The page has a single `.portal-container` and uses `.screen` elements to display different user flows.

### Screen 0 — Dashboard

This is the default active view on load.

#### Profile Card

- Profile cover image with gradient overlay.
- User avatar and active status indicator.
- Profile fields populated dynamically:
  - User name
  - Subtitle containing user role and tier label
  - Joined date
- Profile stats:
  - Clearance
  - Status
  - Live system time

#### Restricted Ecosystem Assets

This section is labeled `Restricted Ecosystem Assets`.
It contains four locked asset cards:

1. **Monthly Profits**
   - Description: Automated equity dividends distributed directly to your authenticated wallet monthly.
   - Badge: Yield Distribution

2. **Private Meeting**
   - Description: Personal 1-on-1 strategy session with Elon Musk to discuss mission alignment.
   - Badge: CEO Direct Access

3. **Tesla AI Day**
   - Description: VIP front-row passes to upcoming AI and Robotaxi reveal events at Gigafactory Texas.
   - Badge: Priority Access

4. **Starbase Entry**
   - Description: Full mission control clearance for the next Starship orbital flight test at Boca Chica.
   - Badge: Operational Clearance

#### Upgrade CTA

- Button text: `Upgrade Clearance`
- Clicking this button triggers the upgrade selection flow.

### Screen 1 — Upgrade Selection

This flow presents membership tier plans.

#### Plans

##### Explorer

- Price: `$1,500 / one-time`
- Clearance Level: `Clearance Level 1`
- Description: Entry-level intelligence and ecosystem access for mission observers.
- Features:
  - Weekly mission intelligence briefings
  - Digital VIP credentials & member badge
  - Basic profit distribution participation (0.5% base)
  - Invitation to public SpaceX launch viewings

##### Pioneer

- Price: `$4,000 / one-time`
- Clearance Level: `Clearance Level 2`
- Description: Advanced operational access with guaranteed presence at major hardware reveals.
- Features:
  - Guaranteed VIP passes to Tesla AI Day & Robotaxi events
  - 3× Enhanced monthly profit dividends (1.5% base)
  - Priority seating at Starbase launch events
  - Access to Private Member Discord for Alpha news

##### Vanguard

- Price: `$6,000 / one-time`
- Clearance Level: `Full Operational Clearance`
- Description: The inner circle. Direct engagement with leadership and maximum ecosystem yields.
- Features:
  - Private 1-on-1 Strategy Meeting with Elon Musk
  - Maximum monthly profit dividend tier (3.5% target)
  - Vanguard Council mission voting rights
  - Lifetime VIP access to Starbase Launch Control
  - Limited Edition Titanium Physical Membership Card

#### Validation and Confirmation

- Validation warning displayed when no plan is selected:
  - `Please select a membership level to continue`
- Confirm button text: `Confirm Upgrade`
- Cancel button returns to the dashboard.

### Screen 2 — Progress Screen

- Title: `Syncing Credentials`
- Message: `Establishing secure handshake with SpaceX Neural Link...`
- Animated progress bar and spinner.

### Screen 3 — Payment Screen

#### Enrollment Summary

- Title: `Complete Enrollment`
- Subtitle body text is updated dynamically based on the request.

#### Enrollment Benefits

- A list of selected enrollment benefits renders inside `#enrollment-benefits`.

#### Payment Summary

- Requested Level: dynamic tier name
- Security Status: `PENDING`
- Total Amount Due: dynamic price
- Message: `Based on your selected plan.`

#### Microsoft Teams Authorization

- Button label: `Authorize via Microsoft Teams`
- Redirect URL: `msteams://`
- Confirmation note: `Your information is secure. Our team will confirm your membership within 24 hours of authorization.`

## Interactive Script Behavior (`js/user.js`)

### Authentication and User Session

- Imports from `./auth.js`:
  - `getSession`
  - `isLoggedIn`
  - `clearSession`
- Imports Firestore helpers from `./firebase-config.js`.
- On page load:
  - Shows a loading overlay while fetching profile data.
  - Redirects to `/pages/login.html` if the user is not logged in.
  - Uses query parameter `id` to select a specific member document.

### Firestore Member Lookup

- If `id` exists in the URL:
  - Reads document from Firestore collection `members` with `getDoc`.
  - Shows `Member Not Found` if the document does not exist.
  - Shows `Access denied` in console if email mismatches current session.
- If no `id` is provided:
  - Queries Firestore collection `members` by email.
  - Shows `Profile Not Set Up Yet` if no matching profile exists.

### Error and Fallback States

- `showProfileNotSetup(email)` shows a pending profile card and sign-out action.
- `showNotFound()` shows access denied text and the examined `id`.
- `showFetchError()` shows a generic service unavailable message.

### Page Population Logic

`populatePage(user)` updates the page with Firestore member data:

- `#user-name`
- `#user-subtitle`
- `#user-joined`
- `#user-clearance`
- Dynamic avatar handling if `user.avatarUrl` exists
- Profile cover background defaults to `DEFAULT_BACKGROUND`
- Status updates for `ACTIVE` vs `PENDING`
- Sets page title to `SpaceX HQ | {user.name}`
- Expands the plan card corresponding to the user's tier.

### Selection and Screen Flow

- `selectPlan(id, name, price)` marks a tier card selected.
- `handleUpgradeClick(element)` begins upgrade flow from locked asset clicks.
- `validateAndProceed(button)` ensures a plan is selected before continuing.
- `changeScreen(idx)` swaps visible `.screen` sections.
- `updateClock()` updates `#live-clock` every second.
- `toggleTheme()` toggles dark/light mode and stores choice to `localStorage`.
- `signOut()` clears session state and redirects to login.

### Styling and UI Themes

- Root CSS variables manage theme colors.
- Responsive mobile adjustments for smaller screens.
- Animated interactions for cards, progress bar, and state changes.

## Dynamic Page Constants

- `DEFAULT_BACKGROUND` cover image fallback URL.
- `tierLabels`:
  - Explorer → `Level 1 Applicant`
  - Pioneer → `Level 2 Operator`
  - Vanguard → `Level 3 Vanguard`
- `tierColors`:
  - Explorer → `var(--pending)`
  - Pioneer → `#60a5fa`
  - Vanguard → `var(--gold)`
- `tierPlanIds` maps tier names to card element IDs:
  - `Explorer` → `tier-ex`
  - `Pioneer` → `tier-pi`
  - `Vanguard` → `tier-va`

## Resource and Upload Notes

- This document is saved at `docs/user-portal-documentation.md`.
- A Notion upload helper is provided at `scripts/upload-to-notion.js`.
- The helper can create or update Notion content when valid environment variables are available.

## Source Files

- `pages/user.html`
- `js/user.js`
- `js/auth.js` (authentication helper reference)
- `js/firebase-config.js` (Firestore configuration reference)
