#!/usr/bin/env node
/**
 * Captures a periodic public Seer API snapshot into a compact, source-labelled archive.
 * These are scheduled API observations, NOT historical trades or an execution feed.
 */
import fs from "node:fs/promises";
import path from "node:path";

const ENDPOINT = "https://app.seer.pm/.netlify/functions/markets-search";
const OUTPUT = path.resolve(process.cwd(), "data/market-history.json");
const CHAINS = [100, 10, 8453, 1];
const PAGE_LIMIT = 24;
const PER_SERIES_LIMIT = 96; // About 48 hours at a 30-minute schedule.
const GLOBAL_LIMIT = 20000;
const SCHEMA_VERSION = 1;

function normalizePrice(raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 100) return null;
  return n <= 1 ? n * 100 : n;
}
function nameOf(value, index) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object") return String(value.name || value.title || value.outcome || value.label || "Outcome " + (index + 1));
  return "Outcome " + (index + 1);
}
function safeArray(value) { return Array.isArray(value) ? value : []; }
function safeSample(value) {
  if (!value || typeof value.key !== "string" || !value.key || !value.observedAt || !Number.isFinite(Date.parse(value.observedAt))) return false;
  if (!Number.isInteger(Number(value.outcomeIndex)) || Number(value.outcomeIndex) < 0) return false;
  return Number.isFinite(Number(value.p)) && Number(value.p) >= 0 && Number(value.p) <= 100;
}
function compact(samples) {
  const unique = new Map();
  for (const sample of samples) {
    if (!safeSample(sample)) continue;
    const row = { ...sample, p: Number(sample.p), outcomeIndex: Number(sample.outcomeIndex) };
    row.id = String(row.id || row.key + "::" + row.outcomeIndex + "::" + row.observedAt);
    unique.set(row.id, row);
  }
  const sorted = [...unique.values()].sort((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt));
  const counts = new Map(), kept = [];
  for (const row of sorted.reverse()) {
    const series = row.key + "::" + row.outcomeIndex;
    const n = counts.get(series) || 0;
    if (n < PER_SERIES_LIMIT) { kept.push(row); counts.set(series, n + 1); }
  }
  return kept.reverse().slice(-GLOBAL_LIMIT);
}

async function main() {
  let existing = { schemaVersion: SCHEMA_VERSION, collectedAt: null, cadence: "approximately every 30 minutes", sourceEndpoint: ENDPOINT, samples: [] };
  try {
    const parsed = JSON.parse(await fs.readFile(OUTPUT, "utf8"));
    if (parsed && Array.isArray(parsed.samples)) existing = { ...existing, ...parsed };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let response, payload;
  const observedAt = new Date().toISOString();
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        chainsList: CHAINS.map(String),
        marketStatusList: ["open", "answer_not_final", "in_dispute"],
        limit: PAGE_LIMIT,
        page: 1,
        orderBy: "liquidityUSD",
        orderDirection: "desc",
        showConditionalMarkets: false
      }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error("Seer API returned HTTP " + response.status);
    payload = await response.json();
    if (!payload || !Array.isArray(payload.markets)) throw new Error("Seer API returned no markets array");
  } finally {
    clearTimeout(timeout);
  }

  const captured = [];
  for (const market of payload.markets) {
    if (!market || market.id === null || market.id === undefined) continue;
    const key = String(market.id);
    const chainId = Number(market.chainId || 0);
    const outcomes = safeArray(market.outcomes);
    const odds = safeArray(market.odds);
    const rowCount = Math.max(outcomes.length, odds.length);
    for (let i = 0; i < rowCount; i++) {
      const p = normalizePrice(odds[i]);
      if (p === null) continue;
      const outcomeName = nameOf(outcomes[i], i);
      const id = key + "::" + i + "::" + observedAt;
      captured.push({
        id, key, title: String(market.marketName || "Untitled market"),
        chain: ({ 100: "Gnosis", 10: "Optimism", 8453: "Base", 1: "Ethereum" })[chainId] || ("Chain " + chainId),
        chainId, outcomeIndex: i, outcomeName, p, observedAt,
        source: "seer-scheduled-capture", sourceEndpoint: ENDPOINT,
        marketUrl: String(market.url || ""), schemaVersion: SCHEMA_VERSION,
        sourceMode: "periodic-read-only-api-snapshot"
      });
    }
  }
  if (!captured.length) throw new Error("The returned market payload had no valid outcome-price observations; archive not modified.");

  const previous = safeArray(existing.samples);
  const samples = compact(previous.concat(captured));
  const archive = {
    schemaVersion: SCHEMA_VERSION,
    collectedAt: observedAt,
    cadence: "approximately every 30 minutes (GitHub Actions schedule; actual timing may drift)",
    sourceEndpoint: ENDPOINT,
    sourceMeaning: "Scheduled browser-independent observations of the Seer public API. Not historical trades, an exchange tape, or executable quotes.",
    retention: { maxObservationsPerMarketOutcome: PER_SERIES_LIMIT, maxObservationsTotal: GLOBAL_LIMIT },
    marketsCaptured: new Set(captured.map(x => x.key)).size,
    observationsAdded: captured.length,
    samples
  };
  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  const temp = OUTPUT + ".tmp";
  await fs.writeFile(temp, JSON.stringify(archive, null, 2) + "\n", "utf8");
  await fs.rename(temp, OUTPUT);
  console.log(JSON.stringify({
    capturedAt: observedAt,
    marketsCaptured: archive.marketsCaptured,
    observationsAdded: captured.length,
    totalObservations: samples.length,
    collectedAt: archive.collectedAt,
    output: path.relative(process.cwd(), OUTPUT)
  }, null, 2));
}
main().catch(error => { console.error("Market history capture failed:", error && error.message ? error.message : error); process.exitCode = 1; });
