import { MOCK_INCIDENTS, MOCK_METRICS, TERMINAL_FEED } from '../mock-data';

describe('VetoBlast Mock Data', () => {
  describe('MOCK_INCIDENTS', () => {
    it('should export exactly 6 incidents', () => {
      expect(MOCK_INCIDENTS).toBeDefined();
      expect(MOCK_INCIDENTS.length).toBe(6);
    });

    it('should have inc-001 as a critical secret_leak vetoed incident', () => {
      expect(MOCK_INCIDENTS[0].id).toBe('inc-001');
      expect(MOCK_INCIDENTS[0].threatCategory).toBe('secret_leak');
      expect(MOCK_INCIDENTS[0].threatLevel).toBe('critical');
      expect(MOCK_INCIDENTS[0].status).toBe('vetoed');
    });

    it('should have unique incident IDs', () => {
      const ids = MOCK_INCIDENTS.map(i => i.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('should cover all four threat levels', () => {
      const levels = new Set(MOCK_INCIDENTS.map(i => i.threatLevel));
      expect(levels.has('critical')).toBe(true);
      expect(levels.has('high')).toBe(true);
      expect(levels.has('medium')).toBe(true);
      expect(levels.has('low')).toBe(true);
    });

    it('should include at least one hazardous_command incident', () => {
      const hazardous = MOCK_INCIDENTS.filter(i => i.threatCategory === 'hazardous_command');
      expect(hazardous.length).toBeGreaterThan(0);
    });

    it('should include at least one approved incident', () => {
      const approved = MOCK_INCIDENTS.filter(i => i.status === 'approved');
      expect(approved.length).toBeGreaterThan(0);
    });

    it('should have the majority of incidents in vetoed status', () => {
      const vetoed = MOCK_INCIDENTS.filter(i => i.status === 'vetoed');
      expect(vetoed.length).toBeGreaterThan(MOCK_INCIDENTS.length / 2);
    });

    it('should have detected secrets with valid entropy and confidence values', () => {
      const incidentsWithSecrets = MOCK_INCIDENTS.filter(i => i.detectedSecrets.length > 0);
      expect(incidentsWithSecrets.length).toBeGreaterThan(0);
      incidentsWithSecrets.forEach(inc => {
        inc.detectedSecrets.forEach(s => {
          expect(s.entropy).toBeGreaterThan(0);
          expect(s.confidence).toBeGreaterThan(0);
          expect(s.confidence).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should include Stripe and AWS key detections in critical incidents', () => {
      const criticalSecretTypes = MOCK_INCIDENTS
        .filter(i => i.threatLevel === 'critical' && i.detectedSecrets.length > 0)
        .flatMap(i => i.detectedSecrets.map(s => s.type));
      expect(criticalSecretTypes.some(t => t.includes('Stripe'))).toBe(true);
      expect(criticalSecretTypes.some(t => t.includes('AWS'))).toBe(true);
    });

    it('should have non-empty commandAttempted for all incidents', () => {
      MOCK_INCIDENTS.forEach(inc => {
        expect(typeof inc.commandAttempted).toBe('string');
        expect(inc.commandAttempted.length).toBeGreaterThan(0);
      });
    });

    it('should have redactedPayload strings for all incidents', () => {
      MOCK_INCIDENTS.forEach(inc => {
        expect(typeof inc.redactedPayload).toBe('string');
        expect(inc.redactedPayload.length).toBeGreaterThan(0);
      });
    });

    it('should have valid agentId strings for all incidents', () => {
      MOCK_INCIDENTS.forEach(inc => {
        expect(typeof inc.agentId).toBe('string');
        expect(inc.agentId.length).toBeGreaterThan(0);
      });
    });
  });

  describe('MOCK_METRICS', () => {
    it('should have totalScans = 1847', () => {
      expect(MOCK_METRICS).toBeDefined();
      expect(MOCK_METRICS.totalScans).toBe(1847);
    });

    it('should have totalBlocked = 23', () => {
      expect(MOCK_METRICS.totalBlocked).toBe(23);
    });

    it('should satisfy totalScans = totalBlocked + totalApproved', () => {
      expect(MOCK_METRICS.totalScans).toBe(MOCK_METRICS.totalBlocked + MOCK_METRICS.totalApproved);
    });

    it('should have scan latency under 15ms (target)', () => {
      expect(MOCK_METRICS.avgScanLatencyMs).toBeLessThan(15);
      expect(MOCK_METRICS.avgScanLatencyMs).toBeGreaterThan(0);
    });

    it('should have a false positive rate below 5%', () => {
      expect(MOCK_METRICS.falsePositiveRate).toBeLessThan(0.05);
      expect(MOCK_METRICS.falsePositiveRate).toBeGreaterThanOrEqual(0);
    });

    it('should have secretsCaught less than totalBlocked', () => {
      expect(MOCK_METRICS.secretsCaught).toBeLessThanOrEqual(MOCK_METRICS.totalBlocked);
    });

    it('should have 99%+ uptime', () => {
      expect(MOCK_METRICS.uptime).toMatch(/^99\./);
    });
  });

  describe('TERMINAL_FEED', () => {
    it('should export exactly 8 terminal entries', () => {
      expect(TERMINAL_FEED).toBeDefined();
      expect(TERMINAL_FEED.length).toBe(8);
    });

    it('should start with a Stripe key block at 01:12:34', () => {
      expect(TERMINAL_FEED[0].time).toBe('01:12:34');
      expect(TERMINAL_FEED[0].type).toBe('block');
    });

    it('should contain block, pass, and scan type entries', () => {
      const types = new Set(TERMINAL_FEED.map(e => e.type));
      expect(types.has('block')).toBe(true);
      expect(types.has('pass')).toBe(true);
      expect(types.has('scan')).toBe(true);
    });

    it('should have at least 4 blocked entries', () => {
      const blocked = TERMINAL_FEED.filter(e => e.type === 'block');
      expect(blocked.length).toBeGreaterThanOrEqual(4);
    });

    it('should have all entries with non-empty msg strings', () => {
      TERMINAL_FEED.forEach(entry => {
        expect(typeof entry.msg).toBe('string');
        expect(entry.msg.length).toBeGreaterThan(0);
      });
    });

    it('should have all entries with valid type values', () => {
      const validTypes = new Set(['block', 'pass', 'scan']);
      TERMINAL_FEED.forEach(entry => {
        expect(validTypes.has(entry.type)).toBe(true);
      });
    });
  });
});
