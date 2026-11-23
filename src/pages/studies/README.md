# Studies repository indicators

Additional CRDC Nodes uses `getAllStudies.image_collection.repository_name`.
The frontend resolves unique parent repository names and general portal links
using `bento-ctdc-static-content/repositories/repositories.yml`, fetched from:

```text
REACT_APP_STATIC_CONTENT_URL + /repositories/repositories.yml
```

See `repositories/README.md` in the static-content repository for YAML editing
and publishing instructions. Publish the YAML before the initial frontend deployment.

## Behavior

- Names and aliases match ignoring case and surrounding spaces; duplicates are removed.
- Configured URLs produce links. Unknown names remain visible without links; blank names are omitted.
- While YAML is loading, unavailable, or invalid, source names appear without links.
  The request has a 10-second timeout and does not block study data.
- CSV downloads use current repository names, separated by a comma and space
  (`TCIA, IDC`) in one cell.

[repositories.js](../../utils/repositories.js) loads, validates, and matches the YAML.
[studiesController.js](studiesController.js) derives `repositories` for tooltips and
`unique_repository` for indicators and CSV. No interop query or new backend field is used.

Later mapping changes require only static-content publication. Refresh or revisit
Studies to reload the YAML; browser/CDN caching applies. No application rebuild,
OpenSearch reload, or reindex is needed.

## Tests

Run from the frontend repository:

```sh
CI=true npm test -- --runInBand --watch=false \
  src/utils/repositories.test.js \
  src/pages/studies/studiesController.test.js \
  src/components/DataAvailabilityTable/StudiesTable.test.js \
  src/components/PaginatedTable/Customize/DataAvailability/TableCell.test.js
```
