# VetoBlast — YouTube Metadata

## Title
VetoBlast — Zero-Trust AI Agent Command Interceptor | UOE Summer of Code 2026

## Description
VetoBlast is a zero-trust runtime proxy that intercepts every AI coding agent terminal command, redacts leaked secrets in real-time, and vetoes destructive shell executions — all in under 10ms.

🔗 Live Demo: https://vetoblast.edycu.dev
📊 Pitch Deck: https://vetoblast.edycu.dev/pitch.html
💻 GitHub: https://github.com/edycutjong/vetoblast

### Key Features:
🔒 In-Flight Secret Redaction — Detects API keys, tokens, and passwords via entropy analysis
🧠 DeBERTa-Sec AI Classifier — Local ONNX model catches obfuscated exfiltration attempts (97% precision)
🚫 Command Veto Gate — Blocks rm -rf, chmod 777, DROP TABLE instantly
📊 SOC-Grade Dashboard — Real-time terminal tracer, threat speedometer, incident review console
🏠 100% Local — No credentials ever leave the developer's machine

### Tech Stack:
- Next.js 16, React 19, Tailwind CSS v4 (Dashboard)
- Node.js + node-pty (Proxy Engine)
- Python 3.12, FastAPI, DeBERTa-Sec ONNX (AI Classifier)
- Supabase PostgreSQL (Audit Log)

Built for UOE Summer of Code 2026.

## Tags
vetoblast, ai agent security, ai coding agent, copilot security, cursor security, aider security, zero trust, secret scanning, command interceptor, deberta, onnx, terminal proxy, next.js, react, tailwind, supabase, hackathon, uoe summer of code, devpost, cybersecurity, soc dashboard, runtime firewall, credential leak, api key detection, entropy analysis
