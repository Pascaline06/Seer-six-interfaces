# Seer Six — Markets for better decisions

A responsive six-interface concept for the Seer prediction-market ecosystem. The design principle is simple: every market signal should be understandable, traceable, and useful without being mistaken for certainty.

## Preview routes

Once GitHub Pages is enabled, use these direct links:

- Overview: https://pascaline06.github.io/Seer-six-interfaces/#/home
- Market explorer: https://pascaline06.github.io/Seer-six-interfaces/#/app
- Deep forecasts: https://pascaline06.github.io/Seer-six-interfaces/#/deep
- Futarchy: https://pascaline06.github.io/Seer-six-interfaces/#/futarchy
- Opportunity markets: https://pascaline06.github.io/Seer-six-interfaces/#/opportunity
- Risk pricing: https://pascaline06.github.io/Seer-six-interfaces/#/risk

Public demo base URL (after Pages is enabled): https://pascaline06.github.io/Seer-six-interfaces/

## Six decision contexts

1. **Overview** — the shared signal and evidence philosophy.
2. **Market explorer** — searchable market records, probabilities, expiry and interpretation guidance.
3. **Deep forecasts** — multi-outcome comparisons, uncertainty ranges and evaluator evidence.
4. **Futarchy** — pass/fail scenario comparison around a measurable metric.
5. **Opportunity markets** — forecast estimates separated from human grant review and final decisions.
6. **Risk pricing** — multidimensional risk assumptions, loss severity and liquidity comparison.

## Evidence-first design

Every interface emphasizes source status, what a signal means, what can distort it, and who retains decision authority. The design avoids presenting a forecast as certainty or using market popularity as a proxy for merit.

## Data and implementation status

**This remains a front-end prototype, now with a read-only live market feed.** The market explorer requests market records from Seer's public `markets-search` endpoint (`https://app.seer.pm/.netlify/functions/markets-search`) across Gnosis, Optimism, Base, and Ethereum. The UI shows the last successful fetch time, reports the source state, and labels demo fallback records when the endpoint is unavailable. Market cards display API-reported outcome prices, lifetime swap volume and liquidity; these fields are not executable quotes and can be stale or thinly traded.

Deep forecasts, futarchy scenarios, opportunity-selection estimates, risk scores, and the plotted historical line remain illustrative. No wallet connection, trade execution, or on-chain action is implemented. Do not use illustrative values for financial, security, funding, or governance decisions.

## Run locally

Open `index.html` in a modern browser. No build step or package installation is required.

## Deploy

In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. The entry file must be named lowercase `index.html` for the default GitHub Pages route. Wait for the Pages deployment to finish before sharing the demo links.

## Submission preview image

The repository includes [`preview.svg`](./preview.svg), a 1200×630 concept image for the submission card/social preview. Capture a real browser screenshot of the deployed interface as the primary visual if the submission specifically requires an in-product screenshot.

## Accessibility and responsive behavior

Includes a skip-to-content link, visible keyboard focus, reduced-motion handling, mobile navigation, responsive layouts, and in-place search filtering.

## Brand direction

Lowercase Seer wordmark, near-black canvas, charcoal surfaces, restrained violet accent, and an evidence-oriented interface language inspired by the supplied Seer reference kit.
