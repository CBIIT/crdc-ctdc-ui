import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import PortfolioController from './portfolioController';
import {
  GET_PORTFOLIO_PROGRAMS_QUERY, GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY, initiativesCardContent,
} from '../../bento/portfolioData';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useHistory: () => ({ push: jest.fn() }),
}));

jest.mock('@apollo/client', () => ({ useQuery: jest.fn() }));

jest.mock('../../components/Stats/AllStatsController', () => function MockStats() {
  return <div data-testid="stats" />;
});

// Wrappers' Typography calls useTheme() and crashes outside an ambient MUI ThemeProvider (pre-existing,
// unrelated to this feature) - stub it to a plain element.
jest.mock('../../components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => <p>{children}</p>,
}));

const NOT_CALLED = { loading: false, error: undefined, data: undefined };

// Routes useQuery's return value by which query document it was called with, so each test can configure the
// programs query and the unaffiliated-studies query independently.
const mockQueryResults = ({ programsResult = NOT_CALLED, unaffiliatedResult = NOT_CALLED }) => {
  useQuery.mockImplementation((query) => {
    if (query === GET_PORTFOLIO_PROGRAMS_QUERY) return programsResult;
    if (query === GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY) return unaffiliatedResult;
    return NOT_CALLED;
  });
};

describe('PortfolioController', () => {
  beforeEach(() => {
    useQuery.mockReset();
  });

  it('renders program cards from live query data', () => {
    mockQueryResults({
      programsResult: {
        loading: false,
        error: undefined,
        data: { getAllPrograms: [{ program_name: 'NCI National Clinical Trials Network', program_short_name: 'NCTN', studies: [] }] },
      },
      unaffiliatedResult: {
        loading: false,
        error: undefined,
        data: { getAllPrograms: [{ studies: [{ study_short_name: 'NCT00980460', study_name: 'Unaffiliated Study One' }] }] },
      },
    });
    render(<PortfolioController />);
    expect(screen.getByText('NCI National Clinical Trials Network')).toBeInTheDocument();
  });

  it('counts unaffiliated studies from every returned grouping on the Initiatives card', () => {
    mockQueryResults({
      programsResult: { loading: false, error: undefined, data: { getAllPrograms: [] } },
      unaffiliatedResult: {
        loading: false,
        error: undefined,
        data: {
          getAllPrograms: [
            { studies: [{ study_id: 'NCT1', study_short_name: 'S1', study_name: 'No Program Study' }] },
            { program_short_name: 'NA', studies: [{ study_id: 'NCT2', study_short_name: 'S2', study_name: 'Not Applicable Study' }] },
          ],
        },
      },
    });
    render(<PortfolioController showInitiatives />);
    expect(screen.getByText((_, element) => element.children.length === 2
      && element.textContent.replace(/\s+/g, ' ') === '2 Associated Studies')).toBeInTheDocument();
  });

  it('skips the Initiatives query and card by default', () => {
    mockQueryResults({
      programsResult: {
        loading: false,
        error: undefined,
        data: { getAllPrograms: [{ program_name: 'NCI National Clinical Trials Network', program_short_name: 'NCTN', studies: [] }] },
      },
    });
    render(<PortfolioController />);
    const unaffiliatedCall = useQuery.mock.calls.find(([query]) => query === GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY);
    expect(unaffiliatedCall[1]).toEqual({ skip: true });
    expect(screen.queryByText(initiativesCardContent.name)).not.toBeInTheDocument();
  });

  it('renders a loading indicator while queries are in flight', () => {
    mockQueryResults({ programsResult: { loading: true, error: undefined, data: undefined } });
    render(<PortfolioController />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders an error message when a query fails', () => {
    mockQueryResults({
      programsResult: { loading: false, error: new Error('boom'), data: undefined },
    });
    render(<PortfolioController />);
    expect(screen.getByText(/An error has occurred in loading the Portfolio page: boom/)).toBeInTheDocument();
  });
});
