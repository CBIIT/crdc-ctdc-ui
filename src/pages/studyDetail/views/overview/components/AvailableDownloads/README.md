# AvailableDownloads Component

## Overview

Displays download buttons for study data files with **fully dynamic generation**. All file types are automatically pluralized and sorted alphabetically. Only shows buttons when both the study has the file type AND a valid megazip file exists.

## Pluralization

Uses the [`pluralize`](https://www.npmjs.com/package/pluralize) npm library (v8.0.0) for intelligent English pluralization:

**Examples:**
- `File` → `Files`
- `Summary` → `Summaries`
- `Analysis` → `Analyses` (correct Latin plural)
- `Index` → `Indices` (correct Latin plural)
- `Data` → `Data` (already plural)
- `Imaging` → `Images` (custom rule)
- `Radiology Imaging` → `Radiology Images` (multi-word support)

**Case Preservation:**
- `IMAGING` → `IMAGES`
- `imaging` → `images`
- `Imaging` → `Images`

The library handles 100+ edge cases including irregular plurals, already-plural detection, and special endings.

## Validation Logic

Shows button when **ALL** conditions are met:
1. ✅ Study has the file type (`participantFileTypes`)
2. ✅ Megazip entry exists (`zipFileData`)
3. ✅ `data_file_uuid` is present and non-empty

Hides entire section when no buttons pass validation.

**Fully Dynamic Implementation:**
- All file types in both `participantFileTypes` and `zipFileData` automatically render
- Button text: Pluralized version of `data_file_type` (e.g., "Genomic Data" → "Genomic Data")
- Tooltip: "Download all [pluralized_type] [(FORMAT)] for this study"
- Sorted alphabetically by original `data_file_type`
- Icon: Standard download icon

✅ **No code changes needed for new file types** - they will automatically appear with correct pluralization!

### What This Does NOT Validate

- User permissions
- UUID validity in backend
- File physical availability
- Network/server errors

**This component only validates client-side data structure.**

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `participantFileTypes` | `Array<string>` | `[]` | File types available in study |
| `zipFileData` | `Array<object>` | `[]` | Megazip metadata from API |
| `classes` | `object` | - | Material-UI styles |

### zipFileData Structure

```javascript
[{
  data_file_type: 'Variant Report',
  zip_files: [{
    data_file_uuid: 'uuid-123',  // REQUIRED - validated
    data_file_name: 'reports.zip',
    data_file_format: 'zip',
    // ... other fields
  }]
}]
```

**⚠️ Important:** If `zip_files` contains multiple files, **only the first file (`zip_files[0]`)** is used. All subsequent files are ignored. If the first file has an invalid `data_file_uuid`, the button won't show even if later files are valid.

## Example

```javascript
// Study has variant reports AND a new "Clinical Trial" type
const participantFileTypes = ['Variant Report', 'Clinical Trial', 'Analysis'];

// API returns valid megazips for all types
const zipFileData = [
  {
    data_file_type: 'Variant Report',
    zip_files: [{ data_file_uuid: 'uuid-2', data_file_name: 'reports.zip', data_file_format: 'pdf' }]
  },
  {
    data_file_type: 'Clinical Trial',
    zip_files: [{ data_file_uuid: 'uuid-4', data_file_name: 'trials.zip', data_file_format: 'csv' }]
  },
  {
    data_file_type: 'Analysis',
    zip_files: [{ data_file_uuid: 'uuid-5', data_file_name: 'analysis.zip', data_file_format: 'json' }]
  }
];

// Result: Shows THREE buttons (alphabetically sorted by data_file_type)
// 1. "Analyses" (correctly pluralized using Latin plural)
//    Tooltip: "Download all Analyses (JSON) for this study"
// 2. "Clinical Trials" (auto-pluralized)
//    Tooltip: "Download all Clinical Trials (CSV) for this study"
// 3. "Variant Reports" (auto-pluralized)
//    Tooltip: "Download all Variant Reports (PDF) for this study"

// If data_file_uuid is null/undefined/empty → section hidden
// If participantFileTypes doesn't include the type → section hidden
```

## Troubleshooting

**Section not showing?**
- Check `participantFileTypes` has values
- Check `zipFileData` has matching `data_file_type`
- Verify `data_file_uuid` is not null/undefined/empty
- File type matching is case-sensitive

**Need a different plural form?**
- The `pluralize` library handles 100+ irregular cases automatically
- For domain-specific terms, add custom rules in the component using `pluralize.addIrregularRule()`
- Example: `pluralize.addIrregularRule("imaging", "images")` is already configured

## Technical Details

**Dependencies:**
- `pluralize@8.0.0` - Industry-standard pluralization library
- Custom rule: `imaging` → `images`

**Test Coverage:**
- 56 component-specific tests
- 158 total project tests passing
- Coverage: 93% statements, 73% branches, 82% functions, 95% lines
- It will automatically use the custom config instead of the generic fallback

## Testing

Run: `npm test -- AvailableDownloads.test.js`

25 tests covering filtering logic, edge cases (null/undefined/empty), validation, and dynamic types.

## Related Files

- `AvailableDownloads.js` - Component
- `AvailableDownloads.test.js` - Tests  
- `ZipDownloadView.js` - Child component (renders individual button)
- `overview.js` - Parent component
- `studyDetailData.js` - GraphQL query (`studyZipFileQuery`)
