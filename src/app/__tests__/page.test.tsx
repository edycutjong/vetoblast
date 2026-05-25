import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';

describe('VetoBlast Home Page', () => {
  it('renders stats, headers, monitored agents, and configuration', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /VetoBlast/i })).toBeInTheDocument();
    expect(screen.getByText('PROXY ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('DeBERTa-Sec LOADED')).toBeInTheDocument();
    expect(screen.getByText('Total Scans')).toBeInTheDocument();
    expect(screen.getByText('Threats Blocked')).toBeInTheDocument();
    expect(screen.getByText('Secrets Caught')).toBeInTheDocument();
    expect(screen.getAllByText('inc-001')[0]).toBeInTheDocument();
    expect(screen.getAllByText('copilot-agent-v1')[0]).toBeInTheDocument();
  });

  it('handles selecting different incidents and covers all threat level styling paths', () => {
    render(<Home />);

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

  it('renders the terminal stream with live feed heading and entries', () => {
    render(<Home />);

    expect(screen.getByText('vetoblast-proxy — live')).toBeInTheDocument();
    // Terminal feed entries reference the Stripe key block
    expect(screen.getAllByText(/sk_live_51N2/i).length).toBeGreaterThanOrEqual(1);
    // DeBERTa-Sec scan entry is present
    expect(screen.getAllByText(/DeBERTa-Sec/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the monitored agents panel with all three agents', () => {
    render(<Home />);

    expect(screen.getByText('Monitored Agents')).toBeInTheDocument();
    // Agents appear in both the list and header — use getAllByText
    expect(screen.getAllByText('copilot-agent-v1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('cursor-agent-v3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('aider-agent-v2').length).toBeGreaterThanOrEqual(1);
  });

  it('renders approve and reject action buttons in the incident detail panel', () => {
    render(<Home />);

    // "APPROVE" (exact) and "REJECT" are only in the IncidentDetail action buttons
    expect(screen.getByText('APPROVE')).toBeInTheDocument();
    expect(screen.getByText('REJECT')).toBeInTheDocument();
  });

  it('renders scanner configuration details with block pattern list', () => {
    render(<Home />);

    expect(screen.getByText('Scanner Config')).toBeInTheDocument();
    expect(screen.getByText('DeBERTa-Sec-ONNX')).toBeInTheDocument();
    // Block Patterns value is uniquely comma-formatted in the config panel
    expect(screen.getByText('rm -rf, chmod 777, DROP')).toBeInTheDocument();
  });

  it('renders threat intercept rate gauge', () => {
    render(<Home />);

    expect(screen.getByText('THREAT INTERCEPT RATE')).toBeInTheDocument();
    expect(screen.getByText('BLOCKED')).toBeInTheDocument();
  });

  it('renders footer with correct zero-trust branding', () => {
    render(<Home />);

    expect(screen.getByText(/VetoBlast.*UOE Summer of Code 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero-Trust.*DeBERTa-Sec/i)).toBeInTheDocument();
  });
});
