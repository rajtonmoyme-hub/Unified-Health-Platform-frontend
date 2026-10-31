# Frontend UI & Mobile Responsiveness Rules

Every time a UI component or page is created or modified in this repository:
1. **Mobile-First Responsive Design:**
   - Design for mobile screens (`360px` width) first, then scale up with `sm:`, `md:`, `lg:` breakpoints.
   - Page headers and toolbars must use `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`.
   - Grids must start as single-column on mobile (`grid grid-cols-1 sm:grid-cols-2 ...`).
   - Tables and tab bars must be wrapped in scrollable containers (`overflow-x-auto`) so they never break mobile viewport width.
2. **No Backend Responses or Credentials in UI:**
   - Never render raw API payloads (`JSON.stringify`), database hosts/ports (`127.0.0.1:5433`), database names, or internal role/spec codes in the UI.
3. **Run Automated Check:**
   - Always run `npm run check:ui` after any UI change.

