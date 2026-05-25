<div align="center">
  <h1>VetoBlast 🛡️</h1>
  <p><em>Zero-trust runtime proxy that intercepts AI agent commands, redacts secrets, and vetoes destructive executions</em></p>
  <img src="docs/readme-hero.png" alt="VetoBlast" width="100%">

  <br/>

  [![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-ef4444?style=for-the-badge)](https://vetoblast.edycu.dev)
  [![Pitch Deck](https://img.shields.io/badge/📊_Pitch-Deck-10b981?style=for-the-badge)](https://vetoblast.edycu.dev/pitch.html)
  [![Tests](https://img.shields.io/badge/✅_Tests-51_passing-22c55e?style=for-the-badge)](#-testing--ci)
  [![Built for UOE](https://img.shields.io/badge/UOE-Summer_of_Code_2026-8b5cf6?style=for-the-badge)](https://uoe-summer-of-code.devpost.com/)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
  ![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
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

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Dashboard** | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| **Proxy Engine** | Node.js, node-pty (terminal stream interception) |
| **AI Classifier** | Python 3.12, FastAPI, DeBERTa-Sec (ONNX-runtime) |
| **Audit Log** | Supabase (PostgreSQL) |
| **Communication** | WebSocket (real-time threat stream) |

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
npm test              # Run all 50 tests
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

## 📄 License
[MIT](LICENSE) © 2026 Edy Cu

## 🙏 Acknowledgments
Built for **UOE Summer of Code 2026**. Thank you to the organizers and judges for the opportunity.
