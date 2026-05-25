VetoBlast — Zero-Trust AI Agent Command Interceptor.

Every AI coding agent you use — Copilot, Cursor, Aider — has full access to your terminal. One hallucinated command can leak your production API keys, wipe your database, or exfiltrate credentials to an external endpoint.

VetoBlast is a zero-trust runtime proxy that sits between your AI agents and the terminal. Every command is scanned in under 10 milliseconds through a dual-layer security pipeline.

Layer one: high-speed regex pattern matching catches destructive commands like rm-rf, chmod 777, and DROP TABLE. Layer two: a fine-tuned DeBERTa-Sec classifier runs locally via ONNX, analyzing command intent to catch obfuscated attacks that pattern matching would miss — like base64-encoded secrets or variable interpolation tricks.

Let me walk you through the dashboard.

At the top, you see real-time scanner metrics — 1,847 total scans, 23 threats blocked, 19 secrets caught, and scan latency of 8.3 milliseconds. The false positive rate sits at just 2%.

On the left is the incident log. Each intercepted command shows the source agent, threat level, and resolution status. Clicking an incident reveals the full detail — the original command, the redacted payload, detected secret type, entropy score, and DeBERTa confidence rating.

The center panel shows the live terminal proxy feed — a real-time stream of block, pass, and scan events from all monitored agents.

On the right, you can see per-agent monitoring stats and the scanner configuration — model type, entropy threshold, and blocked patterns.

The approve and reject buttons enable human-in-the-loop workflows. Security operators can review flagged commands before allowing execution.

VetoBlast is built with Next.js 16, React 19, and Tailwind v4 for the SOC dashboard. The proxy engine uses Node.js with node-pty for terminal stream interception. The AI classifier runs Python FastAPI with DeBERTa-Sec via ONNX runtime. All incident data is persisted in Supabase with row-level security.

Everything runs locally. No credentials ever leave the developer's machine.

Built for UOE Summer of Code 2026. Thank you for watching.
