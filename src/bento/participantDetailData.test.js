import {
  BIOSPECIMEN_BUTTON_TOOLTIP,
  FILES_BUTTON_TOOLTIP,
  showJBrowseButton,
  biospecimenColumns,
  filesColumns,
  headerIcon,
} from './participantDetailData';

/**
 * Purpose: Unit tests for the participantDetailData configuration module.
 * Validates exported constants, column definitions, tooltip copy, feature flags,
 * and structural correctness of table column arrays.
 *
 * Reviewed by [Name] on [Date]
 */

describe('participantDetailData configuration', () => {
  // ────────────────────────────────────────────────────
  // Tooltip text & feature flags
  // ────────────────────────────────────────────────────
  describe('Tooltip text and feature flags', () => {
    it('should define correct biospecimen tooltip copy', () => {
      // Arrange — no setup needed for constant validation

      // Act & Assert
      expect(BIOSPECIMEN_BUTTON_TOOLTIP).toBe(
        'Add files associated with selected biospecimen(s) to cart',
      );
    });

    it('should define correct files tooltip copy', () => {
      // Arrange — no setup needed

      // Act & Assert
      expect(FILES_BUTTON_TOOLTIP).toBe('Add selected file(s) to cart');
    });

    it('should have JBrowse button disabled by default', () => {
      // Arrange — no setup needed

      // Act & Assert
      expect(showJBrowseButton).toBe(false);
    });

    it('should export a headerIcon asset path', () => {
      // Arrange — no setup needed

      // Act & Assert
      expect(headerIcon).toBeDefined();
    });
  });

  // ────────────────────────────────────────────────────
  // Biospecimen column definitions
  // ────────────────────────────────────────────────────
  describe('Biospecimen column definitions', () => {
    it('should start with a CHECKBOX column', () => {
      // Arrange
      const firstColumn = biospecimenColumns[0];

      // Act & Assert
      expect(firstColumn).toEqual({
        cellType: 'CHECKBOX',
        role: 'CHECKBOX',
        display: true,
      });
    });

    it('should contain the expected biospecimen data fields in order', () => {
      // Arrange
      const expectedFields = [
        undefined, // checkbox has no dataField
        'specimen_record_id',
        'specimen_type',
        'specimen_category',
        'anatomical_collection_site',
        'assessment_timepoint',
      ];

      // Act
      const actualFields = biospecimenColumns.map((col) => col.dataField);

      // Assert
      expect(actualFields).toEqual(expectedFields);
    });

    it('should have all display columns set to visible', () => {
      // Arrange & Act
      const allVisible = biospecimenColumns.every((col) => col.display === true);

      // Assert
      expect(allVisible).toBe(true);
    });

    it('should have DISPLAY role for all non-checkbox columns', () => {
      // Arrange
      const displayColumns = biospecimenColumns.slice(1);

      // Act
      const allDisplay = displayColumns.every((col) => col.role === 'DISPLAY');

      // Assert
      expect(allDisplay).toBe(true);
    });

    it('should define exactly 6 columns (1 checkbox + 5 data)', () => {
      // Act & Assert
      expect(biospecimenColumns).toHaveLength(6);
    });

    it('should have header labels for all data columns', () => {
      // Arrange
      const dataColumns = biospecimenColumns.slice(1);

      // Act & Assert
      dataColumns.forEach((col) => {
        expect(col.header).toBeDefined();
        expect(typeof col.header).toBe('string');
        expect(col.header.length).toBeGreaterThan(0);
      });
    });
  });

  // ────────────────────────────────────────────────────
  // Files column definitions
  // ────────────────────────────────────────────────────
  describe('Files column definitions', () => {
    it('should start with a CHECKBOX column', () => {
      // Arrange
      const firstColumn = filesColumns[0];

      // Act & Assert
      expect(firstColumn).toEqual({
        cellType: 'CHECKBOX',
        role: 'CHECKBOX',
        display: true,
      });
    });

    it('should contain the expected file data fields in order', () => {
      // Arrange
      const expectedFields = [
        undefined, // checkbox
        'data_file_name',
        'data_file_type',
        'data_file_format',
        'data_file_size',
        'data_file_description',
      ];

      // Act
      const actualFields = filesColumns.map((col) => col.dataField);

      // Assert
      expect(actualFields).toEqual(expectedFields);
    });

    it('should have all display columns set to visible', () => {
      // Arrange & Act
      const allVisible = filesColumns.every((col) => col.display === true);

      // Assert
      expect(allVisible).toBe(true);
    });

    it('should have DISPLAY role for all non-checkbox columns', () => {
      // Arrange
      const displayColumns = filesColumns.slice(1);

      // Act
      const allDisplay = displayColumns.every((col) => col.role === 'DISPLAY');

      // Assert
      expect(allDisplay).toBe(true);
    });

    it('should define exactly 6 columns (1 checkbox + 5 data)', () => {
      // Act & Assert
      expect(filesColumns).toHaveLength(6);
    });

    it('should have header labels for all data columns', () => {
      // Arrange
      const dataColumns = filesColumns.slice(1);

      // Act & Assert
      dataColumns.forEach((col) => {
        expect(col.header).toBeDefined();
        expect(typeof col.header).toBe('string');
        expect(col.header.length).toBeGreaterThan(0);
      });
    });
  });
});
