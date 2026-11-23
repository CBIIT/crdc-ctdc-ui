import { programStudiesTable } from './programDetailsData';
import { pageData as studiesPageData } from './studiesData';

// studiesData pulls in bento-core (and react-markdown, which Jest can't parse); only these constants are used
// (jest.mock is hoisted above the imports).
jest.mock('../bento-core', () => ({
  cellTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM', DISPLAY: 'DISPLAY' },
  headerTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM' },
}));

describe('programStudiesTable CSV download', () => {
  const { download } = programStudiesTable.extendedViewConfig;

  it('exports every visible column, in the table order', () => {
    expect(download.keysToInclude).toEqual(programStudiesTable.columns.map((column) => column.dataField));
    expect(download.keysToInclude).toEqual(expect.arrayContaining(['program_short_name', 'study_accession']));
  });

  it('uses the table column headers as the CSV header row', () => {
    expect(download.header).toEqual(programStudiesTable.columns.map((column) => column.header));
  });

  it('does not change the Studies page download config', () => {
    expect(download).not.toBe(studiesPageData.table.extendedViewConfig.download);
    expect(studiesPageData.table.extendedViewConfig.download.keysToInclude).not.toContain('program_short_name');
  });
});
