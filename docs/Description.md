## Option 1: The "Problem Solver" (User-Focused)

### Stop Guessing Your Leave Balance

I built **Leave Planner** because I was tired of guessing if I’d have enough accrued leave for my Christmas holiday. HR portals tell you what you have *now*, but they rarely help you visualize what you’ll have *in six months*.

Leave Planner is a privacy-first, browser-based tool that projects your future leave balance. It combines the flexibility of a spreadsheet with the visual power of a line graph. You can set your accrual rate, log future trips, and instantly see if your balance dips below zero.

Crucially, it handles the reality of payroll: if your calculated balance drifts from your actual payslip, you can simply override the numbers for any month, and the system recalculates the future automatically. Best of all, it uses LocalStorage, so your data never leaves your device.

---

## Option 2: The "Feature Breakdown" (Functional)

### A Better Way to Plan Holidays

**Leave Planner** is a Vue.js application designed to bridge the gap between complex HR systems and back-of-the-napkin math.

**Key Features:**
*   **Visual Projections:** An interactive line chart shows your leave burn-down over time, with labels indicating exactly which trips are consuming your balance.
*   **Spreadsheet Power:** A scrollable, month-by-month view allows you to edit opening balances, accruals, and closing balances inline.
*   **Payslip Accuracy:** Supports manual overrides. If your payslip says you have 120 hours, type it in, and the planner adjusts all future projections to match.
*   **Hours & Days:** Tracks leave in hours (for precision) but automatically converts balances to 'Days' based on your configurable working hours.
*   **100% Private:** No servers, no logins. All data persists locally in your browser.

---

## Option 3: The "Technical Stack" (Developer-Focused)

### Building a Serverless Leave Planner with Vue 3

I recently built **Leave Planner**, a Progressive Web App (PWA) designed to help users forecast their holiday balances.

The goal was to create a reactive, spreadsheet-like interface without the overhead of a backend. The app is built with **Vue 3 (Composition API)** and **TypeScript**, using **Pinia** for state management.

The core logic relies on a 'projection engine' composable that iterates through future months, applying accruals and subtracting leave entries while respecting manual user overrides at every step. We used **Chart.js** (via `vue-chartjs` and `chartjs-plugin-datalabels`) to render the balance history and future trends, providing immediate visual feedback. Persistence is handled entirely via the browser's LocalStorage, making the app fast, private, and easy to host on GitHub Pages.
