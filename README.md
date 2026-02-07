# Leave Planner

A privacy-first, browser-based tool to help you track your leave balance and plan future holidays with ease.

> Available here, on github pages: https://prule.github.io/leave-planner/

It started as a spreadsheet, and now its an app. Read more [here](docs/ReadMe.md).

![leave planner - main.png](docs/leave%20planner%20-%20main.png)

## Features

*   **Visual Projections:** An interactive line chart shows your leave burn-down over time.
*   **Spreadsheet Power:** A scrollable, month-by-month view allows you to edit opening balances, accruals, and closing balances inline.
*   **Payslip Accuracy:** Supports manual overrides. If your payslip says you have 120 hours, type it in, and the planner adjusts all future projections to match.
*   **Hours & Days:** Tracks leave in hours (for precision) but automatically converts balances to 'Days' based on your configurable working hours.
*   **100% Private:** No servers, no logins. All data persists locally in your browser (LocalStorage).
*   **PWA Support:** Installable as a Progressive Web App on desktop and mobile.

## Installing the App (PWA)

This application is a Progressive Web App (PWA), which means you can install it on your device for an app-like experience (offline access, home screen icon, no browser chrome).

### Desktop (Chrome / Edge)
1.  Navigate to the site in your browser.
2.  Look for the **Install icon** (a monitor with a down arrow) on the right side of the address bar.
3.  Click it and select **Install**.

### Mobile (Android - Chrome)
1.  Navigate to the site in Chrome.
2.  Tap the menu icon (three dots) in the top right.
3.  Select **Add to Home screen** or **Install App**.

### Mobile (iOS - Safari)
1.  Navigate to the site in Safari.
2.  Tap the **Share** button (square with an arrow pointing up) at the bottom.
3.  Scroll down and select **Add to Home Screen**.

## Getting Started (Development)

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/<your-username>/leave-planner.git
    cd leave-planner
    ```

2.  Install dependencies:
    ```sh
    npm install
    ```

3.  Start the development server:
    ```sh
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## Usage

1.  **Configure Settings:** Go to the "Settings" tab to set your Start Date, Starting Balance, Default Accrual Rate, and Hours Per Day.
2.  **Add Leave:** In the "Planner" view, click on the "Taken" column for any month to add leave entries (e.g., "Fiji Trip").
3.  **Override Balances:** If your calculated balance drifts from your actual payslip, simply click on the "Accrued" or "Closing" number in the table and type the correct value.
4.  **Export/Import:** Use the "Export Data" button in Settings to create a backup JSON file of your plan.

## Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

1.  Push your changes to the `main` branch.
2.  The workflow defined in `.github/workflows/deploy.yml` will automatically build and deploy the app to the `gh-pages` branch.
3.  Your site will be live at `https://<your-username>.github.io/leave-planner/`.

## Built With

*   [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
*   [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
*   [Pinia](https://pinia.vuejs.org/) - The intuitive store for Vue.js
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
*   [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting

## License

This project is open source and available under the [MIT License](LICENSE).
