import {
  isAddButtonDisabled,
  computeIdsToAdd,
  exceedsCartLimit,
} from './AddBiospecimenFilesButton';
import { getBiospecimenWrapperConfig } from '../wrapperConfig';

/**
 * Purpose: Unit tests for the pure helper functions extracted from
 * AddBiospecimenFilesButton, covering the button disable predicate,
 * cart de-duplication logic, and cart-limit overflow check.
 */

// ─────────────────────────────────────────────────────────────────────────────
// isAddButtonDisabled
// ─────────────────────────────────────────────────────────────────────────────
describe('isAddButtonDisabled', () => {
  it('should be disabled when no rows are selected', () => {
    // Arrange
    const specimenIdsWithFiles = new Set(['sp-1', 'sp-2']);

    // Act & Assert
    expect(isAddButtonDisabled([], specimenIdsWithFiles)).toBe(true);
  });

  it('should be disabled when selected rows have no associated files', () => {
    // Arrange
    const specimenIdsWithFiles = new Set(['sp-1', 'sp-2']);

    // Act & Assert
    expect(isAddButtonDisabled(['sp-3', 'sp-4'], specimenIdsWithFiles)).toBe(true);
  });

  it('should be enabled when at least one selected row has associated files', () => {
    // Arrange
    const specimenIdsWithFiles = new Set(['sp-1', 'sp-2']);

    // Act & Assert
    expect(isAddButtonDisabled(['sp-2', 'sp-3'], specimenIdsWithFiles)).toBe(false);
  });

  it('should be enabled when all selected rows have associated files', () => {
    // Arrange
    const specimenIdsWithFiles = new Set(['sp-1', 'sp-2']);

    // Act & Assert
    expect(isAddButtonDisabled(['sp-1', 'sp-2'], specimenIdsWithFiles)).toBe(false);
  });

  it('should be disabled when specimenIdsWithFiles is empty', () => {
    // Arrange
    const specimenIdsWithFiles = new Set();

    // Act & Assert
    expect(isAddButtonDisabled(['sp-1'], specimenIdsWithFiles)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// computeIdsToAdd
// ─────────────────────────────────────────────────────────────────────────────
describe('computeIdsToAdd', () => {
  it('should return all fetched IDs when the cart is empty', () => {
    // Arrange
    const fetchedIds = ['file-1', 'file-2', 'file-3'];

    // Act
    const result = computeIdsToAdd(fetchedIds, []);

    // Assert
    expect(result).toEqual(['file-1', 'file-2', 'file-3']);
  });

  it('should return an empty array when all fetched IDs are already in the cart', () => {
    // Arrange
    const fetchedIds = ['file-1', 'file-2'];
    const cartFiles = ['file-1', 'file-2'];

    // Act
    const result = computeIdsToAdd(fetchedIds, cartFiles);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return only the IDs not already in the cart', () => {
    // Arrange
    const fetchedIds = ['file-1', 'file-2', 'file-3'];
    const cartFiles = ['file-1', 'file-3'];

    // Act
    const result = computeIdsToAdd(fetchedIds, cartFiles);

    // Assert
    expect(result).toEqual(['file-2']);
  });

  it('should return an empty array when fetchedIds is empty', () => {
    // Arrange
    const cartFiles = ['file-1'];

    // Act
    const result = computeIdsToAdd([], cartFiles);

    // Assert
    expect(result).toEqual([]);
  });

  it('should deduplicate fetched IDs before filtering — same file linked to multiple biospecimens', () => {
    // Arrange — 'file-1' appears twice (e.g. associated with two different biospecimens)
    const fetchedIds = ['file-1', 'file-2', 'file-1'];

    // Act
    const result = computeIdsToAdd(fetchedIds, []);

    // Assert — 'file-1' added only once
    expect(result).toEqual(['file-1', 'file-2']);
  });

  it('should not add a duplicated ID that is already in the cart', () => {
    // Arrange
    const fetchedIds = ['file-1', 'file-1', 'file-2'];
    const cartFiles = ['file-1'];

    // Act
    const result = computeIdsToAdd(fetchedIds, cartFiles);

    // Assert — deduplicated and cart-filtered
    expect(result).toEqual(['file-2']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// exceedsCartLimit
// ─────────────────────────────────────────────────────────────────────────────
describe('exceedsCartLimit', () => {
  it('should return false when the projected total is under the limit', () => {
    // Arrange
    const idsToAdd = ['file-1', 'file-2'];
    const cartFiles = ['file-3'];
    const max = 10;

    // Act & Assert
    expect(exceedsCartLimit(idsToAdd, cartFiles, max)).toBe(false);
  });

  it('should return false when the projected total is exactly the limit', () => {
    // Arrange
    const idsToAdd = ['file-1', 'file-2'];
    const cartFiles = ['file-3'];
    const max = 3;

    // Act & Assert
    expect(exceedsCartLimit(idsToAdd, cartFiles, max)).toBe(false);
  });

  it('should return true when the projected total exceeds the limit', () => {
    // Arrange
    const idsToAdd = ['file-1', 'file-2'];
    const cartFiles = ['file-3'];
    const max = 2;

    // Act & Assert
    expect(exceedsCartLimit(idsToAdd, cartFiles, max)).toBe(true);
  });

  it('should return false when both idsToAdd and cart are empty', () => {
    // Arrange & Act & Assert
    expect(exceedsCartLimit([], [], 10)).toBe(false);
  });

  it('should return true when idsToAdd alone exceeds the limit', () => {
    // Arrange
    const idsToAdd = ['f1', 'f2', 'f3', 'f4'];

    // Act & Assert
    expect(exceedsCartLimit(idsToAdd, [], 3)).toBe(true);
  });

  it('should count duplicate cart entries only once', () => {
    // Arrange — cart has the same ID stored twice (defensive)
    const idsToAdd = ['file-new'];
    const cartFiles = ['file-1', 'file-1', 'file-2'];
    const max = 3;

    // Act — existingCartIds.size = 2 (Set deduplicates), projected = 2 + 1 = 3
    expect(exceedsCartLimit(idsToAdd, cartFiles, max)).toBe(false);
  });

  it('should return true when max is 0 and there are IDs to add', () => {
    // Arrange & Act & Assert
    expect(exceedsCartLimit(['file-1'], [], 0)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getBiospecimenWrapperConfig — button visibility
// ─────────────────────────────────────────────────────────────────────────────
describe('getBiospecimenWrapperConfig', () => {
  it('should always include the paginatedTable container', () => {
    const config = getBiospecimenWrapperConfig([]);
    expect(config[0]).toEqual({ container: 'paginatedTable', paginatedTable: true });
  });

  it('should not include a buttons container when files is empty', () => {
    const config = getBiospecimenWrapperConfig([]);
    expect(config).toHaveLength(1);
    expect(config.find((c) => c.container === 'buttons')).toBeUndefined();
  });

  it('should not include a buttons container when all files have null specimen_record_id', () => {
    // Arrange — files exist but none have a valid specimen link
    const files = [
      { specimen_record_id: null, data_file_uuid: 'f-1' },
      { specimen_record_id: null, data_file_uuid: 'f-2' },
    ];
    const config = getBiospecimenWrapperConfig(files);
    expect(config).toHaveLength(1);
    expect(config.find((c) => c.container === 'buttons')).toBeUndefined();
  });

  it('should not include a buttons container when all files have undefined specimen_record_id', () => {
    const files = [{ data_file_uuid: 'f-1' }, { data_file_uuid: 'f-2' }];
    const config = getBiospecimenWrapperConfig(files);
    expect(config).toHaveLength(1);
  });

  it('should include a buttons container when at least one file has a valid specimen_record_id', () => {
    const files = [{ specimen_record_id: 'sp-1', data_file_uuid: 'f-1' }];
    const config = getBiospecimenWrapperConfig(files, 1);
    expect(config).toHaveLength(2);
    const buttons = config.find((c) => c.container === 'buttons');
    expect(buttons).toBeDefined();
    expect(buttons.clsName).toBe('container_footer');
  });

  it('should include a buttons container when files has mixed valid and null specimen_record_id', () => {
    const files = [
      { specimen_record_id: null, data_file_uuid: 'f-1' },
      { specimen_record_id: 'sp-2', data_file_uuid: 'f-2' },
    ];
    const config = getBiospecimenWrapperConfig(files, 2);
    expect(config).toHaveLength(2);
  });

  it('should not include a buttons container when biospecimenCount is 0 even if files have valid specimen_record_ids', () => {
    // Arrange — files exist with specimen links but the biospecimen table is empty
    const files = [{ specimen_record_id: 'sp-1', data_file_uuid: 'f-1' }];
    const config = getBiospecimenWrapperConfig(files, 0);
    expect(config).toHaveLength(1);
    expect(config.find((c) => c.container === 'buttons')).toBeUndefined();
  });
});
