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

Seer can surface what a market believes; a useful interface must also show how much that signal deserves to be trusted. Seer Six treats market probabilities as decision inputs, not verdicts. Across all six interfaces, the design puts source status, evidence quality, assumptions, limitations, and human decision authority close to the signal being interpreted.

The experiences are purposefully differentiated: the Overview introduces Seer as one protocol beneath several decision contexts; Market Explorer helps people find and compare records; Deep Forecasts emphasizes multi-outcome structure and outcome-level evidence; Futarchy makes pass/fail scenarios around measurable outcomes easier to compare; Opportunity Markets adds explicit review-priority reasoning without automating the final selection; and Risk Pricing separates reported price, liquidity, volume, and user-defined sensitivity assumptions rather than hiding them inside one opaque score.

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

## Preview image to attach

Attach **one image** for this single claim: the supplied `seer-six-claim-preview.png` (1200×630 PNG) preview sheet composed from desktop browser captures of all six interfaces. Use Poidh's native image uploader rather than pasting a GitHub page into the image field. The bounty says the preview image does not replace the six labelled demo links above.

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

This is a front-end prototype with a read-only live market feed, not a trading terminal. It does not connect a wallet, place orders, execute on-chain transactions, independently verify market resolution, or provide a protocol-security audit. Source prices may be stale or affected by thin liquidity. Observation history represents captured API snapshots, not trades or settlement records. Scenario outcomes and assumptions remain hypothetical; the interface labels missing source fields rather than inventing them.
