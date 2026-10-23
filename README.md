# Seer Six — Markets for better decisions

A responsive six-interface concept for the Seer prediction-market ecosystem, with an in-product documentation guide covering each view and its data limitations. The design principle is simple: every market signal should be understandable, traceable, and useful without being mistaken for certainty.

## Preview routes

Once GitHub Pages is enabled, use these direct links:

- Overview: https://pascaline06.github.io/Seer-six-interfaces/#/home
- Market explorer: https://pascaline06.github.io/Seer-six-interfaces/#/app
- Deep forecasts: https://pascaline06.github.io/Seer-six-interfaces/#/deep
- Futarchy: https://pascaline06.github.io/Seer-six-interfaces/#/futarchy
- Opportunity markets: https://pascaline06.github.io/Seer-six-interfaces/#/opportunity
- Risk pricing: https://pascaline06.github.io/Seer-six-interfaces/#/risk
- Documentation: https://pascaline06.github.io/Seer-six-interfaces/#/docs

Public demo base URL (after Pages is enabled): https://pascaline06.github.io/Seer-six-interfaces/

## Six decision contexts and Documentation

The in-product **Documentation** page (`#/docs`) provides a guided explanation of each interface, how to interpret the ticker's update status and controls, theme colors, accessibility behavior, and limits of the read-only prototype.

1. **Overview** — the shared signal and evidence philosophy.
2. **Market explorer** — searchable market records, probabilities, expiry and interpretation guidance.
3. **Deep forecasts** — inspect returned outcome prices, available source depth, volume and evidence limits. It does not invent uncertainty ranges when the source payload cannot support them.
4. **Futarchy** — pass/fail scenario comparison around a measurable metric.
5. **Opportunity markets** — forecast estimates separated from human grant review and final decisions.
6. **Risk pricing** — compare observed price, reported liquidity and volume alongside clearly labelled user-defined assumptions; no synthetic security score is presented as fact.

## Evidence-first design

Every interface emphasizes source status, what a signal means, what can distort it, and who retains decision authority. The design avoids presenting a forecast as certainty or using market popularity as a proxy for merit.

## Market exploration interactions

The shared shell includes a moving Market Wire ticker built from the currently available market records. It offers **Refresh now**, automatically polls the Seer market endpoint about every 60 seconds while the page is visible, and labels the last successful snapshot in local time. When two successful snapshots differ, repriced records are briefly highlighted and the wire reports the number of changes observed; it never fabricates trade events or claims to be a WebSocket trade tape. Each wire row uses a circular market image when the returned record includes `images.market`, with a restrained Seer-style fallback when artwork is unavailable, and keeps the question, indicative price, reported volume and liquidity together. The **Price changes** log appears only once the browser has observed at least one real before/after price change of 0.2 percentage points or more; an empty “0” control is hidden. The browser-local log retains up to 40 observations. Entries contain the market and source-observation time; they are snapshot differences, not trades or execution history. The last successful live snapshot is retained when a later refresh fails. The homepage Signal Desk keeps its descriptive repricing, liquidity and volume summaries, while its moving strip is a market tape rather than a forecast/news ticker: it scrolls actual returned market records, each with circular artwork or fallback, market title, indicative price, reported volume and reported liquidity. Each visible market is a button leading to that exact record's inspector. The visual loop duplicates rows for continuity but removes duplicates from keyboard navigation; the homepage tape pauses on hover or keyboard focus and disables motion when reduced motion is requested. Signal Desk summaries remain descriptive, not causal explanations.

Every moving Market Wire item and homepage Market Tape market is a keyboard-operable entry point: selecting one opens that exact source record in the Market Explorer inspector and scrolls focus to it. The top Market Wire pauses on keyboard focus or when **Pause motion** is selected; pausing animation does not stop source polling. **Refresh now** requests a snapshot immediately. The duplicated visual loop is inert and removed from keyboard navigation, so the motion remains usable rather than decorative. The Market Explorer includes a card layout and a denser terminal-table layout, both backed by the same returned records. The table adds quick scanning for indicative price, lifetime volume, reported liquidity, outcome count, network/category, verification and inspect/compare/save actions. It does not show fabricated daily changes or a fake order book. The Market Explorer supports server-side keyword search, category/network filters, sorting and pagination, plus a record inspector for the returned market ID, network, verification state, outcome labels, volume and liquidity. The inspector now exposes a shared **Source & Provenance Ledger**: schema-versioned evidence records identify the Seer endpoint, record ID, response-observation time, available source update time, outcome structure, source-returned fields, and whether resolution criteria were actually present in the payload. Freshness is explicitly the age of this browser's observation, not a claim about upstream market freshness. Missing volume/liquidity/verification/criteria are shown as missing rather than inferred. The price historian captures valid prices per named outcome, not just the lead outcome, and only plots successful observations—never fabricated backfilled prices. Market records can be saved to a device-local watchlist using browser storage; this list is not account-synced and is not shared across devices. Saved values are snapshots, not a live subscription. Select up to three markets to open a side-by-side comparison of indicative price, volume, reported liquidity, network, verification state, opening time, and returned outcomes. Comparison items are snapshots; the UI explicitly warns that the displayed fields are not execution quotes.

