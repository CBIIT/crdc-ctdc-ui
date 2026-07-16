import { initFilesTableState } from './FilesTable';
import { getFilesWrapperConfig } from '../wrapperConfig';

/**
 * Purpose: Unit tests for initFilesTableState, the pure function that produces
 * the initial table configuration for the participant-detail Files table.
 * Validates default values, spread behavior, and override precedence.
 *
 * Reviewed by [Name] on [Date]
 */

describe('initFilesTableState', () => {
  it('should merge initial state and set all default table properties', () => {
    // Arrange
    const initialState = { customFlag: true };

    // Act
    const state = initFilesTableState(initialState);

    // Assert
    expect(state.customFlag).toBe(true);
    expect(state.title).toBe('Files');
    expect(state.dataKey).toBe('data_file_uuid');
    expect(state.sortBy).toBe('data_file_name');
    expect(state.sortOrder).toBe('asc');
    expect(state.rowsPerPage).toBe(10);
    expect(state.page).toBe(0);
    expect(state.selectedRows).toEqual([]);
    expect(state.tableMsg).toEqual({
      noMatch: 'There are no files available for this participant.',
    });
    expect(state.extendedViewConfig).toEqual({
      pagination: false,
      manageViewColumns: { title: 'View Columns' },
      download: {
        downloadCsv: 'Download Table Contents As CSV',
        downloadFileName: 'CTDC_Participant_Files',
      },
    });
  });

  it('should return correct state when initialState is an empty object', () => {
    // Arrange
    const initialState = {};

    // Act
    const state = initFilesTableState(initialState);

    // Assert
    expect(state.title).toBe('Files');
    expect(state.dataKey).toBe('data_file_uuid');
    expect(state.page).toBe(0);
    expect(state.selectedRows).toEqual([]);
  });

  it('should override initialState properties with hardcoded defaults', () => {
    // Arrange – pass conflicting values to verify override precedence
    const initialState = {
      title: 'ShouldBeOverridden',
      sortBy: 'overridden_field',
      rowsPerPage: 50,
    };

    // Act
    const state = initFilesTableState(initialState);

    // Assert – hardcoded values win
    expect(state.title).toBe('Files');
    expect(state.sortBy).toBe('data_file_name');
    expect(state.rowsPerPage).toBe(10);
  });

  it('should preserve extra properties from initialState that are not overridden', () => {
    // Arrange
    const initialState = { extraProp: 'keep-me', anotherProp: 42 };

    // Act
    const state = initFilesTableState(initialState);

    // Assert
    expect(state.extraProp).toBe('keep-me');
    expect(state.anotherProp).toBe(42);
  });

  it('should set pagination to false in extendedViewConfig', () => {
    // Arrange
    const initialState = {};

    // Act
    const state = initFilesTableState(initialState);

    // Assert
    expect(state.extendedViewConfig.pagination).toBe(false);
  });

  it('should set download fileName to CTDC_Participant_Files', () => {
    // Arrange
    const initialState = {};

    // Act
    const state = initFilesTableState(initialState);

    // Assert
    expect(state.extendedViewConfig.download.downloadFileName).toBe('CTDC_Participant_Files');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getFilesWrapperConfig — button visibility
// ─────────────────────────────────────────────────────────────────────────────
describe('getFilesWrapperConfig', () => {
  it('should always include the paginatedTable container first', () => {
    const config = getFilesWrapperConfig(0);
    expect(config[0]).toEqual({ container: 'paginatedTable', paginatedTable: true });
  });

  it('should not include a buttons container when fileCount is 0', () => {
    const config = getFilesWrapperConfig(0);
    expect(config).toHaveLength(1);
    expect(config.find((c) => c.container === 'buttons')).toBeUndefined();
  });

  it('should include a buttons container when fileCount is 1', () => {
    const config = getFilesWrapperConfig(1);
    expect(config).toHaveLength(2);
    const buttons = config.find((c) => c.container === 'buttons');
    expect(buttons).toBeDefined();
    expect(buttons.clsName).toBe('container_footer');
  });

  it('should include a buttons container when fileCount is greater than 1', () => {
    const config = getFilesWrapperConfig(10);
    expect(config).toHaveLength(2);
    expect(config.find((c) => c.container === 'buttons')).toBeDefined();
  });

  it('should not include a buttons container for negative fileCount', () => {
    // fileCount should never be negative in practice, but the function should not blow up
    const config = getFilesWrapperConfig(-1);
    expect(config).toHaveLength(1);
    expect(config.find((c) => c.container === 'buttons')).toBeUndefined();
  });
});