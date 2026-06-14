# AvailableDownloads Component

## Overview

Displays download buttons for study data files. Supports both **configured types** (Variant Call Files, Variant Reports, Radiology Images with custom labels/tooltips) and **any custom file types** (auto-generated dynamically). Only shows buttons when both the study has the file type AND a valid megazip file exists.

## Validation Logic

Shows button when **ALL** conditions are met:
1. ✅ Study has the file type (`participantFileTypes`)
2. ✅ Megazip entry exists (`zipFileData`)
3. ✅ `data_file_uuid` is present and non-empty

Hides entire section when no buttons pass validation.

**Hybrid Implementation:** Supports both configured and dynamic file types:

**Configured Types (with custom labels/tooltips):**
- `Variant Call File` → "Variant Call Files"
- `Variant Report` → "Variant Reports"
- `Radiology Imaging` → "Radiology Images"

**Dynamic Types (auto-generated):**
- Any other file type in both `participantFileTypes` and `zipFileData` will automatically render
- Button text: Uses `data_file_type` as-is (e.g., "Genomic Data")
- Tooltip: "Download all [file_type] for this study"
- Icon: Generic download icon
- Appears after configured types

✅ **No code changes needed for new file types** - they will automatically appear!

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
// Study has variant reports AND a new "Genomic Data" type
const participantFileTypes = ['Variant Report', 'Genomic Data'];

// API returns valid megazips for both
const zipFileData = [
  {
    data_file_type: 'Variant Report',
    zip_files: [{ data_file_uuid: 'uuid-2', data_file_name: 'reports.zip' }]
  },
  {
    data_file_type: 'Genomic Data',
    zip_files: [{ data_file_uuid: 'uuid-4', data_file_name: 'genomic.zip' }]
  }
];

// Result: Shows TWO buttons
// 1. "Variant Reports" (custom config with custom tooltip)
// 2. "Genomic Data" (dynamic, auto-generated with generic tooltip)

// If data_file_uuid is null/undefined/empty → section hidden
// If participantFileTypes doesn't include the type → section hidden
```

## Troubleshooting

**Section not showing?**
- Check `participantFileTypes` has values
- Check `zipFileData` has matching `data_file_type`
- Verify `data_file_uuid` is not null/undefined/empty
- File type matching is case-sensitive

**Want to customize a dynamic file type?**
- Add it to the `downloadButtons` array in `AvailableDownloads.js` with custom button text, tooltip, and icon
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
