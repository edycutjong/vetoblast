-- VetoBlast Database Schema (Supabase PostgreSQL)
-- Stores threat telemetry, audit trails, and agent command paths.

CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) NOT NULL,
    command_attempted TEXT NOT NULL,
    threat_category VARCHAR(50) NOT NULL, -- 'secret_leak', 'hazardous_command'
    redacted_payload TEXT NOT NULL,       -- Payload with keys replaced by placeholders
    status VARCHAR(20) DEFAULT 'vetoed',  -- 'vetoed', 'approved', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS secure_placeholders (
    placeholder_hash VARCHAR(64) PRIMARY KEY,
    secret_value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
