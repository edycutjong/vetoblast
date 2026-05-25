import { MOCK_INCIDENTS, MOCK_METRICS, TERMINAL_FEED } from '../mock-data';

describe('VetoBlast Data Integrity', () => {
  describe('Incident log consistency', () => {
    it('incident IDs follow the inc-NNN sequential format', () => {
      MOCK_INCIDENTS.forEach((inc, idx) => {
        expect(inc.id).toBe(`inc-00${idx + 1}`);
      });
    });

    it('incidents are ordered chronologically (most recent first)', () => {
      const timestamps = MOCK_INCIDENTS.map(i => new Date(i.timestamp).getTime());
      for (let i = 0; i < timestamps.length - 1; i++) {
        expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i + 1]);
      }
    });

    it('vetoed incidents with detectedSecrets all have redactedPayload containing REDACTED', () => {
      MOCK_INCIDENTS
        .filter(i => i.status === 'vetoed' && i.detectedSecrets.length > 0)
        .forEach(inc => {
          expect(inc.redactedPayload).toContain('REDACTED');
        });
    });

    it('hazardous_command incidents have no detectedSecrets (pattern-blocked)', () => {
      MOCK_INCIDENTS
        .filter(i => i.threatCategory === 'hazardous_command')
        .forEach(inc => {
          expect(inc.detectedSecrets.length).toBe(0);
        });
    });

    it('approved incidents have low threat level', () => {
      MOCK_INCIDENTS.filter(i => i.status === 'approved').forEach(inc => {
        expect(inc.threatLevel).toBe('low');
      });
    });

    it('high-entropy secrets (> 4.5 bits) should be classified as critical or high threat', () => {
      MOCK_INCIDENTS.forEach(inc => {
        inc.detectedSecrets.forEach(s => {
          if (s.entropy > 4.5) {
            expect(['critical', 'high']).toContain(inc.threatLevel);
          }
        });
      });
    });
  });

  describe('Metrics cross-validation', () => {
    it('secretsCaught must be <= totalBlocked (secrets are a subset of blocks)', () => {
      expect(MOCK_METRICS.secretsCaught).toBeLessThanOrEqual(MOCK_METRICS.totalBlocked);
    });

    it('totalBlocked + totalApproved must equal totalScans exactly', () => {
      expect(MOCK_METRICS.totalBlocked + MOCK_METRICS.totalApproved).toBe(MOCK_METRICS.totalScans);
    });

    it('block rate should be less than 5% of total scans (low false positive design)', () => {
      const blockRate = MOCK_METRICS.totalBlocked / MOCK_METRICS.totalScans;
      expect(blockRate).toBeLessThan(0.05);
    });
  });

  describe('Terminal feed consistency', () => {
    it('terminal feed entries are ordered from most recent to oldest', () => {
      const times = TERMINAL_FEED.map(e => e.time);
      for (let i = 0; i < times.length - 1; i++) {
        expect(times[i] >= times[i + 1]).toBe(true);
      }
    });

    it('block entries contain HALT keyword', () => {
      TERMINAL_FEED.filter(e => e.type === 'block').forEach(e => {
        expect(e.msg).toContain('[HALT]');
      });
    });

    it('pass entries contain PASS keyword', () => {
      TERMINAL_FEED.filter(e => e.type === 'pass').forEach(e => {
        expect(e.msg).toContain('[PASS]');
      });
    });

    it('scan entries contain SCAN keyword', () => {
      TERMINAL_FEED.filter(e => e.type === 'scan').forEach(e => {
        expect(e.msg).toContain('[SCAN]');
      });
    });
  });
});
