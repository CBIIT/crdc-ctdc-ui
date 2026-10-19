import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgramDetailsView from './programDetailsView';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('../../components/Stats/AllStatsController', () => function MockStats() {
  return <div data-testid="stats" />;
});

const program = {
  program_name: 'Comparative Oncology Program',
  program_short_name: 'COP',
  crdc_id: 'crdc-program-cop',
  program_full_description: 'A full description of the Comparative Oncology Program.',
  program_external_url: 'https://example.com/cop',
  studies: [
    { study_short_name: 'COTC007B', study_name: 'Preclinical Comparison Study' },
  ],
};

describe('ProgramDetailsView', () => {
  it('renders the program short name and full name in the header', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getByText('COP')).toBeInTheDocument();
    expect(screen.getByText('Comparative Oncology Program')).toBeInTheDocument();
  });

  it('renders the program full description', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getByText(program.program_full_description)).toBeInTheDocument();
  });

  it('renders program metadata fields when available', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getByText('crdc-program-cop')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/cop')).toBeInTheDocument();
  });

  it('renders a studies list with links to Study Details', () => {
    render(<ProgramDetailsView program={program} />);
    const link = screen.getByText('Preclinical Comparison Study').closest('a');
    expect(link).toHaveAttribute('href', '/study/COTC007B');
  });

  it('renders empty states for Host Videos and Materials when none are curated', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getByText('No videos are currently available for this program.')).toBeInTheDocument();
    expect(screen.getByText('No materials are currently available for this program.')).toBeInTheDocument();
  });

  it('renders a not-found message for an unknown program', () => {
    render(<ProgramDetailsView notFound program={null} />);
    expect(screen.getByText(/No program matches this identifier/)).toBeInTheDocument();
  });

  it('renders the Initiatives variant with the generic heading and unaffiliated studies', () => {
    render(
      <ProgramDetailsView
        isInitiatives
        unaffiliatedStudies={[{ study_short_name: 'NCT001', study_name: 'Unaffiliated Study' }]}
      />,
    );
    expect(screen.getByText('Initiatives')).toBeInTheDocument();
    const link = screen.getByText('Unaffiliated Study').closest('a');
    expect(link).toHaveAttribute('href', '/study/NCT001');
  });

  it('does not render a Program Metadata section for the Initiatives variant', () => {
    render(<ProgramDetailsView isInitiatives unaffiliatedStudies={[]} />);
    expect(screen.queryByText('PROGRAM METADATA')).not.toBeInTheDocument();
  });
});
