import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import ProgramDetailsController from './programDetailsController';
import { GET_PROGRAM_DETAIL_QUERY } from '../../bento/programDetailsData';
import { GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY } from '../../bento/portfolioData';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('@apollo/client', () => ({ useQuery: jest.fn() }));

jest.mock('../../components/Stats/AllStatsController', () => function MockStats() {
  return <div data-testid="stats" />;
});

// Wrappers' Typography calls useTheme() and crashes outside an ambient MUI ThemeProvider (pre-existing,
// unrelated to this feature) - stub it to a plain element like programDetailsView.js does for its own
// not-found message.
jest.mock('../../components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => <p>{children}</p>,
}));

const NOT_CALLED = { loading: false, error: undefined, data: undefined };

// Routes useQuery's return value by which query document it was called with, so each test can configure the
// program query and the unaffiliated-studies query independently.
const mockQueryResults = ({ programResult = NOT_CALLED, unaffiliatedResult = NOT_CALLED }) => {
  useQuery.mockImplementation((query) => {
    if (query === GET_PROGRAM_DETAIL_QUERY) return programResult;
    if (query === GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY) return unaffiliatedResult;
    return NOT_CALLED;
  });
};

describe('ProgramDetailsController', () => {
  beforeEach(() => {
    useQuery.mockReset();
  });

  it('renders the defined program variant for a known program_short_name', () => {
    mockQueryResults({
      programResult: {
        loading: false,
        error: undefined,
        data: { getAllPrograms: [{ program_name: 'NCI National Clinical Trials Network', program_short_name: 'NCTN', studies: [] }] },
      },
    });
    render(<ProgramDetailsController match={{ params: { programShortName: 'NCTN' } }} />);
    expect(screen.getByText('NCI National Clinical Trials Network')).toBeInTheDocument();
  });

  it('renders a not-found state for an unknown program_short_name', () => {
    mockQueryResults({
      programResult: { loading: false, error: undefined, data: { getAllPrograms: [] } },
    });
    render(<ProgramDetailsController match={{ params: { programShortName: 'UNKNOWN' } }} />);
    expect(screen.getByText(/No program matches this identifier/)).toBeInTheDocument();
  });

  it('renders the Initiatives (no-program) variant when no programShortName param is present', () => {
    mockQueryResults({
      unaffiliatedResult: {
        loading: false,
        error: undefined,
        data: { getAllPrograms: [{ studies: [{ study_short_name: 'NCT00980460', study_name: 'Unaffiliated Study One' }] }] },
      },
    });
    render(<ProgramDetailsController match={{ params: {} }} />);
    expect(screen.getByText('Initiatives')).toBeInTheDocument();
    expect(screen.getByText('Unaffiliated Study One')).toBeInTheDocument();
  });

  it('renders a loading indicator while the query is in flight', () => {
    mockQueryResults({ programResult: { loading: true, error: undefined, data: undefined } });
    render(<ProgramDetailsController match={{ params: { programShortName: 'NCTN' } }} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders an error message when the query fails', () => {
    mockQueryResults({
      programResult: { loading: false, error: new Error('boom'), data: undefined },
    });
    render(<ProgramDetailsController match={{ params: { programShortName: 'NCTN' } }} />);
    expect(screen.getByText(/An error has occurred in loading the Program Details page: boom/)).toBeInTheDocument();
  });
});
