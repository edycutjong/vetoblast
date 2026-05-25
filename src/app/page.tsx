"use client";

import { useState, useEffect } from "react";
import {
  type Incident,
  type ScanMetrics,
} from "@/lib/mock-data";
import { getIncidents, getMetrics, getTerminalFeed, type TerminalEntry } from "@/lib/data";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function threatColor(level: string) {
  if (level === "critical") return "text-red-400";
  if (level === "high") return "text-orange-400";
  if (level === "medium") return "text-amber-400";
  return "text-emerald-400";
}

function threatBadge(level: string) {
  if (level === "critical") return "bg-red-500/20 text-red-300 border-red-500/30";
  if (level === "high") return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  if (level === "medium") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
}

/* ── Risk Speedometer ── */
function RiskGauge({ blocked, total }: { blocked: number; total: number }) {
  const pct = (blocked / total) * 100;
  return (
    <div className="glass-card p-5 flex flex-col items-center">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-low)] mb-3">
        THREAT INTERCEPT RATE
      </span>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="8"
            strokeDasharray={`${pct * 3.14} ${314 - pct * 3.14}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-red-400">{blocked}</span>
          <span className="text-[10px] font-mono text-[var(--text-low)]">BLOCKED</span>
        </div>
      </div>
      <span className="text-xs font-mono text-[var(--text-mid)] mt-2">
        of {total.toLocaleString()} total scans
      </span>
    </div>
  );
}

/* ── Terminal Feed ── */
function TerminalStream({ feed }: { feed: TerminalEntry[] }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-mono text-[var(--text-mid)]">vetoblast-proxy — live</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <div className="p-4 font-mono text-[11px] leading-6 max-h-[320px] overflow-y-auto bg-black/30">
        {feed.map((entry, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[var(--text-low)] min-w-[60px]">{entry.time}</span>
            <span className={cn(
              entry.type === "block" ? "text-red-400" :
              entry.type === "scan" ? "text-cyan-400" : "text-emerald-400"
            )}>
              {entry.msg}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[var(--primary)]">$</span>
          <span className="w-2 h-4 bg-[var(--primary)] animate-pulse-danger" />
        </div>
      </div>
    </div>
  );
}

/* ── Incident Detail Panel ── */
function IncidentDetail({
  incident,
  decision,
  onApprove,
  onReject,
}: {
  incident: Incident;
  decision: "approved" | "rejected" | null;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className={cn("glass-card overflow-hidden", incident.threatLevel === "critical" && "border-red-500/30")}>
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {incident.status === "vetoed" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          <span className="text-sm font-semibold text-[var(--text-high)]">{incident.id}</span>
          <span className={cn("text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border", threatBadge(incident.threatLevel))}>
            {incident.threatLevel}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-low)]">{incident.agentId}</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Command */}
        <div>
          <span className="text-[10px] font-mono text-[var(--text-low)] block mb-1">INTERCEPTED COMMAND</span>
          <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-red-300 border border-red-500/20">
            $ {incident.commandAttempted}
          </div>
        </div>

        {/* Redacted */}
        <div>
          <span className="text-[10px] font-mono text-[var(--text-low)] block mb-1">REDACTED PAYLOAD</span>
          <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-cyan-300 border border-cyan-500/20">
            {incident.redactedPayload}
          </div>
        </div>

        {/* Detected Secrets */}
        {incident.detectedSecrets.length > 0 && (
          <div>
            <span className="text-[10px] font-mono text-red-400 block mb-2">DETECTED SECRETS</span>
            {incident.detectedSecrets.map((s, i) => (
              <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-red-300 font-bold">{s.type}</span>
                  <span className="text-[var(--text-low)]">confidence: {(s.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex gap-4 text-[11px] font-mono">
                  <span className="text-[var(--text-low)]">entropy: <span className={threatColor(s.entropy > 4.5 ? "critical" : "medium")}>{s.entropy.toFixed(2)}</span></span>
                  <span className="text-[var(--text-low)]">replaced: <span className="text-cyan-400">{s.redacted}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onApprove}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-mono border transition-colors",
              decision === "approved"
                ? "bg-emerald-500/40 text-emerald-300 border-emerald-500/60"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
            )}
          >
            {decision === "approved" ? "APPROVED ✓" : "APPROVE"}
          </button>
          <button
            onClick={onReject}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-mono border transition-colors",
              decision === "rejected"
                ? "bg-red-500/40 text-red-300 border-red-500/60"
                : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
            )}
          >
            {decision === "rejected" ? "REJECTED ✗" : "REJECT"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-[var(--text-low)] animate-pulse">
        Loading from Supabase...
      </span>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [metrics, setMetrics] = useState<ScanMetrics | null>(null);
  const [terminalFeed, setTerminalFeed] = useState<TerminalEntry[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [incData, metricsData, feedData] = await Promise.all([
        getIncidents(),
        getMetrics(),
        getTerminalFeed(),
      ]);
      setIncidents(incData);
      setMetrics(metricsData);
      setTerminalFeed(feedData);
      if (incData.length > 0) setSelectedIncident(incData[0]);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !metrics || !selectedIncident) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div style={{ display: "none" }} className={cn(threatColor("high"), threatColor("low"))} />
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img src="/icon.svg" alt="VetoBlast" className="w-full h-full" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text-high)]">VetoBlast</h1>
          <span className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse-danger">
            ZERO-TRUST MODE
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400">PROXY ACTIVE</span>
          </span>
          <div className="h-3 w-px bg-[var(--border)]" />
          <span className="text-[var(--text-low)]">DeBERTa-Sec LOADED</span>
          <div className="h-3 w-px bg-[var(--border)]" />
          <span className="text-[var(--text-low)]">Latency: {metrics.avgScanLatencyMs}ms</span>
        </div>
      </header>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 p-6">
        {[
          { label: "Total Scans", value: metrics.totalScans.toLocaleString(), accent: false },
          { label: "Threats Blocked", value: String(metrics.totalBlocked), accent: true, color: "text-red-400" },
          { label: "Secrets Caught", value: String(metrics.secretsCaught), accent: true },
          { label: "Approved", value: metrics.totalApproved.toLocaleString(), accent: false },
          { label: "Scan Latency", value: `${metrics.avgScanLatencyMs}ms`, accent: false },
          { label: "False Positive", value: `${(metrics.falsePositiveRate * 100).toFixed(1)}%`, accent: false },
          { label: "Uptime", value: metrics.uptime, accent: false },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-low)] block mb-1">
              {s.label}
            </span>
            <span className={cn(
              "text-xl font-bold",
              s.accent ? (s.color || "text-[var(--primary)]") : "text-[var(--text-high)]"
            )}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 pb-8">
        {/* Left: Incident List + Terminal */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)]">
              Incident Log
            </h2>
            <span className="text-[10px] font-mono text-red-400">{incidents.filter(i => i.status === "vetoed").length} vetoed</span>
          </div>
          {incidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={cn(
                "glass-card p-4 text-left w-full transition-all duration-200 hover:border-red-500/30",
                selectedIncident.id === inc.id && "border-red-500/40 glow-red"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[var(--text-high)]">{inc.id}</span>
                <span className={cn("text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border", threatBadge(inc.threatLevel))}>
                  {inc.threatLevel}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[var(--text-mid)] truncate mb-1">
                $ {inc.commandAttempted}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-low)]">
                <span>{inc.agentId}</span>
                <span className={
                  decisions[inc.id] === "rejected" || (!decisions[inc.id] && inc.status === "vetoed")
                    ? "text-red-400" : "text-emerald-400"
                }>
                  {decisions[inc.id] ? decisions[inc.id].toUpperCase() : inc.status.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Center: Incident Detail */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <IncidentDetail
            incident={selectedIncident}
            decision={decisions[selectedIncident.id] ?? null}
            onApprove={() => setDecisions(prev => ({ ...prev, [selectedIncident.id]: "approved" }))}
            onReject={() => setDecisions(prev => ({ ...prev, [selectedIncident.id]: "rejected" }))}
          />
          <TerminalStream feed={terminalFeed} />
        </div>

        {/* Right: Gauge + Agent Info */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <RiskGauge blocked={metrics.totalBlocked} total={metrics.totalScans} />

          {/* Active Agents */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)] mb-3">
              Monitored Agents
            </h3>
            <div className="space-y-3">
              {[
                { name: "copilot-agent-v1", scans: 823, blocked: 12, status: "active" },
                { name: "cursor-agent-v3", scans: 612, blocked: 8, status: "active" },
                { name: "aider-agent-v2", scans: 412, blocked: 3, status: "idle" },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      a.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-[var(--text-low)]"
                    )} />
                    <span className="text-[var(--text-high)]">{a.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-low)]">{a.scans} scans</span>
                    <span className="text-red-400">{a.blocked} blocked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scan Configuration */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)] mb-3">
              Scanner Config
            </h3>
            <div className="space-y-2 text-[11px] font-mono">
              {[
                { key: "Model", val: "DeBERTa-Sec-ONNX" },
                { key: "Entropy Threshold", val: "4.0" },
                { key: "Scan Mode", val: "In-Flight" },
                { key: "Block Patterns", val: "rm -rf, chmod 777, DROP" },
                { key: "Proxy Port", val: ":8443" },
              ].map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[var(--text-low)]">{c.key}</span>
                  <span className="text-[var(--text-high)]">{c.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-4 flex items-center justify-between text-[10px] font-mono text-[var(--text-low)]">
        <span>© 2026 VetoBlast — Built for UOE Summer of Code 2026</span>
        <span>Zero-Trust • Local DeBERTa-Sec • node-pty Terminal Proxy • 100% Client-Side</span>
      </footer>
    </div>
  );
}
