import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ProgramDetailsController from './programDetailsController';
import { GET_PROGRAM_DETAIL_QUERY, GET_PROGRAM_STUDY_TABLE_QUERY } from '../../bento/programDetailsData';
import { GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY } from '../../bento/portfolioData';
import { GET_GLOBAL_STATS_DATA_QUERY } from '../../bento/globalStatsData';

// Keep both stats controllers/renderers real; mock only the API and unrelated table/repository loading.
jest.mock('@apollo/client', () => ({ useQuery: jest.fn() }));
jest.mock('../../bento-core', () => ({
  cellTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM', DISPLAY: 'DISPLAY' },
  headerTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM' },
  TableContextProvider: ({ children }) => children,
}));
jest.mock('../../bento/dashboardTabData', () => ({
  defaultFilters: {
    files: { association: ['biospecimen', 'participant'] },
    studyFiles: { association: ['study'] },
  },
}));
jest.mock('../../utils/repositories', () => ({
  ...jest.requireActual('../../utils/repositories'),
  loadRepositoryConfig: jest.fn().mockResolvedValue(new Map()),
}));
jest.mock('../../components/DataAvailabilityTable/StudiesTable', () => () => <div data-testid="studies-table" />);

const first = { study_id: 'test-study-1', study_short_name: 'FIRST', study_name: 'First Study' };
const second = { study_id: 'test-study-2', study_short_name: 'SECOND', study_name: 'Second Study' };
const third = { study_id: 'test-study-3', study_short_name: 'THIRD', study_name: 'Third Study' };
const unaffiliated = { study_id: 'test-study-4', study_short_name: 'UNAFFILIATED', study_name: 'Unaffiliated Study' };
const makeProgram = (shortName, studies) => ({
  program_short_name: shortName, program_name: `Program ${shortName}`, studies,
});
const statsResponse = (studies, participants, therapies, files) => ({
  searchParticipants: {
    numberOfStudies: studies, numberOfParticipants: participants,
    numberOfTherapies: therapies, numberOfSpecimens: 0, numberOfFiles: files + 10,
  },
  filesTabCount: { numberOfFiles: files },
  studyFilesTabCount: { numberOfStudyFiles: 10 },
});
const setupQueries = (initiativeStudies = [unaffiliated]) => {
  const programs = {
    ALPHA: makeProgram('ALPHA', [first, second]),
    BETA: makeProgram('BETA', [third]),
    EMPTY: makeProgram('EMPTY', []),
  };
  const totals = {
    'FIRST,SECOND': statsResponse(2, 20, 4, 100),
    THIRD: statsResponse(1, 30, 7, 200),
    UNAFFILIATED: statsResponse(1, 40, 9, 300),
  };
  useQuery.mockReset();
  useQuery.mockImplementation((query, options = {}) => {
    if (options.skip) return { loading: false };
    if (query === GET_PROGRAM_DETAIL_QUERY) {
      const program = programs[options.variables.programShortName[0]];
      return { data: { getAllPrograms: program ? [program] : [] } };
    }
    if (query === GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY) {
      return { data: { getAllPrograms: [{ studies: initiativeStudies }] } };
    }
    if (query === GET_PROGRAM_STUDY_TABLE_QUERY) {
      return { data: { getAllStudies: [first, second, third, ...initiativeStudies] } };
    }
    if (query === GET_GLOBAL_STATS_DATA_QUERY) {
      const scope = options.variables.study_short_name?.join(',');
      return { data: totals[scope] || statsResponse(99, 999, 999, 999) };
    }
    throw new Error('Unexpected query');
  });
};
const renderPage = (shortName) => {
  const history = createMemoryHistory({ initialEntries: [shortName ? `/program-details/${shortName}` : '/program-details'] });
  render(
    <Router history={history}>
      <Route path="/program-details/:programShortName?" component={ProgramDetailsController} />
    </Router>,
  );
  return history;
};
const getCount = (title) => screen.getByText(title, { selector: '[id^="statsbar_title_"]' }).previousElementSibling;
const statsCalls = () => useQuery.mock.calls.filter(([query]) => query === GET_GLOBAL_STATS_DATA_QUERY);

it('updates the actual stats bar and scoped query when navigating between programs and Initiatives', async () => {
  setupQueries();
  const history = renderPage('ALPHA');
  await waitFor(() => expect(getCount('PARTICIPANTS')).toHaveTextContent(/^20$/));
  expect(getCount('STUDIES')).toHaveTextContent(/^2$/);
  expect(getCount('THERAPIES')).toHaveTextContent(/^4$/);
  expect(getCount('FILES')).toHaveTextContent(/^100$/);
  expect(statsCalls().slice(-1)[0][1].variables).toEqual({
    study_short_name: ['FIRST', 'SECOND'],
    files_association: ['biospecimen', 'participant'],
    study_association: ['study'],
  });

  act(() => history.push('/program-details/BETA'));
  await waitFor(() => expect(getCount('PARTICIPANTS')).toHaveTextContent(/^30$/));
  expect(getCount('STUDIES')).toHaveTextContent(/^1$/);
  expect(getCount('THERAPIES')).toHaveTextContent(/^7$/);
  expect(getCount('FILES')).toHaveTextContent(/^200$/);
  expect(statsCalls().slice(-1)[0][1].variables.study_short_name).toEqual(['THIRD']);

  act(() => history.push('/program-details'));
  await waitFor(() => expect(getCount('PARTICIPANTS')).toHaveTextContent(/^40$/));
  expect(getCount('THERAPIES')).toHaveTextContent(/^9$/);
  expect(getCount('FILES')).toHaveTextContent(/^300$/);
  expect(statsCalls().slice(-1)[0][1].variables.study_short_name).toEqual(['UNAFFILIATED']);
});

it('shows zero totals without querying global stats for an empty program', async () => {
  setupQueries();
  renderPage('EMPTY');
  await screen.findByText('Program EMPTY');
  ['STUDIES', 'PARTICIPANTS', 'DIAGNOSES', 'THERAPIES', 'BIOSPECIMENS', 'FILES'].forEach((label) => {
    expect(getCount(label)).toHaveTextContent(/^0$/);
  });
  expect(statsCalls()).toHaveLength(0);
});

it('shows zero totals without querying global stats when Initiatives has no studies', async () => {
  setupQueries([]);
  renderPage(null);
  await screen.findByText('No studies are currently linked to this initiative.');
  ['STUDIES', 'PARTICIPANTS', 'DIAGNOSES', 'THERAPIES', 'BIOSPECIMENS', 'FILES'].forEach((label) => {
    expect(getCount(label)).toHaveTextContent(/^0$/);
  });
  expect(statsCalls()).toHaveLength(0);
});

it('does not display global totals for an unknown program', async () => {
  setupQueries();
  renderPage('UNKNOWN');
  await screen.findByText(/No program matches this identifier/);
  expect(getCount('STUDIES')).toHaveTextContent(/^0$/);
  expect(getCount('PARTICIPANTS')).toHaveTextContent(/^0$/);
  expect(statsCalls()).toHaveLength(0);
});