The Opportunity page also includes a **Decision Lab** for eligible two-outcome records. It compares the currently displayed first-outcome price with a user-entered probability estimate and recalculates assumed entry price, share count, gross payout, profit if correct, maximum loss if wrong, and probability-weighted expected P&L. It is a local paper scenario only: no wallet is connected and no orders are sent. Multi-outcome records are deliberately excluded from the binary calculator; fallback demo records are labelled as non-current. The second outcome uses the source-returned price when present and otherwise uses the complement only for an identified two-outcome market. Fees, spread, slippage and settlement mechanics are not modelled.


## Evidence Engine & durable observation history

The Market Explorer inspector's Evidence Engine v1 uses a shared normalized market record and field-level provenance envelope. Source values remain distinct from derived presentation, missing payload fields are not silently filled, and outcome structure is labelled from the record's returned format and outcome list. When matching resolution metadata is absent, the interface says so rather than substituting a generic description as settlement criteria. The displayed freshness status measures elapsed time since the browser received a successful source response; it is not a substitute for an upstream source timestamp.

Price history now combines two clearly labelled layers. The browser captures successful API observations into IndexedDB where available, with a localStorage fallback; this local trace survives reloads on the same device. Separately, the repository's `Capture Seer market history` GitHub Actions workflow samples the public Seer API on an approximately 30-minute schedule and commits a bounded JSON archive at `data/market-history.json`. The inspector attempts to load that shared archive directly from the public repository, then falls back to the same-origin file path if needed. The archive is browser-independent and shared by visitors once published, but schedule timing may drift and coverage is limited to records/outcomes returned by the capture query. Retention is capped at 96 observations per market outcome. A plotted series merges shared scheduled captures with local observations, shows shared points as violet markers, and only draws from observed prices; **Export CSV** includes capture time, outcome, value, and source fields. Neither layer is exchange trade history, a settlement ledger, an executable quote, or a real-time trade stream. The shared archive is a GitHub-backed prototype, not a dedicated production time-series database.


## Forecast journal & opportunity decision desk

The Deep Forecasts interface now includes an explainable signal panel and a private forecast journal. For a discrete source-returned outcome, a reviewer can record a personal probability, thesis and optional evidence note against the current Seer price and its observation timestamp. A later belief is saved as a new journal entry instead of overwriting the previous forecast. Rule-based signals call out the estimate gap (5 percentage points prompts review; 10 points is marked material), missing resolution metadata, unavailable reported volume/liquidity, an aging observation, or a repricing present in captured snapshots. A recorded repricing is an observed before/after difference, not an inferred cause. Scalar markets are kept out of this event-probability journal rather than treating a scalar value as a categorical probability.

An open forecast can be resolved only after the user supplies an HTTP(S) evidence URL and marks whether the selected outcome occurred. The journal labels this resolution user-attested, not independently verified. It computes the mean binary Brier score only over manually resolved entries: \((p-y)^2\), where (p) is the saved probability and (y\) is 1 or 0. Lower is better; no score is displayed before at least one resolution is recorded. Forecast entries and resolutions are held in this browser's local storage.

The Opportunity Markets route now includes a Decision Desk that ranks up to eight live market records by explicit **review urgency**, not by whether an event will happen or whether a person/grant deserves to win. Its displayed score is the sum of four transparent components: observed move (0–40 points, capped at a 10 percentage-point move), missing source fields (0–25: criteria 10, volume 5, liquidity 5, verification 5), outcome-structure complexity (0–15), and observation-age gap (0–20). Each card shows the reasons and component values behind its score. Reviewer status, rationale, current score/reasons at save time, source record and action history are stored locally; they are not synced to an account or shared with other visitors.



## Source Change Forensics & snapshot fingerprints

