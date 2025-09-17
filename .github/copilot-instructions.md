# RewardMe AI Coding Agent Instructions

## Project Overview
RewardMe is a React.js dashboard for customer rewards, using a JSON server backend (see `db.json`). It calculates and displays reward points for purchases, following specific business rules. The UI provides monthly, total, and transaction-level views with advanced filtering and sorting.

## Architecture & Data Flow
- **Frontend:** React (see `src/`). Main entry: `App.js`.
	- Major UI components: `Header`, `Footer`, `MonthlyRewardsTable`, `TotalRewardsTable`, `TransactionsTable`, all in `src/components/`.
- **Backend:** Mocked with `json-server` (see `db.json`).
- **API Layer:** All data fetching via `src/services/apiService.js` (uses Axios, base URL `http://localhost:3001`).
- **Business Logic:** Reward calculation and data processing in `src/utils/rewardCalculations.js` (pure functions, no mutation).

## Reward Calculation Rules
- 2 points per dollar spent over $100
- 1 point per dollar spent between $50-$100
- No points for purchases under $50
See `Footer.js` and `rewardCalculations.js` for canonical logic.

## Developer Workflows
- **Start full app (frontend + backend):**
	- `npm run start:all` (runs React app and JSON server concurrently)
- **Start only frontend:**
	- `npm start`
- **Start only backend:**
	- `npm run start:server` (JSON server on port 3001)
- **Run tests:**
	- `npm test` (Jest, React Testing Library)
	- `npm run test:coverage` for coverage
- **Lint:**
	- `npm run lint` or `npm run lint:fix`

## Project Conventions & Patterns
- **Table Rendering:** All tables use the reusable `Table` component (`src/components/Table/Table.js`). Columns are defined as arrays of objects with `key`, `label`, and optional `render`/`className`.
- **Data Processing:** All reward calculations and transaction grouping/filtering are done in `rewardCalculations.js` (never in components).
- **Error Handling:** API errors are surfaced in the UI and logged via `src/utils/logger.js`.
- **Testing:**
	- Test data and helpers in `src/utils/testUtils.js`.
	- Unit tests for utilities in `src/utils/__tests__/rewardCalculations.test.js`.
	- Component tests in `src/components/Table/__tests__/Table.test.js`.
- **Server Health:** The app checks backend health on load and every 30s. If offline, a retry button and server start instructions are shown.

## Integration Points
- **API:** All data comes from the local JSON server (`db.json`).
- **No authentication or real backend integration.**

## Examples
- To add a new table view, create a new component in `src/components/`, define columns, and use the `Table` component.
- To change reward logic, update `rewardCalculations.js` and corresponding tests.

---
**For more details, see:**
- `README.md` (project intro)
- `src/utils/rewardCalculations.js` (business logic)
- `src/services/apiService.js` (API layer)
- `src/components/Table/Table.js` (table rendering)
