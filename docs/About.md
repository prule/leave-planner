I want a web based leave planner, so I can enter:

- leave accrued each month
- leave taken each month
  - description of leave (eg Fiji)

Then I want to see a graph of my leave balance by month.

I should be able to enter future leave I've booked.

The leave balance will show me how much leave I have and I'll be able to see what I'll have in the future in order to plan upcoming holidays.

To keep it simple I think it should use local storage on the browser. It could possibly be implemented as a PWA or a browser extension depending on what makes sense.

It should use Vue.

----

## Technical Plan

### Architecture
- **Framework:** Vue.js 3 (using Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia (for managing leave data and settings)
- **Persistence:** Browser LocalStorage (persisting Pinia state)
- **Charting:** Chart.js (via vue-chartjs) or ApexCharts for the balance graph
- **Styling:** Tailwind CSS (for rapid UI development)
- **Deployment:** PWA (Progressive Web App) to allow installation on devices

### Data Model

We need to store:
1.  **Settings:**
    - `startBalance`: Number (Initial leave balance in **hours**, decimal allowed)
    - `startDate`: Date (When the tracking starts)
    - `defaultAccrualRate`: Number (Default hours accrued per month, used for future projections)
    - `projectionHorizon`: Number (How many months into the future to project, e.g., 12)

2.  **Leave Entries:**
    - `id`: Unique Identifier
    - `startDate`: Date
    - `endDate`: Date
    - `hoursTaken`: Number (Decimal, e.g., 7.6)
    - `description`: String (e.g., "Fiji")

3.  **Monthly Balances:**
    - `month`: String (YYYY-MM)
    - `accrual`: Number (Optional: The actual accrual for this month. If missing, uses `defaultAccrualRate`.)
    - `balance`: Number (Optional: The actual closing balance for this month. If missing, calculated from previous month.)
    - `notes`: String (Optional: Notes for this month)

### Core Features

1.  **Monthly Spreadsheet View (Main Interface):**
    - A table-like view showing a row for each month.
    - **Columns:**
        - **Month:** (e.g., Jan 2024)
        - **Opening Balance:** (Calculated from previous month)
        - **Accrued:** (Editable. Defaults to `defaultAccrualRate`. User can type a new number to set the `accrual` for that month.)
        - **Taken:** (Sum of `Leave Entries` for this month. Clicking it opens the list of leave entries for that month to add/edit/delete.)
        - **Closing Balance:** (Calculated: `Opening + Accrued - Taken`. **Editable**. User can type a new number to set the `balance` for that month.)
    - This view allows "always adjusting/overriding" any figure.

2.  **Leave Management:**
    - Detailed view to add specific leave dates (e.g., "Fiji: Aug 1 - Aug 10").
    - These entries feed into the "Taken" column of the Spreadsheet View.

3.  **Settings View:**
    - Configure the starting balance, **default** monthly accrual rate, and **projection horizon**.
    - **Data Export:** Ability to export all application data (JSON/CSV).

4.  **Dashboard / Visualization:**
    - A Line Graph derived directly from the Monthly Spreadsheet View data.
    - Visualizes the projected balance over time, respecting all manual overrides.

### Logic Flow
1.  **Generate Months:** Start from `startDate` and project into the future based on `projectionHorizon`.
2.  **Calculate Row by Row:**
    - **Opening Balance:** Equals the *Closing Balance* of the previous month.
    - **Accrued:** Use `MonthlyBalances.accrual` if present, otherwise `defaultAccrualRate`.
    - **Taken:** Sum of `hoursTaken` from all `Leave Entries` falling in this month.
    - **Closing Balance:**
        - Check for `MonthlyBalances.balance`. If present, use it (this acts as a reset/correction).
        - Else, calculate: `Opening Balance + Accrued - Taken`.

### Roadmap
1.  **Setup:** Initialize Vue project with Vite, Pinia, and Tailwind.
2.  **Store:** Implement Pinia store with LocalStorage persistence.
3.  **UI - Settings:** Create form to input base settings (including projection horizon).
4.  **UI - Spreadsheet View:** Build the main table interface.
    - Implement display of calculated values.
    - Implement inline editing for "Accrued".
    - Implement inline editing for "Closing Balance".
5.  **UI - Leave Input:** Modal or separate view to manage specific leave entries (feeding the "Taken" column).
6.  **Logic:** Implement the row-by-row calculation engine.
7.  **UI - Chart:** Integrate charting library.
8.  **PWA:** Configure Vite PWA plugin.
