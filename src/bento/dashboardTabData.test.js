jest.mock("../utils/graphqlClient", () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));

import { tabContainers, tabs } from './dashboardTabData';

describe('Study Files tab configuration', () => {
  const studyFilesTab = tabs.find((t) => t.id === 'study_file_tab');
  const studyFilesContainer = tabContainers.find((t) => t.id === 'study_file_tab');

  describe('tabs entry', () => {
    it('should exist in the tabs array', () => {
      expect(studyFilesTab).toBeDefined();
    });

    it('should have correct title', () => {
      expect(studyFilesTab.title).toBe('Study Files');
    });

    it('should reference numberOfStudyFiles for count', () => {
      expect(studyFilesTab.count).toBe('numberOfStudyFiles');
    });
  });

  describe('tabContainers entry', () => {
    it('should exist in the tabContainers array', () => {
      expect(studyFilesContainer).toBeDefined();
    });

    it('should use StudyFileTabByStudyShortName as paginationAPIField', () => {
      expect(studyFilesContainer.paginationAPIField).toBe('StudyFileTabByStudyShortName');
    });

    it('should use data_file_uuid as dataKey', () => {
      expect(studyFilesContainer.dataKey).toBe('data_file_uuid');
    });

    it('should have selectableRows enabled', () => {
      expect(studyFilesContainer.selectableRows).toBe(true);
    });

    it('should have View Columns enabled in extendedViewConfig', () => {
      expect(studyFilesContainer.extendedViewConfig.manageViewColumns).toBeDefined();
      expect(studyFilesContainer.extendedViewConfig.manageViewColumns.title).toBe('View Columns');
    });

    it('should have CSV download configured', () => {
      expect(studyFilesContainer.extendedViewConfig.download.downloadFileName).toBe('CTDC_Study_Files_download');
    });
  });

  describe('columns', () => {
    const columns = studyFilesContainer.columns;

    it('should have a checkbox column', () => {
      const checkbox = columns.find((c) => c.cellType === 'CHECKBOX');
      expect(checkbox).toBeDefined();
    });

    it('should have File Name, File Type, Format, Size, Description columns displayed', () => {
      const expectedFields = ['data_file_name', 'data_file_type', 'data_file_format', 'data_file_size', 'data_file_description'];
      expectedFields.forEach((field) => {
        const col = columns.find((c) => c.dataField === field);
        expect(col).toBeDefined();
        expect(col.display).toBe(true);
      });
    });

    it('should have Access column with unique dataField', () => {
      const accessCol = columns.find((c) => c.header === 'Access');
      expect(accessCol).toBeDefined();
      expect(accessCol.dataField).toBe('access');
      expect(accessCol.downloadDocument).toBe(true);
    });

    it('Access column should reference data_file_uuid via documentDownloadProps', () => {
      const accessCol = columns.find((c) => c.header === 'Access');
      expect(accessCol.documentDownloadProps.fileLocationColumn).toBe('data_file_uuid');
    });

    it('should have Study Accession column linked to study detail', () => {
      const col = columns.find((c) => c.dataField === 'study_accession');
      expect(col).toBeDefined();
      expect(col.display).toBe(true);
      expect(col.linkAttr.rootPath).toBe('/study');
    });

    it('should have File UUID column hidden by default but toggleable', () => {
      const uuidCol = columns.find((c) => c.header === 'File UUID');
      expect(uuidCol).toBeDefined();
      expect(uuidCol.dataField).toBe('data_file_uuid');
      expect(uuidCol.display).toBe(false);
      expect(uuidCol.hiddenByDefault).toBe(true);
    });

    it('Access and File UUID columns should have different dataFields', () => {
      const accessCol = columns.find((c) => c.header === 'Access');
      const uuidCol = columns.find((c) => c.header === 'File UUID');
      expect(accessCol.dataField).not.toBe(uuidCol.dataField);
    });
  });

  describe('cart configuration', () => {
    it('should use data_file_uuid as addFilesRequestVariableKey', () => {
      expect(studyFilesContainer.addFilesRequestVariableKey).toBe('data_file_uuid');
    });

    it('should have correct addFilesResponseKeys', () => {
      expect(studyFilesContainer.addFilesResponseKeys).toEqual(['StudyFileTabByStudyShortName', 'data_file_uuid']);
    });

    it('should have correct addAllFilesResponseKeys', () => {
      expect(studyFilesContainer.addAllFilesResponseKeys).toEqual(['StudyFileTabByStudyShortName', 'data_file_uuid']);
    });
  });
});
