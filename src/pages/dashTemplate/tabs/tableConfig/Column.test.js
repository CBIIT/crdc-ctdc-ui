import { configColumn, CustomCellView } from './Column';
import { cellTypes, headerTypes } from '@bento-core/table';

jest.mock("../../../../utils/graphqlClient", () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));

describe('configColumn', () => {
  it('should include columns with display: true', () => {
    const columns = [
      { dataField: 'name', header: 'Name', display: true, role: cellTypes.DISPLAY },
      { dataField: 'age', header: 'Age', display: true, role: cellTypes.DISPLAY },
    ];
    const result = configColumn(columns);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.dataField)).toEqual(['name', 'age']);
  });

  it('should exclude columns with display: false', () => {
    const columns = [
      { dataField: 'name', header: 'Name', display: true, role: cellTypes.DISPLAY },
      { dataField: 'hidden', header: 'Hidden', display: false, role: cellTypes.DISPLAY },
    ];
    const result = configColumn(columns);
    expect(result).toHaveLength(1);
    expect(result[0].dataField).toBe('name');
  });

  it('should include columns with display: false and hiddenByDefault: true', () => {
    const columns = [
      { dataField: 'name', header: 'Name', display: true, role: cellTypes.DISPLAY },
      { dataField: 'uuid', header: 'File UUID', display: false, hiddenByDefault: true, role: cellTypes.DISPLAY },
    ];
    const result = configColumn(columns);
    expect(result).toHaveLength(2);
    expect(result[1].dataField).toBe('uuid');
    expect(result[1].display).toBe(false);
  });

  it('should not include columns with display: false without hiddenByDefault', () => {
    const columns = [
      { dataField: 'stage', header: 'Stage', display: false, role: cellTypes.DISPLAY },
    ];
    const result = configColumn(columns);
    expect(result).toHaveLength(0);
  });

  it('should add customCellRender for CUSTOM_ELEM columns', () => {
    const columns = [
      { dataField: 'access', header: 'Access', display: true, cellType: cellTypes.CUSTOM_ELEM, role: cellTypes.DISPLAY },
    ];
    const result = configColumn(columns);
    expect(result[0].customCellRender).toBeDefined();
    expect(typeof result[0].customCellRender).toBe('function');
  });

  it('should add customColHeaderRender for CUSTOM_ELEM header columns', () => {
    const columns = [
      { dataField: 'name', header: 'Name', display: true, headerType: headerTypes.CUSTOM_ELEM, role: cellTypes.DISPLAY },
    ];
    const result = configColumn(columns);
    expect(result[0].customColHeaderRender).toBeDefined();
    expect(typeof result[0].customColHeaderRender).toBe('function');
  });

  it('should preserve original column properties', () => {
    const columns = [
      { dataField: 'uuid', header: 'File UUID', display: false, hiddenByDefault: true, tooltipText: 'sort', role: cellTypes.DISPLAY },
    ];
    const result = configColumn(columns);
    expect(result[0].header).toBe('File UUID');
    expect(result[0].tooltipText).toBe('sort');
    expect(result[0].hiddenByDefault).toBe(true);
  });
});

describe('download file-size metadata', () => {
  it('passes raw bytes to the download component without display formatting', () => {
    const cell = CustomCellView({
      downloadDocument: true,
      dataField: 'access',
      data_file_size: 52428801,
      data_file_format: 'pdf',
      documentDownloadProps: {
        fileSizeColumn: 'data_file_size',
        fileFormatColumn: 'data_file_format',
      },
    });

    expect(cell.props.fileSize).toBe(52428801);
    expect(cell.props.fileFormat).toBe('pdf');
  });
});
