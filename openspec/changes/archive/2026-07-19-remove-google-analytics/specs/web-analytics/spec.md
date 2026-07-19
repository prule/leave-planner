## ADDED Requirements

### Requirement: Cookieless page-view analytics

The app SHALL collect anonymous page-view analytics using Cloudflare Web Analytics and SHALL NOT use Google Analytics or any other cookie-setting tracking provider.

#### Scenario: Analytics beacon loads on page view

- **WHEN** the app is loaded in a browser
- **THEN** the Cloudflare Web Analytics beacon script (`https://static.cloudflareinsights.com/beacon.min.js`) is requested with the configured site token

#### Scenario: No Google Analytics present

- **WHEN** the deployed `index.html` is inspected
- **THEN** no `gtag.js` script, `dataLayer`, or `gtag(...)` call is present

#### Scenario: No tracking cookies set

- **WHEN** the app is loaded in a browser
- **THEN** no analytics cookies are set by the analytics provider
