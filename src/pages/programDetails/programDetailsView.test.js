import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgramDetailsView from './programDetailsView';
import { programDetailsColors } from '../../bento/programDetailsData';

// Test-only fixture: no real curated videos exist yet, so supply one for the Host Video rendering tests.
jest.mock('../../bento/programDetailsData', () => ({
  ...jest.requireActual('../../bento/programDetailsData'),
  curatedProgramDetailContent: {
    NCTN: {
      hostVideos: [
        {
          title: 'Fixture Video',
          description: 'Fixture video description.',
          thumbnail: 'https://img.youtube.com/vi/fixture123/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=fixture123',
        },
      ],
    },
  },
}));

const curatedProgramDetailContent = jest.requireMock('../../bento/programDetailsData').curatedProgramDetailContent;

// bento-core pulls in an ESM-only dependency Jest can't parse; only these exports are used by the code under test.
jest.mock('../../bento-core', () => ({
  cellTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM', DISPLAY: 'DISPLAY' },
  headerTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM' },
  TableContextProvider: ({ children }) => children,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// The real table (bento-core + MUI theming) is covered by the Studies page; here only the rows it receives matter.
jest.mock('../../components/DataAvailabilityTable/StudiesTable', () => function MockStudiesTable({ data }) {
  return (
    <table>
      <tbody>
        {data.map((row) => (
          <tr key={row.study_id || row.study_short_name}>
            <td>{row.program_short_name}</td>
            <td><a href={`/study/${row.study_id}`}>{row.study_id}</a></td>
            <td>{row.study_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

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
    { study_id: 'NCT00000001', study_short_name: 'COTC007B', study_name: 'Preclinical Comparison Study' },
  ],
};

describe('ProgramDetailsView', () => {
  it('renders the program short name and full name in the header', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getAllByText('COP').length).toBeGreaterThan(0);
    expect(screen.getByText('Comparative Oncology Program')).toBeInTheDocument();
  });

  it('renders the program full description', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getByText(program.program_full_description)).toBeInTheDocument();
  });

  it('renders the associated study count pill in the banner', () => {
    render(<ProgramDetailsView program={program} />);
    const pill = screen.getByRole('button', { name: '1 ASSOCIATED STUDY' });
    expect(pill).toBeInTheDocument();
  });

  it('renders the study count pill with the plural label', () => {
    render(
      <ProgramDetailsView
        program={{ ...program, studies: [...program.studies, { study_id: 'NCT00000002', study_name: 'Second' }] }}
      />,
    );
    expect(screen.getByRole('button', { name: '2 ASSOCIATED STUDIES' })).toBeInTheDocument();
  });

  it('does not render a Program Metadata section', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.queryByText('PROGRAM METADATA')).not.toBeInTheDocument();
    expect(screen.queryByText('crdc-program-cop')).not.toBeInTheDocument();
  });

  it('renders a studies list with links to Study Details', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getByRole('heading', { name: 'ASSOCIATED STUDIES' })).toBeInTheDocument();
    const link = screen.getByText('NCT00000001').closest('a');
    expect(link).toHaveAttribute('href', '/study/NCT00000001');
    expect(screen.getByText('Preclinical Comparison Study').closest('table')).toBeInTheDocument();
  });

  it('renders no Host Videos heading or empty text, and no Materials section, when none are curated', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.queryByText('HOST VIDEOS')).not.toBeInTheDocument();
    expect(screen.queryByText(/No videos are currently available/)).not.toBeInTheDocument();
    expect(screen.queryByText(/MATERIALS/)).not.toBeInTheDocument();
  });

  it('renders a not-found message for an unknown program', () => {
    render(<ProgramDetailsView notFound program={null} />);
    expect(screen.getByText(/No program matches this identifier/)).toBeInTheDocument();
  });

  it('renders a breadcrumb link back to the Portfolio page (UT12)', () => {
    render(<ProgramDetailsView program={program} />);
    expect(screen.getByText('Programs & Initiatives').closest('a')).toHaveAttribute('href', '/portfolio');
  });

  it('renders the Initiatives variant with the generic heading and unaffiliated studies', () => {
    render(
      <ProgramDetailsView
        isInitiatives
        unaffiliatedStudies={[{ study_id: 'NCT001', study_short_name: 'UNAFF', study_name: 'Unaffiliated Study' }]}
      />,
    );
    expect(screen.getAllByText('Initiatives').length).toBeGreaterThan(0);
    const link = screen.getByText('NCT001').closest('a');
    expect(link).toHaveAttribute('href', '/study/NCT001');
    expect(screen.getByText('Unaffiliated Study')).toBeInTheDocument();
  });

  it('does not render a Program Metadata section for the Initiatives variant', () => {
    render(<ProgramDetailsView isInitiatives unaffiliatedStudies={[]} />);
    expect(screen.queryByText('PROGRAM METADATA')).not.toBeInTheDocument();
  });

  it('renders a configured Host Video as a playable thumbnail without a visible title or description (UT5)', () => {
    const ncVideo = curatedProgramDetailContent.NCTN.hostVideos[0];
    render(<ProgramDetailsView program={{ ...program, program_short_name: 'NCTN' }} />);
    expect(screen.getByAltText(ncVideo.title)).toHaveAttribute('src', ncVideo.thumbnail);
    expect(screen.queryByText(ncVideo.title)).not.toBeInTheDocument();
    expect(screen.queryByText(ncVideo.description)).not.toBeInTheDocument();
  });

  it('plays a configured Host Video inline when its thumbnail is clicked', () => {
    const ncVideo = curatedProgramDetailContent.NCTN.hostVideos[0];
    render(<ProgramDetailsView program={{ ...program, program_short_name: 'NCTN' }} />);
    fireEvent.click(screen.getByAltText(ncVideo.title).closest('button'));
    const iframe = screen.getByTitle(ncVideo.title);
    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed/'));
  });

  it('design system conformance: header and section title colors match the shared design tokens', () => {
    const { container } = render(<ProgramDetailsView program={program} />);
    const headerMainTitle = container.querySelector('[class*="headerMainTitle-"]');
    const sectionTitle = container.querySelector('[class*="sectionTitle-"]');
    expect(getComputedStyle(headerMainTitle).color).toBe('rgb(13, 111, 148)'); // #0D6F94
    expect(getComputedStyle(sectionTitle).color).toBe('rgb(6, 109, 147)'); // programDetailsColors.sectionTitle
    expect(programDetailsColors.sectionTitle).toBe('#066D93');
  });

  it('renders correctly with a large studies list without errors (realistic data volume check)', () => {
    const manyStudies = Array.from({ length: 200 }, (_, i) => ({
      study_short_name: `STUDY-${i}`,
      study_name: `Study Number ${i}`,
    }));
    const start = performance.now();
    render(<ProgramDetailsView program={{ ...program, studies: manyStudies }} />);
    const duration = performance.now() - start;
    expect(screen.getAllByText(/Study Number/)).toHaveLength(200);
    expect(duration).toBeLessThan(2000);
  });
});
