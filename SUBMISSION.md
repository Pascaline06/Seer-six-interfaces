# Seer Six — Markets for Better Decisions

## Claim title

**Seer Six — Markets for Better Decisions**

## Live demo

https://pascaline06.github.io/Seer-six-interfaces/

## Source repository

https://github.com/Pascaline06/Seer-six-interfaces

## X handle

@Pascaline7933

## Short design rationale

Seer is a two-sided marketplace: information seekers bring questions tied to real decisions, while traders put capital behind forecasts in pursuit of potential profit. The Seer app is designed as an Etherscan-like front door to markets across the ecosystem: one place to discover a question, understand its quoted outcomes and evidence, inspect liquidity and settlement limits, then follow the market into the right decision tool or the official market page. Seer Six treats probabilities as decision inputs, not verdicts, and keeps source facts, personal assumptions and unresolved data gaps distinct.

The six interfaces are designed as a connected decision journey, not six isolated dashboards. The experiences are purposefully differentiated: the Overview introduces Seer as one protocol beneath several decision contexts; Market Explorer helps people find and compare records; Deep Forecasts emphasizes multi-outcome structure and outcome-level evidence; Futarchy makes pass/fail scenarios around measurable outcomes easier to compare; Opportunity Markets adds explicit review-priority reasoning without automating the final selection; and Risk Pricing separates reported price, liquidity, volume, and user-defined sensitivity assumptions rather than hiding them inside one opaque score.

A shared “Asked by / What is priced / Use the signal” strip now appears on the six decision interfaces, giving visitors a common point of orientation before they go deeper. The question is paired with source-returned requester metadata when available, a clearly labelled indicative price, and route-specific guidance on how to interpret the signal. Missing author identity is explicitly shown as missing rather than invented. A one-click handoff opens the same network-qualified market in the Explorer inspector.

## Updated marketplace decision journey

The Market Explorer now treats a market as a two-sided question: an information seeker needs an answer for a decision, while a trader evaluates whether an outcome's price and risk fit their own thesis. The inspector surfaces the question, source-provided question-author/requester metadata, decision context, outcome labels, resolution criteria and authoritative resolution source only when returned by the source or available in source evidence. Where the payload omits those fields, the experience says so instead of inferring a person, motivation, outcome or settlement rule. Information seekers can also save a private decision-context note locally on their own device; it is not submitted to Seer or shared.

A trader-side paper preview translates a source-returned outcome price into a hypothetical position size, slippage-adjusted modeled entry price, estimated shares, modeled payout, net profit after an assumed entry fee, maximum modeled loss and fee-inclusive break-even probability. Editable fee (0–10%) and slippage (0–25%) inputs are scenario assumptions, not an actual Seer/venue fee schedule or executable quote; slippage is a simplified percentage adjustment, not a liquidity- or order-book-based estimate. Spread, price impact, exit/settlement fees, gas, taxes, minimum order sizes and settlement details are not modeled. No wallet is connected and no order is sent. Four market-aware links connect the same network-qualified record to Deep Forecasts, Futarchy, Opportunity Markets and Risk Pricing, giving the Explorer a hub role rather than leaving the market as a standalone card.

## Electric Foundation adaptations

The design keeps a coordinated violet/lavender visual identity, consistent navigation and component language, strong display typography, and compact technical data treatments. It extends the brand kit into an evidence-first analytical system: distinctive visualizations and controls vary by decision context, while the shared shell makes the six interfaces feel like one product.

The deliberate departure is the emphasis on legibility and auditability over a uniform decorative dashboard. Source-backed values are visibly distinguished from local calculations and hypothetical assumptions; unknown fields remain unknown; and the interface avoids presenting popularity as merit or a forecast as certainty. Bricolage Grotesque, DM Sans, and JetBrains Mono were chosen because the supplied kit did not prescribe a typeface.

## Six labelled public demos

1. **Landing page / Overview:** https://pascaline06.github.io/Seer-six-interfaces/#/home
2. **Seer app / Market Explorer:** https://pascaline06.github.io/Seer-six-interfaces/#/app
3. **Deep Forecasts:** https://pascaline06.github.io/Seer-six-interfaces/#/deep
4. **Futarchy:** https://pascaline06.github.io/Seer-six-interfaces/#/futarchy
5. **Opportunity Markets:** https://pascaline06.github.io/Seer-six-interfaces/#/opportunity
6. **Risk Pricing:** https://pascaline06.github.io/Seer-six-interfaces/#/risk

**In-product documentation:** https://pascaline06.github.io/Seer-six-interfaces/#/docs


## What is implemented

- Live, read-only market records from Seer's public market-search endpoint, with connected/fallback states and last-successful snapshot handling.
- Market Wire and homepage Market Tape with market-specific navigation, pause/reduced-motion behavior, and snapshot-based repricing history.
- Market Explorer search, category/network filtering, sorting, pagination, card/table views, watchlist, comparison, and source-aware inspection.
- Source & Provenance Ledger and outcome-level browser/shared scheduled price history with CSV export.
- Source Change Forensics comparing metadata-enriched snapshots of the same market and network.
- Forecast Journal with versioned beliefs, evidence references, user-attested resolution, and Brier scoring after resolution.
- Opportunity Decision Desk with transparent review-priority components and local reviewer notes.
- Futarchy pass/fail what-if scenarios and Opportunity paper-analysis tools; these model user assumptions and do not submit orders.
- Chain-qualified market identity so same-ID records on different networks remain separate across selectors, inspectors, comparison, forecast/review records, and history.
- Responsive layouts, light/dark themes, keyboard-operable controls, and reduced-motion support.

## Accuracy and limitations

The public market-search response may not include a question author, separate intent/context, or explicit resolution criteria for every record. The interface labels those fields as unavailable when they are not returned and does not infer missing details. The trader-side calculator is a hypothetical paper preview derived from displayed outcome prices; it is not an executable quote or order book and omits costs and settlement mechanics.



This is a front-end prototype with a read-only live market feed, not a trading terminal. It does not connect a wallet, place orders, execute on-chain transactions, independently verify market resolution, or provide a protocol-security audit. Source prices may be stale or affected by thin liquidity. Observation history represents captured API snapshots, not trades or settlement records. Scenario outcomes and assumptions remain hypothetical; the interface labels missing source fields rather than inventing them.
