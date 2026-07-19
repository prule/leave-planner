## 1. Obtain Cloudflare token

- [x] 1.1 Create a site in Cloudflare dashboard (Analytics & Logs → Web Analytics → Add a site) and copy the beacon token

## 2. Edit index.html

- [x] 2.1 Remove the Google Analytics snippet from `index.html` (the `<!-- Google tag -->` comment, the `gtag.js` `<script async src=...>`, and the inline `dataLayer`/`gtag(...)` block)
- [x] 2.2 Add the Cloudflare Web Analytics beacon `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"75498272fdbf40a5baf663df9cf02333"}'></script>` before `</body>`, using the real token from 1.1

## 3. Verify

- [x] 3.1 Run `npm run build` and confirm no `googletagmanager`/`gtag` references remain in `dist/index.html`
- [ ] 3.2 Load the built app, confirm `beacon.min.js` is requested and no analytics cookies are set
- [ ] 3.3 Deploy (`npm run deploy`) and confirm page views appear in the Cloudflare Web Analytics dashboard
