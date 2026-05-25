import { MOCK_INCIDENTS, MOCK_METRICS, TERMINAL_FEED } from '../mock-data';

describe('VetoBlast Mock Data', () => {
  it('should export mock data correctly', () => {
    expect(MOCK_INCIDENTS).toBeDefined();
    expect(MOCK_INCIDENTS.length).toBe(6);
    expect(MOCK_INCIDENTS[0].id).toBe('inc-001');
    expect(MOCK_INCIDENTS[0].threatCategory).toBe('secret_leak');

    expect(MOCK_METRICS).toBeDefined();
    expect(MOCK_METRICS.totalScans).toBe(1847);
    expect(MOCK_METRICS.totalBlocked).toBe(23);

    expect(TERMINAL_FEED).toBeDefined();
    expect(TERMINAL_FEED.length).toBe(8);
    expect(TERMINAL_FEED[0].time).toBe('01:12:34');
  });
});