The collector now writes schema-v2 scheduled observations with the market's returned outcome labels/prices, reported volume and liquidity, verification status, source-updated timestamp when present, market format/status when returned, and resolution criteria only when an explicit criteria/rules field exists. Each scheduled capture computes a SHA-256 fingerprint over a deterministic normalized payload. The Market Explorer inspector's **Source Change Forensics** panel compares the two newest enriched scheduled captures for the same market and chain, including outcome price deltas, reported metadata, criteria availability, and fingerprint change/no-change.

A “not comparable” result is distinct from “unchanged”: the UI will not treat a missing source field in either capture as proof of a change or as proof the rules stayed the same. The fingerprint is a reproducible diff aid—not a digital signature, on-chain attestation, or proof that the upstream source itself is trustworthy. Co-occurring field and price changes are reported side by side; the interface does not claim that one caused the other. Legacy schema-v1 observations remain available for charting but do not contain enough metadata for forensic field comparisons. The expanded CSV contains chain, snapshot ID, schema version, source-reported metadata, criteria field/text, endpoint, URL, and fingerprint alongside the observed price.


## Cross-network identity and per-outcome history

Seer market IDs are not assumed to be globally unique. Where the source returns a usable chain ID, the interface scopes market identity to the combination of **network + market ID**. This identity is carried through selected-market inspectors, comparison state, market watchlist actions, Futarchy and Opportunity selectors, paper-analysis actions, forecast records, Decision Desk annotations, and Market Wire navigation. It prevents an action on one network from silently resolving to a same-ID record on another network.

Price history is tracked per market identity and named outcome. History normalization includes the chain-qualified identity and capture timestamp, so observations that share a market ID and timestamp on different networks remain separate. Source-change forensics compares only metadata-enriched captures for the same market on the same network; missing or incompatible fields are marked not comparable rather than being treated as unchanged. These safeguards improve consistency, but they do not replace validation of the upstream source or turn snapshot history into executed-trade history.


## Data and implementation status

**This remains a front-end prototype with a read-only live market feed.** The overview wire and Market Explorer request market records from Seer's public `markets-search` endpoint (`https://app.seer.pm/.netlify/functions/markets-search`) across Gnosis, Optimism, Base, and Ethereum. The UI shows the last successful fetch time, reports connection/refresh state, retains the last successful snapshot after a transient refresh failure, and labels demo fallback records if no live snapshot has been obtained. Market cards display API-reported outcome prices, lifetime swap volume and liquidity; these fields are not executable quotes and can be stale or thinly traded. The wire is a refresh-based snapshot ticker, not a real-time trade stream.

The Deep page lists returned market records and prices, while any missing outcome range remains undisplayed. Futarchy uses an API-returned market price as a baseline with a user-defined hypothetical shift; it does not claim to estimate a causal effect. The Opportunity page reports market activity in the current response, not the probability that a person or grant should be selected. Risk sliders are user-defined assumptions, not security scores. The homepage summary chart remains illustrative; the Market Explorer trace is separate and uses only observed source snapshots stored locally in this browser. No wallet connection, trade execution, or on-chain action is implemented. Do not use illustrative values for financial, security, funding, or governance decisions.

## Run locally

Open `index.html` in a modern browser. No build step or package installation is required.

## Deploy

In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. The entry file must be named lowercase `index.html` for the default GitHub Pages route. Wait for the Pages deployment to finish before sharing the demo links.

## Poidh submission preview

The Seer bounty asks for **one claim covering all six interfaces** with a preview image attached. The six public interface URLs must still be listed individually in the claim description; the preview image does not replace those links. The native Poidh image uploader accepts JPG/JPEG, PNG, GIF, and WebP, so use the separate `seer-six-claim-preview.png` file supplied with the submission handoff (1200×630 PNG, composed from actual desktop browser captures of the six routes). Upload that PNG through Poidh's normal claim form so Poidh generates the media metadata itself.

The repository's [`preview.svg`](./preview.svg) remains an additional designed concept/social-preview asset; do not assume the claim uploader accepts SVG. Required claim details and the latest claim-ready copy are documented in [`SUBMISSION.md`](./SUBMISSION.md).

## Accessibility and responsive behavior

Includes a skip-to-content link, visible keyboard focus, reduced-motion handling, mobile navigation, responsive layouts, and in-place search filtering.

## Brand direction

Lowercase Seer wordmark, near-black canvas, charcoal surfaces, restrained violet accent, and an evidence-oriented interface language inspired by the supplied Seer reference kit.
