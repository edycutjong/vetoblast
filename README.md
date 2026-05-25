<div align="center">
  <img src="public/icon.svg" alt="VetoBlast icon" width="120" height="120">
  <h1>VetoBlast 🛡️</h1>
  <p><em>Zero-trust runtime proxy that intercepts AI agent commands, redacts secrets, and vetoes destructive executions</em></p>
  <img src="docs/readme-hero.png" alt="VetoBlast" width="100%">

  <br/>

  [![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-ef4444?style=for-the-badge)](https://vetoblast.edycu.dev)
  [![Pitch Deck](https://img.shields.io/badge/📊_Pitch-Deck-10b981?style=for-the-badge)](https://vetoblast.edycu.dev/pitch.html)
  [![YouTube Demo](https://img.shields.io/badge/▶_YouTube-Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/2yhqErPzRI8)
  [![Tests](https://img.shields.io/badge/✅_Tests-51_passing-22c55e?style=for-the-badge)](#-testing--ci)
  [![Built for UOE](https://img.shields.io/badge/UOE-Summer_of_Code_2026-8b5cf6?style=for-the-badge)](https://uoe-summer-of-code.devpost.com/)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
  ![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
  ![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=flat&logo=python&logoColor=white)
  [![CI](https://github.com/edycutjong/vetoblast/actions/workflows/ci.yml/badge.svg)](https://github.com/edycutjong/vetoblast/actions/workflows/ci.yml)

</div>

---

## 💡 The Problem & Solution

AI coding agents scan `.env` files, execute shell commands, and send prompts to external LLMs — **without security awareness**. An intern's agent accidentally pushed production AWS credentials to a public repo, costing **$85,000** before the alert fired.

**VetoBlast** is a zero-trust terminal proxy that intercepts every AI agent command in real-time. It uses entropy analysis + a local DeBERTa-Sec classifier to distinguish real secrets from harmless hashes, redacts credentials in-flight, and vetoes destructive commands — all in **<10ms** overhead.

**Key Features:**
- 🔒 **In-Flight Secret Redaction**: Detects and replaces API keys, tokens, and passwords before they reach external services
- 🧠 **DeBERTa-Sec AI Classifier**: Local ONNX model distinguishes real secrets from commit hashes (2% false positive rate)
- 🚫 **Command Veto Gate**: Blocks destructive patterns (`rm -rf`, `chmod 777`, `DROP TABLE`) instantly
- 📊 **Cyberpunk SOC Dashboard**: Real-time terminal tracer, threat speedometer, and incident review console
- 🏠 **100% Local**: No credentials ever leave the developer's machine

## 📸 Screenshots

<details>
<summary><strong>Click to expand all dashboard screenshots</strong></summary>

### Stripe API Key Exfiltration — BLOCKED
> Agent `copilot-agent-v1` attempted a git commit + push containing a Stripe live API key. VetoBlast detected the secret with 97% confidence and blocked execution.

<img src="docs/screenshots/inc-001.png" alt="Incident 001 — Stripe key exfiltration blocked" width="100%">

---

### AWS Secret Key Leak via curl — BLOCKED
> Agent `cursor-agent-v3` piped config JSON containing an AWS secret key to an external LLM API endpoint. Entropy analysis flagged it at 4.91.

<img src="docs/screenshots/inc-002.png" alt="Incident 002 — AWS secret key leak blocked" width="100%">

---

### Destructive Shell Command — VETOED
> Agent attempted `rm -rf /usr/local/bin && chmod 777 /etc/passwd`. Pattern-matched and vetoed before execution.

<img src="docs/screenshots/inc-003.png" alt="Incident 003 — Destructive command vetoed" width="100%">

---

### Safe Command — APPROVED
> `npm run build` passed all scans. No secrets detected, no destructive patterns.

<img src="docs/screenshots/inc-004.png" alt="Incident 004 — Safe command approved" width="100%">

---

### Deploy Script with GitHub PAT — BLOCKED
> `python deploy.sh` contained a GitHub Personal Access Token in plaintext. DeBERTa classified intent as exfiltration.

<img src="docs/screenshots/inc-005.png" alt="Incident 005 — GitHub PAT in deploy script" width="100%">

---

### Git Config Password Exposure — REDACTED
> Agent attempted `git config --global user.password` with a plaintext password. VetoBlast redacted to `[REDACTED_PWD]`.

<img src="docs/screenshots/inc-006.png" alt="Incident 006 — Git password redacted" width="100%">

</details>

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    Agent[Autonomous AI Agent] <-->|Terminal Commands / Stdin| Proxy[VetoBlast Proxy <br/> Node.js / node-pty]
    Proxy -->|Raw Streams| ONNX[DeBERTa-Sec Classifier <br/> Python FastAPI / ONNX-runtime]
    Proxy <-->|WebSocket Stream| UI[Next.js 16 / React 19 Dashboard]
    UI <-->|Approve/Reject Signals| Proxy
    Proxy -->|Log Actions| Supabase[Supabase Database]
    Proxy <-->|Filter Output / Stdout| Agent
```

| Layer | Technology |
|---|---|
| **Dashboard** | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| **Proxy Engine** | Node.js, node-pty (terminal stream interception) |
| **AI Classifier** | Python 3.12, FastAPI, DeBERTa-Sec (ONNX-runtime) |
| **Audit Log** | Supabase (PostgreSQL) |
| **Communication** | WebSocket (real-time threat stream) |

## 🗄️ Database Schema

Data is persisted in **Supabase (PostgreSQL)** with Row-Level Security enabled. All tables use the `vb_` prefix to namespace within the shared Supabase instance.

```mermaid
erDiagram
    vb_incidents {
        text id PK
        timestamptz timestamp
        text agent_id
        text command_attempted
        varchar threat_category
        varchar threat_level
        text redacted_payload
        jsonb detected_secrets
        varchar status
        timestamptz created_at
    }
    vb_metrics {
        serial id PK
        int total_scans
        int total_blocked
        int total_approved
        numeric avg_scan_latency_ms
        numeric false_positive_rate
        int secrets_caught
        text uptime
    }
    vb_terminal_feed {
        serial id PK
        text time
        text type
        text msg
        timestamptz created_at
    }
```

| Table | Purpose | Rows |
|---|---|---|
| `vb_incidents` | Intercepted agent commands — threat level, redacted payload, detected secrets (JSONB) | 6 |
| `vb_metrics` | Aggregate scanner stats — total scans, blocked count, latency, false positive rate | 1 |
| `vb_terminal_feed` | Live terminal proxy log — timestamped block/pass/scan events | 8 |

> **RLS Policy**: Anonymous read access enabled on all tables. Write operations require `service_role` key.

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm

### Installation
```bash
git clone https://github.com/edycutjong/vetoblast.git
cd vetoblast
npm install
cp .env.example .env.local
npm run dev
```

## 🧪 Testing & CI

**51 passing tests** across 4 test suites — covering mock data integrity, incident log consistency, entropy/confidence validation, threat level coverage, metrics cross-validation, terminal feed type validation, and all interactive dashboard state transitions.

```bash
npm test              # Run all 51 tests
npm run test:coverage # Coverage report
npm run lint          # ESLint
npm run typecheck     # TypeScript check
npm run build         # Production build
npm run ci            # Full CI pipeline (lint + typecheck + test + build)
```

CI runs on Node.js 20, 22, and 24 via GitHub Actions on every push.

## 📁 Project Structure
```
vetoblast/
├── docs/              # README assets
├── src/
│   ├── app/           # Next.js pages + __tests__/
│   └── lib/           # Mock data & utilities + __tests__/
├── .github/           # CI workflows
├── .env.example       # Environment template
├── LICENSE            # MIT
└── README.md          # You are here
```

## Acknowledged Limitation
**Obfuscated Key Split**: If a secret key is split across multiple variables and concatenated during execution, raw stream evaluations may fail to identify the pattern, requiring supplementary environment inspection rules.

## 🔨 Built With

- [Next.js 16](https://nextjs.org/) — App Router, React Server Components
- [React 19](https://react.dev/) — UI framework
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling
- [Node.js](https://nodejs.org/) + [node-pty](https://github.com/nickarora/node-pty) — Terminal stream interception
- [Python 3.12](https://www.python.org/) — AI classifier backend
- [FastAPI](https://fastapi.tiangolo.com/) — REST API server
- [DeBERTa-Sec](https://huggingface.co/microsoft/deberta-v3-base) — Fine-tuned ONNX classifier for command intent
- [ONNX Runtime](https://onnxruntime.ai/) — Local model inference
- [Supabase](https://supabase.com/) — PostgreSQL audit log with RLS
- [Jest](https://jestjs.io/) — Testing framework (51 passing tests)
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline
- [Vercel](https://vercel.com/) — Frontend deployment

## 📄 License
[MIT](LICENSE) © 2026 Edy Cu

## 🙏 Acknowledgments
Built for **UOE Summer of Code 2026**. Thank you to the organizers and judges for the opportunity.
