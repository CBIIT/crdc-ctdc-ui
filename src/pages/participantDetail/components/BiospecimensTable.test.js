import { initBiospecimenTableState } from './BiospecimensTable';

/**
 * Purpose: Unit tests for initBiospecimenTableState, the pure function that produces
 * the initial table configuration for the participant-detail Biospecimens table.
 * Validates default values, spread behavior, override precedence, and edge cases.
 *
 * Reviewed by [Name] on [Date]
 */

describe('initBiospecimenTableState', () => {
  it('should merge initial state and set all default biospecimen table properties', () => {
    // Arrange
    const initialState = { customFlag: true };

    // Act
    const state = initBiospecimenTableState(initialState);

    // Assert
    expect(state.customFlag).toBe(true);
    expect(state.title).toBe('Biospecimens');
    expect(state.dataKey).toBe('specimen_record_id');
    expect(state.sortBy).toBe('specimen_record_id');
    expect(state.sortOrder).toBe('asc');
    expect(state.rowsPerPage).toBe(10);
    expect(state.page).toBe(0);
    expect(state.selectedRows).toEqual([]);
    expect(state.tableMsg).toEqual({
      noMatch: 'No biospecimens associated with this participant.',
    });
    expect(state.extendedViewConfig).toEqual({
      pagination: false,
      manageViewColumns: { title: 'View Columns' },
      download: {
        downloadCsv: 'Download Table Contents As CSV',
        downloadFileName: 'CTDC_Participant_Biospecimens',
      },
    });
  });

  it('should return correct state when initialState is an empty object', () => {
    // Arrange
    const initialState = {};

    // Act
    const state = initBiospecimenTableState(initialState);

    // Assert
    expect(state.title).toBe('Biospecimens');
    expect(state.dataKey).toBe('specimen_record_id');
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
    const state = initBiospecimenTableState(initialState);

    // Assert – hardcoded values win
    expect(state.title).toBe('Biospecimens');
    expect(state.sortBy).toBe('specimen_record_id');
    expect(state.rowsPerPage).toBe(10);
  });

  it('should preserve extra properties from initialState that are not overridden', () => {
    // Arrange
    const initialState = { extraProp: 'keep-me', anotherProp: 42 };

    // Act
    const state = initBiospecimenTableState(initialState);

    // Assert
    expect(state.extraProp).toBe('keep-me');
    expect(state.anotherProp).toBe(42);
  });

  it('should set pagination to false in extendedViewConfig', () => {
    // Arrange
    const initialState = {};

    // Act
    const state = initBiospecimenTableState(initialState);

    // Assert
    expect(state.extendedViewConfig.pagination).toBe(false);
  });

  it('should set download fileName to CTDC_Participant_Biospecimens', () => {
    // Arrange
    const initialState = {};

    // Act
    const state = initBiospecimenTableState(initialState);

    // Assert
    expect(state.extendedViewConfig.download.downloadFileName).toBe(
      'CTDC_Participant_Biospecimens',
    );
  });

  it('should use specimen_record_id as the default sort column', () => {
    // Arrange
    const initialState = {};

    // Act
    const state = initBiospecimenTableState(initialState);

    // Assert – biospecimens sort by specimen_record_id, unlike files which sort by data_file_name
    expect(state.sortBy).toBe('specimen_record_id');
  });
});