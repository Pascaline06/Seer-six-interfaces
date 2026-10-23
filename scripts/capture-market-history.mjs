#!/usr/bin/env node
/**
 * Captures a periodic public Seer API snapshot into a compact, source-labelled archive.
 * Each outcome row carries the normalized source-field envelope and its deterministic SHA-256 fingerprint so a later capture can be diffed.
 * These are scheduled API observations, NOT historical trades or an execution feed.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const ENDPOINT = "https://app.seer.pm/.netlify/functions/markets-search";
const OUTPUT = path.resolve(process.cwd(), "data/market-history.json");
const CHAINS = [100, 10, 8453, 1];
const PER_CHAIN_LIMIT = 8;
const PER_SERIES_LIMIT = 96; // About 48 hours at a 30-minute schedule.
const GLOBAL_LIMIT = 12000;
const SCHEMA_VERSION = 2;

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
function reportedMetric(value) {
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
function sourceText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value).trim();
  if (Array.isArray(value)) return value.map(sourceText).filter(Boolean).join("\n");
  if (typeof value === "object") {
    for (const key of ["text", "criteria", "rules", "resolution", "url", "name", "title", "value"]) {
      if (value[key] !== undefined) { const found = sourceText(value[key]); if (found) return found; }
    }
  }
  return "";
}
function returnedResolutionCriteria(market) {
  for (const field of ["resolutionCriteria", "resolutionRules", "resolutionDescription", "rules", "criteria"]) {
    const text = sourceText(market && market[field]);
    if (text) return { field, text };
  }
  return { field: null, text: null };
}
function reportedSourceUpdatedAt(market) {
  const value = market && (market.updatedAt || market.updated_at || market.lastUpdatedAt || market.lastUpdated || market.last_updated);
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}
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

  async function captureChain(chainId) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          chainsList: [String(chainId)],
          marketStatusList: ["open", "answer_not_final", "in_dispute"],
          limit: PER_CHAIN_LIMIT,
          page: 1,
          orderBy: "liquidityUSD",
          orderDirection: "desc",
          showConditionalMarkets: false
        }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.markets)) throw new Error("response has no markets array");
      const observedAt = new Date().toISOString();
      const markets = payload.markets.filter(m => m && m.id !== null && m.id !== undefined && Number(m.chainId) === Number(chainId));
      if (!markets.length) throw new Error("no market records for requested chain " + chainId);
      return { chainId, observedAt, reportedCount: Number(payload.count) || markets.length, markets };
    } finally {
      clearTimeout(timeout);
    }
  }

  const results = await Promise.allSettled(CHAINS.map(captureChain));
  const chainResponses = [];
  const chainErrors = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") chainResponses.push(result.value);
    else chainErrors.push({ chainId: CHAINS[i], error: result.reason && result.reason.message ? result.reason.message : String(result.reason) });
  }
  if (!chainResponses.length) throw new Error("All per-chain Seer requests failed: " + chainErrors.map(x => x.chainId + ": " + x.error).join("; "));

  const captured = [];
  for (const chainResponse of chainResponses) {
    for (const market of chainResponse.markets) {
      if (!market || market.id === null || market.id === undefined) continue;
      const key = String(market.id);
      const chainId = Number(market.chainId || 0);
      const observedAt = chainResponse.observedAt;
      const outcomes = safeArray(market.outcomes);
      const odds = safeArray(market.odds);
      const rowCount = Math.max(outcomes.length, odds.length);
      const volumeUSD = reportedMetric(market.volumeUSD);
      const liquidityUSD = reportedMetric(market.liquidityUSD);
      const verificationStatus = market.verification && market.verification.status !== undefined ? String(market.verification.status) : null;
      const sourceUpdatedAt = reportedSourceUpdatedAt(market);
      const resolution = returnedResolutionCriteria(market);
      const marketType = String(market.marketType || market.marketFormat || market.marketKind || market.type || "Not returned as a market format");
      const outcomeNames = outcomes.map((value, index) => nameOf(value, index));
      const fingerprintPayload = {
        chainId, marketId: key, marketType, marketStatus: market.status || market.marketStatus || null,
        odds: odds.map(value => value === null || value === undefined || value === "" ? null : normalizePrice(value)),
        outcomeNames, volumeUSD, liquidityUSD, verificationStatus, sourceUpdatedAt,
        resolutionCriteriaField: resolution.field, resolutionCriteria: resolution.text
      };
      const sourceFingerprint = createHash("sha256").update(JSON.stringify(fingerprintPayload)).digest("hex");
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
          sourceMode: "periodic-read-only-api-snapshot",
          snapshotId: chainId + ":" + key + ":" + observedAt,
          marketType, marketStatus: market.status || market.marketStatus || null,
          outcomeCount: outcomes.length, outcomeNames,
          volumeUSD, liquidityUSD, verificationStatus, sourceUpdatedAt,
          resolutionCriteria: resolution.text, resolutionCriteriaField: resolution.field,
          sourceFingerprint
        });
      }
    }
  }
  const observedAt = chainResponses.reduce((latest, row) => !latest || Date.parse(row.observedAt) > Date.parse(latest) ? row.observedAt : latest, null);
  if (!captured.length) throw new Error("The returned market payload had no valid outcome-price observations; archive not modified.");

  const previous = safeArray(existing.samples);
  const samples = compact(previous.concat(captured));
  const archive = {
    schemaVersion: SCHEMA_VERSION,
    collectedAt: observedAt,
    cadence: "approximately every 30 minutes (GitHub Actions schedule; actual timing may drift)",
    sourceEndpoint: ENDPOINT,
    sourceMeaning: "Scheduled browser-independent observations of the Seer public API. Not historical trades, an exchange tape, or executable quotes.",
    captureStatus: chainErrors.length ? "partial" : "all-requested-chains-captured",
    chainsRequested: CHAINS,
    chainsCaptured: chainResponses.map(row => row.chainId),
    chainErrors,
    perChainRequestLimit: PER_CHAIN_LIMIT,
    responseObservations: chainResponses.map(row => ({ chainId: row.chainId, observedAt: row.observedAt, reportedCount: row.reportedCount, returnedRecords: row.markets.length })),
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
