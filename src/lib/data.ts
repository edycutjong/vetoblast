import { supabase } from "./supabase";
import type { Incident, DetectedSecret, ScanMetrics } from "./mock-data";

export interface TerminalEntry {
  time: string;
  type: "block" | "pass" | "scan";
  msg: string;
}

export async function getIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase
    .from("vb_incidents")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((d) => ({
    id: d.id,
    timestamp: d.timestamp,
    agentId: d.agent_id,
    commandAttempted: d.command_attempted,
    threatCategory: d.threat_category as Incident["threatCategory"],
    threatLevel: d.threat_level as Incident["threatLevel"],
    redactedPayload: d.redacted_payload,
    detectedSecrets: (d.detected_secrets as DetectedSecret[]) ?? [],
    status: d.status as Incident["status"],
  }));
}

export async function getMetrics(): Promise<ScanMetrics> {
  const { data, error } = await supabase
    .from("vb_metrics")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    return {
      totalScans: 0,
      totalBlocked: 0,
      totalApproved: 0,
      avgScanLatencyMs: 0,
      falsePositiveRate: 0,
      secretsCaught: 0,
      uptime: "0%",
    };
  }

  return {
    totalScans: data.total_scans,
    totalBlocked: data.total_blocked,
    totalApproved: data.total_approved,
    avgScanLatencyMs: Number(data.avg_scan_latency_ms),
    falsePositiveRate: Number(data.false_positive_rate),
    secretsCaught: data.secrets_caught,
    uptime: data.uptime,
  };
}

export async function getTerminalFeed(): Promise<TerminalEntry[]> {
  const { data, error } = await supabase
    .from("vb_terminal_feed")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((d) => ({
    time: d.time,
    type: d.type as TerminalEntry["type"],
    msg: d.msg,
  }));
}
