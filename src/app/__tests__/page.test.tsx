import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock Supabase client to prevent createClient from crashing without env vars
jest.mock('@/lib/supabase', () => ({
  supabase: {},
}));

// Mock data fetchers to return mock data
jest.mock('@/lib/data', () => {
  const mockData = jest.requireActual('@/lib/mock-data');
  return {
    getIncidents: jest.fn().mockResolvedValue(mockData.MOCK_INCIDENTS),
    getMetrics: jest.fn().mockResolvedValue(mockData.MOCK_METRICS),
    getTerminalFeed: jest.fn().mockResolvedValue(mockData.TERMINAL_FEED),
  };
});

import Home from '../page';

describe('VetoBlast Home Page', () => {
  it('renders stats, headers, monitored agents, and configuration', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /VetoBlast/i })).toBeInTheDocument();
    });
    expect(screen.getByText('PROXY ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('DeBERTa-Sec LOADED')).toBeInTheDocument();
    expect(screen.getByText('Total Scans')).toBeInTheDocument();
    expect(screen.getByText('Threats Blocked')).toBeInTheDocument();
    expect(screen.getByText('Secrets Caught')).toBeInTheDocument();
    expect(screen.getAllByText('inc-001')[0]).toBeInTheDocument();
    expect(screen.getAllByText('copilot-agent-v1')[0]).toBeInTheDocument();
  });

  it('handles selecting different incidents and covers all threat level styling paths', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /inc-004/i })).toBeInTheDocument();
    });

    const inc004Button = screen.getByRole('button', { name: /inc-004/i });
    fireEvent.click(inc004Button);
    expect(screen.getAllByText('aider-agent-v2')[0]).toBeInTheDocument();

    const inc005Button = screen.getByRole('button', { name: /inc-005/i });
    fireEvent.click(inc005Button);
    expect(screen.getAllByText('cursor-agent-v3')[0]).toBeInTheDocument();

    const inc006Button = screen.getByRole('button', { name: /inc-006/i });
    fireEvent.click(inc006Button);
    expect(screen.getByText('Generic Password')).toBeInTheDocument();
    expect(screen.getByText('entropy:')).toBeInTheDocument();
  });

  it('renders the terminal stream with live feed heading and entries', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('vetoblast-proxy — live')).toBeInTheDocument();
    });
    expect(screen.getAllByText(/sk_live_51N2/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/DeBERTa-Sec/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the monitored agents panel with all three agents', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Monitored Agents')).toBeInTheDocument();
    });
    expect(screen.getAllByText('copilot-agent-v1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('cursor-agent-v3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('aider-agent-v2').length).toBeGreaterThanOrEqual(1);
  });

  it('renders approve and reject action buttons in the incident detail panel and handles clicks', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'APPROVE' })).toBeInTheDocument();
    });

    const approveButton = screen.getByRole('button', { name: 'APPROVE' });
    const rejectButton = screen.getByRole('button', { name: 'REJECT' });

    expect(approveButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();

    fireEvent.click(approveButton);
    expect(screen.getByRole('button', { name: 'APPROVED ✓' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'REJECT' }));
    expect(screen.getByRole('button', { name: 'REJECTED ✗' })).toBeInTheDocument();
  });

  it('renders scanner configuration details with block pattern list', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Scanner Config')).toBeInTheDocument();
    });
    expect(screen.getByText('DeBERTa-Sec-ONNX')).toBeInTheDocument();
    expect(screen.getByText('rm -rf, chmod 777, DROP')).toBeInTheDocument();
  });

  it('renders threat intercept rate gauge', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('THREAT INTERCEPT RATE')).toBeInTheDocument();
    });
    expect(screen.getByText('BLOCKED')).toBeInTheDocument();
  });

  it('renders footer with correct zero-trust branding', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/VetoBlast.*UOE Summer of Code 2026/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Zero-Trust.*DeBERTa-Sec/i)).toBeInTheDocument();
  });
});
