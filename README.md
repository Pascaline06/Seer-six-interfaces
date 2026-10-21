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

**This is a front-end prototype.** Market probabilities, volume, depth, changes, forecasts, risk scores, scenario outcomes and chart points are illustrative. There is currently no live Seer API/subgraph integration, wallet connection, trade execution, or on-chain action. Do not use the sample figures for financial, security, funding, or governance decisions.

The market subgraph and pool/liquidity data must be queried and validated independently before displaying live price/depth values. A market record alone should not be treated as a live price or liquidity source.

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
