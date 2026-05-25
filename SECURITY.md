# Security Policy — VetoBlast

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (current) | ✅ Active |

## Reporting a Vulnerability

If you discover a security vulnerability in VetoBlast, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@edycu.dev**

Include the following in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

We will acknowledge receipt within **48 hours** and provide an initial assessment within **5 business days**.

## Security Architecture

### Zero-Trust Proxy Design
VetoBlast is itself a security tool — its architecture is designed to enforce zero-trust principles while never becoming a vector for the threats it prevents.

- **Local-Only Execution**: All credential scanning and command vetting runs locally — no secrets are ever sent to external services
- **In-Memory Redaction**: Detected secrets are replaced with secure placeholder hashes in-flight; original values are never logged or persisted
- **No Secret Storage**: VetoBlast does not store, cache, or persist any detected credentials — they are redacted and discarded

### DeBERTa-Sec AI Classifier
- **ONNX-Runtime Inference**: The model runs locally via ONNX-runtime in read-only mode — no training or fine-tuning occurs on-device
- **No External API Calls**: Classification is performed entirely on local CPU; no model inputs are sent to cloud endpoints
- **Entropy + Context**: The dual-layer approach (entropy analysis + DeBERTa context classification) minimizes false positives without sacrificing detection accuracy

### Terminal Proxy Engine
- **node-pty Isolation**: Terminal streams are intercepted via `node-pty` — the proxy operates as a middleware layer without modifying the host shell environment
- **Command Pattern Matching**: Destructive command patterns (`rm -rf`, `chmod 777`, `DROP TABLE`) are matched against a configurable blocklist before execution
- **Approve/Reject Gate**: Human-in-the-loop review is enforced for flagged commands — no automatic pass-through for high-threat detections

### Data Layer
- **Row-Level Security (RLS)**: Supabase audit log tables enforce RLS — anonymous users have read-only access
- **Incident Logs Only**: The database stores redacted incident metadata (threat level, agent ID, redacted payload) — never the original secret values
- **Environment Variables**: All secrets (`SUPABASE_ANON_KEY`) are stored in `.env.local` and excluded via `.gitignore`

### Frontend
- **Client-Side Only**: Supabase queries use the public `anon` key — no `service_role` key is exposed to the browser
- **No External Scripts**: The dashboard loads zero third-party analytics or tracking scripts
- **Redacted Display**: The SOC dashboard only renders redacted payloads — original secret values are never sent to the frontend

## Threat Model

| Threat | Mitigation |
|--------|------------|
| Secret exfiltration via LLM prompts | Secrets are redacted in-flight before reaching any external endpoint |
| Destructive shell commands | Command blocklist + human-in-the-loop approval gate |
| False negatives (missed secrets) | Dual-layer detection: entropy scanner + DeBERTa-Sec contextual classifier |
| Proxy bypass | Agent commands must be routed through the proxy; direct shell access is configurable |
| Credential exposure in logs | Only redacted placeholders are stored; original values are never persisted |
| SQL injection | Supabase SDK uses parameterized queries; no raw SQL in the frontend |
| XSS | Next.js automatically escapes rendered content; no `dangerouslySetInnerHTML` |
| Model poisoning | DeBERTa-Sec is a static ONNX model; no on-device training |

### Known Limitation
**Obfuscated Key Split**: If a secret key is split across multiple variables and concatenated during runtime execution, the in-flight stream scanner may fail to detect the complete credential pattern. This edge case requires supplementary environment inspection rules.

## Dependencies

We regularly review dependencies for known vulnerabilities:

```bash
npm audit          # Check for known CVEs
npm audit fix      # Auto-fix where possible
```

## Disclosure Policy

- We follow **coordinated disclosure** practices
- Reporters will be credited in release notes (unless anonymity is requested)
- We do not pursue legal action against good-faith security researchers
