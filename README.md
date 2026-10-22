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
3. **Deep forecasts** — inspect returned outcome prices, available source depth, volume and evidence limits. It does not invent uncertainty ranges when the source payload cannot support them.
4. **Futarchy** — pass/fail scenario comparison around a measurable metric.
5. **Opportunity markets** — forecast estimates separated from human grant review and final decisions.
6. **Risk pricing** — compare observed price, reported liquidity and volume alongside clearly labelled user-defined assumptions; no synthetic security score is presented as fact.

## Evidence-first design

Every interface emphasizes source status, what a signal means, what can distort it, and who retains decision authority. The design avoids presenting a forecast as certainty or using market popularity as a proxy for merit.

## Market exploration interactions

The overview includes a moving Market Wire ticker built from the currently available market records. It provides a manual refresh control and polls the Seer market endpoint every 60 seconds while the page is visible. When two successful snapshots differ, repriced records are briefly highlighted and the wire reports the number of changes observed; it never fabricates trade events or claims to be a WebSocket trade tape. The expandable Movements log retains up to 40 browser-local before/after observations when returned prices change by at least 0.2 percentage points. Entries contain the market and source-observation time; they are snapshot differences, not trades or execution history. The last successful live snapshot is retained when a later refresh fails. The homepage also includes a Signal Desk briefing: its repricing story is populated only from an observed snapshot difference, while its liquidity and volume stories rank the current returned sample. If no movement has been observed, it explains that condition instead of inventing a breaking-news headline.  These summaries are descriptive, not causal explanations. A separate ON AIR / Market Brief ticker scrolls source-backed headlines for the returned sample, observed repricing (or an explicit no-move state), reported liquidity leader, and volume leader. It pauses on hover or keyboard focus and disables motion when reduced motion is requested.

The Market Explorer supports server-side keyword search, category/network filters, sorting and pagination, plus a record inspector for the returned market ID, network, verification state, outcome labels, volume and liquidity. The inspector also builds a browser-local price trace from successful API snapshots captured while the interface is used. It displays no fabricated backfilled series: a chart appears only after at least two valid price observations exist for that market, and the timestamps represent browser observation times rather than exchange trade times. Market records can be saved to a device-local watchlist using browser storage; this list is not account-synced and is not shared across devices. Saved values are snapshots, not a live subscription. Select up to three markets to open a side-by-side comparison of indicative price, volume, reported liquidity, network, verification state, opening time, and returned outcomes. Comparison items are snapshots; the UI explicitly warns that the displayed fields are not execution quotes.

## Data and implementation status

**This remains a front-end prototype with a read-only live market feed.** The overview wire and Market Explorer request market records from Seer's public `markets-search` endpoint (`https://app.seer.pm/.netlify/functions/markets-search`) across Gnosis, Optimism, Base, and Ethereum. The UI shows the last successful fetch time, reports connection/refresh state, retains the last successful snapshot after a transient refresh failure, and labels demo fallback records if no live snapshot has been obtained. Market cards display API-reported outcome prices, lifetime swap volume and liquidity; these fields are not executable quotes and can be stale or thinly traded. The wire is a refresh-based snapshot ticker, not a real-time trade stream.

The Deep page lists returned market records and prices, while any missing outcome range remains undisplayed. Futarchy uses an API-returned market price as a baseline with a user-defined hypothetical shift; it does not claim to estimate a causal effect. The Opportunity page reports market activity in the current response, not the probability that a person or grant should be selected. Risk sliders are user-defined assumptions, not security scores. The homepage summary chart remains illustrative; the Market Explorer trace is separate and uses only observed source snapshots stored locally in this browser. No wallet connection, trade execution, or on-chain action is implemented. Do not use illustrative values for financial, security, funding, or governance decisions.

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
