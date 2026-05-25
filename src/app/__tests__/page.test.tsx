import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';

describe('VetoBlast Home Page', () => {
  it('renders stats, headers, monitored agents, and configuration', () => {
    render(<Home />);

    // Check header title
    expect(screen.getByRole('heading', { name: /VetoBlast/i })).toBeInTheDocument();

    // Check system status in header
    expect(screen.getByText('PROXY ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('DeBERTa-Sec LOADED')).toBeInTheDocument();

    // Check key stats cards
    expect(screen.getByText('Total Scans')).toBeInTheDocument();
    expect(screen.getByText('Threats Blocked')).toBeInTheDocument();
    expect(screen.getByText('Secrets Caught')).toBeInTheDocument();

    // Default incident detailed panel is inc-001
    expect(screen.getAllByText('inc-001')[0]).toBeInTheDocument();
    expect(screen.getAllByText('copilot-agent-v1')[0]).toBeInTheDocument();
  });

  it('handles selecting different incidents and covers all threat level styling paths', () => {
    render(<Home />);

    // Click on inc-004 (Low severity)
    const inc004Button = screen.getByRole('button', { name: /inc-004/i });
    fireEvent.click(inc004Button);
    expect(screen.getAllByText('aider-agent-v2')[0]).toBeInTheDocument();

    // Click on inc-005 (High severity)
    const inc005Button = screen.getByRole('button', { name: /inc-005/i });
    fireEvent.click(inc005Button);
    expect(screen.getAllByText('cursor-agent-v3')[0]).toBeInTheDocument();

    // Click on inc-006 (Medium severity & low entropy secret)
    const inc006Button = screen.getByRole('button', { name: /inc-006/i });
    fireEvent.click(inc006Button);
    expect(screen.getByText('Generic Password')).toBeInTheDocument();
    expect(screen.getByText('entropy:')).toBeInTheDocument();
  });
});
