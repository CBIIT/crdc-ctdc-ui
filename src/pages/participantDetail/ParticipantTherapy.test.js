import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useQuery } from '@apollo/client';
import ParticipantDetailController from './participantDetailController';
import * as queries from '../../bento/dashboardTabData';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
}));
jest.mock('../../utils/graphqlClient', () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));
jest.mock('../../components/Breadcrumb/BreadcrumbView', () => () => null);
jest.mock('./participantDetailView', () => {
  const React = require('react');
  const HeaderPanel = require('./components/HeaderPanel').default;
  // Render the real header so these cases cover API arrays through visible rows.
  // Tables and global stats have their own suites.
  return ({ participant }) => <HeaderPanel classes={{}} participant={participant} />;
});

const fields = [
  ['Therapy Name', 'therapy_name'],
  ['Therapy Type', 'therapy_type'],
  ['Therapy Category', 'therapy_category'],
  ['Current Response', 'current_response_to_therapy'],
  ['Best Response', 'best_response_to_therapy'],
];

// Synthetic values deliberately have unequal list lengths: fields are independent,
// and no association between a name, category, type or response can be inferred.
const populated = Object.freeze({
  therapy_name: Object.freeze([' A ', '', 'B', 'C']),
  therapy_type: Object.freeze([' Chemotherapy ']),
  therapy_category: Object.freeze(['Targeted', 'Non-Targeted']),
  current_response_to_therapy: Object.freeze([' Current response ']),
  best_response_to_therapy: Object.freeze(['Best one', 'Best two']),
});

describe('Participant Therapy panel (C5)', () => {
  let container;
  let records;
  let loading;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    records = { first: populated };
    loading = false;
    useQuery.mockReset();
    useQuery.mockImplementation((query, { variables }) => {
      if (query === queries.GET_PARTICIPANTS_OVERVIEW_QUERY) {
        return { loading, data: { participantOverview: [{
          ...records[variables.participant_id[0]],
          therapy_string: 'must not be used for display',
        }] } };
      }
      if (query === queries.GET_BIOSPECIMENS_OVERVIEW_QUERY) {
        return { data: { biospecimenOverview: [] } };
      }
      if (query === queries.GET_FILES_OVERVIEW_QUERY) {
        return { data: { fileOverview: [] } };
      }
      throw new Error('Unexpected Participant Details query');
    });
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
  });

  const render = (id = 'first') => act(() => {
    ReactDOM.render(<ParticipantDetailController match={{ params: { id } }} />, container);
  });
  const therapyRows = () => fields.map(([label]) => {
    const labelElement = [...container.querySelectorAll('span')]
      .find((element) => element.textContent === `${label}:`);
    return labelElement.nextElementSibling.textContent;
  });

  it('renders all five independent lists under THERAPY without truncating or pairing values', () => {
    render();
    expect(therapyRows()).toEqual([
      'A, B, C', 'Chemotherapy', 'Targeted, Non-Targeted', 'Current response', 'Best one, Best two',
    ]);
    expect([...container.querySelectorAll('div')].some((el) => el.textContent === 'THERAPY')).toBe(true);
    expect(container.textContent).not.toContain('must not be used for display');
    expect(records.first).toBe(populated);
  });

  it.each([[null], [undefined], [[]], [['']], [''], [[null, '', '   ']]])(
    'renders N/A for every missing or blank Therapy field: %j', (value) => {
      records.first = Object.fromEntries(fields.map(([, field]) => [field, value]));
      render();
      expect(therapyRows()).toEqual(Array(5).fill('N/A'));
    },
  );

  it('keeps literal commas and pipes in names while displaying a missing Type as N/A', () => {
    records.first = { ...populated, therapy_name: [' name, with comma|pipe '], therapy_type: [] };
    render();
    expect(therapyRows()).toEqual([
      'name, with comma|pipe', 'N/A', 'Targeted, Non-Targeted', 'Current response', 'Best one, Best two',
    ]);
  });

  it('changes participant scope on navigation and replaces all five rows, including newly empty fields', () => {
    render();
    records.second = {
      therapy_name: ['Other therapy'], therapy_type: [], therapy_category: [],
      current_response_to_therapy: [], best_response_to_therapy: [],
    };
    useQuery.mockClear();
    loading = true;
    render('second');
    expect(container.querySelector('[role="progressbar"]')).not.toBeNull();
    expect(container.textContent).not.toContain('A, B, C');

    loading = false;
    render('second');
    expect(therapyRows()).toEqual(['Other therapy', 'N/A', 'N/A', 'N/A', 'N/A']);
    expect(container.textContent).toContain('second');
    useQuery.mock.calls.forEach(([, { variables }]) => {
      expect(variables.participant_id).toEqual(['second']);
      ['therapy_string', 'therapy_type', 'therapy_category'].forEach((field) => {
        expect(variables[field]).toBeUndefined();
      });
    });
  });
});
