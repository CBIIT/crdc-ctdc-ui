import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortfolioView from './portfolioView';
import { initiativesCardContent } from '../../bento/portfolioData';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: jest.fn() }),
}));

jest.mock('../../components/Stats/AllStatsController', () => function MockStats() {
  return <div data-testid="stats" />;
});

// Wrappers' Typography calls useTheme() and crashes outside an ambient MUI ThemeProvider (pre-existing,
// unrelated to this feature) - stub it to a plain element.
jest.mock('../../components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => <p>{children}</p>,
}));

const programs = [
  {
    program_name: 'NCI National Clinical Trials Network',
    program_short_name: 'NCTN',
    program_short_description: 'Supports cancer clinical trials.',
    studies: [],
  },
  {
    program_name: 'Cancer Immune Monitoring and Analysis Centers',
    program_short_name: 'CIMAC-CIDC',
    program_short_description: 'Immune monitoring network.',
    studies: [],
  },
  {
    program_name: 'NCI Molecular Analysis for Therapy Choice Trial',
    program_short_name: 'NCI-MATCH',
    program_short_description: 'Precision medicine trial.',
    studies: [],
  },
];
const unaffiliatedStudies = [{ study_id: 'NCT1', study_short_name: 'CMB', study_name: 'CM Biobank' }];

const renderedTitles = () => screen
  .getAllByText(/Cancer Immune|Cancer Moonshot|NCI Molecular|NCI National/)
  .filter((el) => el.tagName === 'SPAN')
  .map((el) => el.textContent);

describe('PortfolioView', () => {
  it('orders program cards and the Initiatives card alphabetically by name', () => {
    render(<PortfolioView programs={programs} unaffiliatedStudies={unaffiliatedStudies} />);
    expect(renderedTitles()).toEqual([
      'Cancer Immune Monitoring and Analysis Centers',
      initiativesCardContent.name,
      'NCI Molecular Analysis for Therapy Choice Trial',
      'NCI National Clinical Trials Network',
    ]);
  });

  it('filters cards by name as the user types, case-insensitively', () => {
    render(<PortfolioView programs={programs} unaffiliatedStudies={unaffiliatedStudies} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'moLEcular' } });
    expect(renderedTitles()).toEqual(['NCI Molecular Analysis for Therapy Choice Trial']);
  });

  it('filters cards by program short name', () => {
    render(<PortfolioView programs={programs} unaffiliatedStudies={unaffiliatedStudies} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'nctn' } });
    expect(renderedTitles()).toEqual(['NCI National Clinical Trials Network']);
  });

  it('filters cards by description text', () => {
    render(<PortfolioView programs={programs} unaffiliatedStudies={unaffiliatedStudies} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'precision medicine' } });
    expect(renderedTitles()).toEqual(['NCI Molecular Analysis for Therapy Choice Trial']);
  });

  it('can filter to the Initiatives card', () => {
    render(<PortfolioView programs={programs} unaffiliatedStudies={unaffiliatedStudies} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'moonshot' } });
    expect(renderedTitles()).toEqual([initiativesCardContent.name]);
  });

  it('shows a no-match message and restores all cards when the search is cleared', () => {
    render(<PortfolioView programs={programs} unaffiliatedStudies={unaffiliatedStudies} />);
    const search = screen.getByRole('searchbox');
    fireEvent.change(search, { target: { value: 'zzzz-no-match' } });
    expect(screen.getByText('No programs or initiatives match your search.')).toBeInTheDocument();
    fireEvent.change(search, { target: { value: '' } });
    expect(renderedTitles()).toHaveLength(4);
  });

  it('shows the empty message and no search box when nothing is registered', () => {
    render(<PortfolioView programs={[]} unaffiliatedStudies={[]} />);
    expect(screen.getByText('No programs are currently registered.')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });
});
