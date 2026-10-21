# Document downloads

`DocumentDownload` provides CTDC's file download control in data tables. It
shows download icons and tooltips based on login state, directs signed-out
users to the login page, and starts file downloads for signed-in users. The
backend determines whether the user has access to the requested file.

[DocumentDownloadView.js](./DocumentDownloadView.js) handles the UI, login
routing, identity provider (IDP) selection, and notifications.
[downloadUtils.js](./downloadUtils.js) builds File Service requests using the
file ID, study accession, and IDP, retrieves a signed URL, and transfers the
file. Callers supply the filename, format, and size metadata.

## How downloads work

The File Service must return HTTP `200` with an HTTP(S) signed URL: plain text,
a JSON string, or an object containing `url`, `presigned_url`, or `fileURL`.
The signed URL's query parameters are preserved.

The helper selects the transfer method using the file's format and size.
Recognized browser-viewable files use a Blob download or a new tab to keep
inline rendering from replacing the CTDC page.

| File | Action |
| --- | --- |
| Viewable format with a valid size at or below `MAX_BLOB_SIZE` | Fetch as a Blob and trigger a download with a filename. |
| Viewable format above the limit or with unknown/invalid size | Attempt to open the signed URL in a new tab. |
| Other formats, including ZIP | Follow the signed URL in the current tab; the server/browser determines whether it downloads. |

Viewable formats: `pdf`, `txt`, `png`, `jpg`, `jpeg`, `svg`, `gif`, `html`, `xml`,
and `json`. Detection uses **only `fileFormat`**, trimmed, lowercased, and with
one leading dot removed. Missing or unrecognized formats use direct navigation.
Blob filenames use `fileName` (default `download`) with the format appended if absent.

## Size metadata

`MAX_BLOB_SIZE` in [siteWideConfig.js](../../bento/siteWideConfig.js) is
**50 MiB (52,428,800 bytes)**. Bento's size formatter labels this `50 MB`.

This is an internal memory threshold for Blob downloads, not a maximum
downloadable file size. Larger viewable files open in their own tab, where the
browser can display or download them. This avoids buffering the entire file as
a Blob within CTDC and reduces the risk of memory pressure, freezes, or crashes.
Other file formats retain their existing download behavior.

Pass raw bytes as a number or numeric string representing a nonnegative safe
integer. Keep missing sizes `undefined`, not `0`. For study ZIP downloads,
`data_file_size` flows through `AvailableDownloads` and `ZipDownloadView` to
the helper. Table downloads use the configured file-size column.

The limit trusts metadata; it does not enforce the actual bytes transferred.
The complete Blob is fetched before saving, then its object URL is released.

## Errors and fallback

| Failure | Handling |
| --- | --- |
| File Service `401`/`403` | Show the access notification and stop. |
| Other non-200 File Service responses | Show the general download error notification and stop. |
| Blob request has `error.request` but no `error.response` | Log a warning and attempt `downloadFile(fileURL, true)` once as a last resort. |
| File Service network/URL errors, readable Blob HTTP errors, or local download errors | Show the general download error notification, log the error, and stop without a fallback. |

The check `if (!error.request || error.response)` runs after
`downloadFileViaBlob` has already failed. For example:

- An expired signed URL returns a readable `403`: `error.response` exists.
- Creating the Blob URL fails: `error.request` is missing.

In either case, `throw error` passes the same error to the outer catch, which
shows the general download error notification. Only a request with no readable
response continues to the new-tab fallback; this may be CORS or another network
failure.

Callers supply `showUnauthorizedNotification` and `showDownloadErrorNotification`.
Both use `classes.alertStyles` and a six-second duration. The outer catch
logs the error and shows one notification: access errors for File Service
`401`/`403`, or the general message for other detected failures. A CORS/network
fallback attempt shows no error notification unless it throws.

Blob requests require storage CORS permission for the frontend origin. The
fallback cannot distinguish CORS from other network failures. New tabs use
`noopener noreferrer`, but may be blocked after asynchronous requests and may
render the file instead of downloading it. Direct navigation errors or silently
blocked tabs cannot be detected by this helper.

