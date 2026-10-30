import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { visit } from 'graphql';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { csv2json } from 'json-2-csv';
import ClinicalDataController from './ClinicalDataController';
import PaginatedTableView from '../../../../components/PaginatedTable/TableView';
import CsvDownload from '../../../../components/PaginatedTable/Customize/components/CsvDownload';
import { clearNodeDescriptionCache, fetchNodeDescriptions } from './services/nodeDescriptionService';
import { prepareTableRows } from './clinicalDataTableUtils';
import { GET_STUDY_DETAIL_DATA_QUERY, studyClinicalDataQuery, table, therapyNodeMetadata } from '../../../../bento/studyDetailData';
import env from '../../../../utils/env';

jest.mock('@apollo/client', () => ({ ...jest.requireActual('@apollo/client'), useQuery: jest.fn() }));
jest.mock('axios', () => ({ get: jest.fn() }));
jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
jest.mock('../../../../bento-core', () => ({ ToolTip: ({ children }) => children }));
jest.mock('../../../../utils/graphqlClient', () => ({ client: { query: jest.fn(), mutate: jest.fn() } }));
jest.mock('../../../../utils/env', () => ({
  __esModule: true,
  default: { REACT_APP_DATA_MODEL_FILE: 'https://example.invalid/model-4.0.0.yaml' },
  getEnvBoolean: (value, fallback) => (value === undefined ? fallback : value),
}));
jest.mock('../../../../components/PaginatedTable/TableView', () => jest.fn(() => null));

// Synthetic records exercise the unified contract without relying on local data.
const records = [
  {
    participant_ids: 'test-participant-1', therapy_record_id: 'test-therapy-1',
    therapy_name: 'Example "A", combination|name', therapy_type: '', therapy_category: 'Targeted',
    current_response_to_therapy: 'Current example', best_response_to_therapy: 'Best example',
    therapy_dose: '25', therapy_dose_units: 'mg', therapy_frequency: 'daily',
    therapy_description: 'First line\nSecond line', __typename: 'ClinicalTherapy',
  },
  {
    participant_ids: 'test-participant-1', therapy_record_id: 'test-therapy-2',
    therapy_name: 'Example B', therapy_type: null, therapy_category: 'Non-Targeted',
  },
];
const model = 'Nodes:\n  therapy:\n    Desc: Unified therapy test definition\n  targeted_therapy:\n    Desc: Obsolete definition\n';
const readBlob = (blob, binary = false) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  if (binary) reader.readAsArrayBuffer(blob);
  else reader.readAsText(blob);
});
const parseCSV = (csv) => csv2json(csv);
const fieldNames = (document) => {
  const names = [];
  visit(document, { Field: ({ name }) => { names.push(name.value); } });
  return names;
};

