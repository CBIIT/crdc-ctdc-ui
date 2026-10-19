import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgramDetailsController from './programDetailsController';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('@apollo/client', () => ({
  useQuery: () => ({ loading: false, error: undefined, data: undefined }),
}));

jest.mock('../../components/Stats/AllStatsController', () => function MockStats() {
  return <div data-testid="stats" />;
});

describe('ProgramDetailsController', () => {
  it('renders the defined program variant for a known program_short_name', () => {
    render(<ProgramDetailsController match={{ params: { programShortName: 'NCTN' } }} />);
    expect(screen.getByText('NCI National Clinical Trials Network')).toBeInTheDocument();
  });

  it('renders a not-found state for an unknown program_short_name', () => {
    render(<ProgramDetailsController match={{ params: { programShortName: 'UNKNOWN' } }} />);
    expect(screen.getByText(/No program matches this identifier/)).toBeInTheDocument();
  });

  it('renders the Initiatives (no-program) variant when no programShortName param is present', () => {
    render(<ProgramDetailsController match={{ params: {} }} />);
    expect(screen.getByText('Initiatives')).toBeInTheDocument();
    expect(screen.getByText('Unaffiliated Study One')).toBeInTheDocument();
  });
});