describe('Study Therapy migration (C6)', () => {
  let container;
  let queryResult;
  let counts;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
    clearNodeDescriptionCache();
    axios.get.mockResolvedValue({ data: model });
    counts = { participantCount: { therapy: 1 }, nodeCount: { therapy: 2 } };
    queryResult = { data: { clinicalData: [], clinicalTrialData: [{ therapyNodeData: records }] } };
    useQuery.mockImplementation(() => queryResult);
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    jest.restoreAllMocks();
  });

  const render = async (element) => {
    await act(async () => { ReactDOM.render(element, container); });
  };
  const renderController = (studyId = 'test-study') => render(
    <ClinicalDataController study_id={studyId} study_short_name="TEST" dataCount={counts} />,
  );
  const rows = () => PaginatedTableView.mock.calls[PaginatedTableView.mock.calls.length - 1][0].tblRows;
  const therapy = () => rows().find(({ countKey }) => countKey === 'therapy');

  it('requests only unified Therapy fields and binds both Study count aliases to therapy', () => {
    [studyClinicalDataQuery, GET_STUDY_DETAIL_DATA_QUERY].forEach((query) => {
      expect(fieldNames(query).filter((name) => /^(targetedTherapy|nonTargetedTherapy)/.test(name))).toEqual([]);
    });
    const aliases = {};
    visit(GET_STUDY_DETAIL_DATA_QUERY, {
      Field: ({ name, alias }) => {
        if (['therapyNodeCount', 'therapyParticipantCount'].includes(name.value)) aliases[name.value] = alias.value;
      },
    });
    expect(aliases).toEqual({ therapyNodeCount: 'therapy', therapyParticipantCount: 'therapy' });
    expect(fieldNames(studyClinicalDataQuery)).toEqual(expect.arrayContaining([
      'therapyNodeData', 'therapyNodeCount', 'therapyParticipantCount',
    ]));
  });

  it('keeps the CSV manifest aligned with all selected Therapy record fields', () => {
    let selected;
    visit(studyClinicalDataQuery, {
      Field: ({ name, selectionSet }) => {
        if (name.value === 'therapyNodeData') selected = selectionSet.selections.map((field) => field.name.value);
      },
    });
    expect(therapyNodeMetadata.keysToInclude).toEqual(selected);
    expect(therapyNodeMetadata.header).toEqual(selected);
    expect(new Set(selected).size).toBe(selected.length);
    expect(selected).toEqual(expect.arrayContaining([
      'participant_ids', 'therapy_record_id', 'therapy_name', 'therapy_type', 'therapy_category',
      'current_response_to_therapy', 'best_response_to_therapy', 'therapy_dose', 'therapy_dose_units',
      'therapy_frequency', 'therapy_start_date', 'therapy_end_date',
    ]));
  });

  it('renders one Therapy row with unified counts, records, definition and filename', async () => {
    await renderController();
    expect(rows().map(({ title }) => title)).toEqual(['Diagnosis', 'Participant Status', 'Therapy', 'Surgery', 'Radiotherapy']);
    expect(therapy()).toEqual(expect.objectContaining({
      clinicalDataNode: 'Therapy', clinicalDataDescription: 'Unified therapy test definition',
      recordCount: 2, participantCount: 1, csvDataRow: records, node: records,
      fileName: 'CTDC_Clinical_Data-TEST-THERAPY', metadata: therapyNodeMetadata, isCsvDisabled: false,
    }));
    expect(therapy().csvDataRow).toBe(records);
    expect(axios.get).toHaveBeenCalledWith(env.REACT_APP_DATA_MODEL_FILE);
    expect(useQuery).toHaveBeenCalledWith(studyClinicalDataQuery, { variables: { study_id: ['test-study'] } });
  });

  it('uses the configured model once and shares its cached definitions across calls', async () => {
    const [first, second] = await Promise.all([fetchNodeDescriptions(), fetchNodeDescriptions()]);
    expect(first.therapy).toBe('Unified therapy test definition');
    expect(second).toBe(first);
    expect(await fetchNodeDescriptions()).toBe(first);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('shows zero counts and disables downloads for a study without any clinical records', async () => {
    queryResult = { data: { clinicalData: [], clinicalTrialData: [] } };
    await renderController();
    expect(therapy()).toEqual(expect.objectContaining({ recordCount: 0, participantCount: 0, csvDataRow: [], isCsvDisabled: true }));
    expect(container.querySelector('button').disabled).toBe(true);
    await render(<CsvDownload {...therapy()} />);
    expect(container.querySelector('[role="button"]')).toBeNull();
    expect(container.querySelector('[aria-disabled="true"]')).not.toBeNull();
  });

  it('leaves the Therapy export absent when only another node has records', async () => {
    counts = { participantCount: { diagnosis: 1 }, nodeCount: { diagnosis: 1 } };
    queryResult = { data: { clinicalData: [{ diagnosisNodeData: [{ diagnosis_record_id: 'test-diagnosis' }] }], clinicalTrialData: [] } };
    await renderController();
    expect(therapy()).toEqual(expect.objectContaining({ recordCount: 0, participantCount: 0, csvDataRow: [] }));
    expect(container.querySelector('button').disabled).toBe(false);
    await render(<CsvDownload {...therapy()} />);
    expect(container.querySelector('[role="button"]')).toBeNull();
  });

  it('keeps records available if the model definition request fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('Model unavailable'));
    await renderController();
    expect(therapy().clinicalDataDescription).toBe('');
    expect(therapy().csvDataRow).toBe(records);
    expect(container.querySelector('button').disabled).toBe(false);
  });

  it('reports GraphQL errors without offering stale records for download', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    queryResult = { error: new Error('Study query failed') };
    await renderController();
    expect(container.textContent).toContain('Error loading clinical data: Study query failed');
    expect(PaginatedTableView).not.toHaveBeenCalled();
  });

  it('changes Study scope and clears prior Therapy records on an empty study', async () => {
    await renderController();
    queryResult = { loading: true };
    PaginatedTableView.mockClear();
    await renderController('empty-study');
    expect(PaginatedTableView).not.toHaveBeenCalled();
    queryResult = { data: { clinicalData: [], clinicalTrialData: [] } };
    await renderController('empty-study');
    expect(useQuery).toHaveBeenLastCalledWith(studyClinicalDataQuery, { variables: { study_id: ['empty-study'] } });
    expect(therapy().csvDataRow).toEqual([]);
    expect(container.querySelector('button').disabled).toBe(true);
  });

  it('downloads the actual Therapy CSV with both categories and correctly escaped scalar values', async () => {
    await renderController();
    await render(<CsvDownload {...therapy()} />);
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => 'blob:test-csv');
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    try {
      act(() => { container.querySelector('[role="button"]').click(); });
      const csv = await readBlob(URL.createObjectURL.mock.calls[0][0]);
      expect(csv.replace(/^\uFEFF/, '').split('\r\n')[0]).toBe(therapyNodeMetadata.header.join(','));
      const exported = await parseCSV(csv.replace(/^\uFEFF/, ''));
      expect(exported).toHaveLength(2);
      expect(exported[0]).toEqual(expect.objectContaining({
        therapy_record_id: 'test-therapy-1', therapy_name: records[0].therapy_name,
        therapy_description: records[0].therapy_description, therapy_category: 'Targeted', therapy_type: '',
      }));
      expect(exported[1].therapy_category).toBe('Non-Targeted');
      expect(exported[1].therapy_type).toBe('');
      expect(csv).not.toContain('__typename');
      expect(click.mock.instances[0].download).toMatch(/^CTDC_Clinical_Data-TEST-THERAPY .*\.csv$/);
    } finally {
      URL.createObjectURL = originalCreateObjectURL;
    }
  });

  it('includes exactly one Therapy CSV in Download All using the same columns and records', async () => {
    await renderController();
    await act(async () => {
      container.querySelector('button').click();
      for (let attempt = 0; attempt < 50 && !saveAs.mock.calls.length; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    });
    expect(saveAs).toHaveBeenCalledTimes(1);
    const [blob, filename] = saveAs.mock.calls[0];
    expect(filename).toMatch(/^CTDC_Clinical_Data-TEST .*\.zip$/);
    const zip = await JSZip.loadAsync(await readBlob(blob, true));
    expect(Object.keys(zip.files)).toHaveLength(1);
    const entry = Object.values(zip.files)[0];
    expect(entry.name).toMatch(/^CTDC_Clinical_Data-TEST-THERAPY .*\.csv$/);
    const csv = await entry.async('string');
    expect(csv.split('\r\n')[0]).toBe(therapyNodeMetadata.header.join(','));
    expect((await parseCSV(csv)).map((row) => row.therapy_record_id)).toEqual(['test-therapy-1', 'test-therapy-2']);
  });

  it('ignores retired node keys when preparing the unified Therapy row', () => {
    const prepared = prepareTableRows({
      tableRows: table.rows, descriptions: { therapy: 'Unified definition' }, studyShortName: 'TEST',
      nodeData: { therapyNodeData: records, targetedTherapyNodeData: [{ therapy_name: 'obsolete' }] },
      participantCount: { therapy: 1, targeted_therapy: 99 }, nodeCount: { therapy: 2, targeted_therapy: 999 },
    });
    const row = prepared.find(({ countKey }) => countKey === 'therapy');
    expect(row.participantCount).toBe(1);
    expect(row.recordCount).toBe(2);
    expect(row.node).toBe(records);
  });
});
