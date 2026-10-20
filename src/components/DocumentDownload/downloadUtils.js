import axios from "axios";
import env from "../../utils/env";
import { MAX_BLOB_SIZE } from "../../bento/siteWideConfig";

export const buildFileServiceUrl = ({
  fileId = "",
  studyAccession = "",
  idp = "",
} = {}) => {
  const baseApi = (env.REACT_APP_FILE_SERVICE_API || "").replace(/\/+$/, "");
  const cleanIdp = String(idp || "").replace(/^\/+|\/+$/g, "");
  const cleanStudyAccession = String(studyAccession || "").replace(
    /^\/+|\/+$/g,
    "",
  );
  const cleanFileId = String(fileId || "")
    .replace(/^drs:\/\//i, "")
    .replace(/^\/+|\/+$/g, "");

  const fileIdParts = cleanFileId.split("/").filter(Boolean);
  const pathParts = cleanIdp ? [cleanIdp] : [];

  if (cleanIdp && cleanStudyAccession) {
    pathParts.push(cleanStudyAccession);
  }

  pathParts.push(...fileIdParts);

  return `${baseApi}/${pathParts.map(encodeURIComponent).join("/")}`;
};

// Function to fetch and download a file
export const fetchFileToDownload = async ({
  fileId = "",
  showUnauthorizedNotification,
  showDownloadErrorNotification,
  studyAccession = "",
  idp = "",
  fileName = "",
  fileFormat,
  fileSize,
} = {}) => {
  let isFileServiceAccessError = false;
  try {
    const requestUrl = buildFileServiceUrl({
      fileId,
      studyAccession,
      idp,
    });

    const response = await fetch(requestUrl, { method: "GET" });

    // The File Service must return HTTP 200 with a signed URL.
    if (response.status !== 200) {
      isFileServiceAccessError = response.status === 401 || response.status === 403;
      throw new Error(
        `Failed to fetch the file from "${fileId}". Server responded with: ${response.status} (${response.statusText})`,
      );
    }

    // RAS returns a raw signed URL string; DCF wraps it as { url: ... }
    const responseText = await response.text();
    let fileURL = '';

    try {
      const parsed = JSON.parse(responseText);
      if (typeof parsed === 'string') {
        fileURL = parsed;
      } else if (parsed && typeof parsed === 'object') {
        fileURL = parsed.url || parsed.presigned_url || parsed.fileURL || '';
      }
    } catch (e) {
      fileURL = responseText;
    }

    fileURL = typeof fileURL === 'string' ? fileURL.trim() : '';
    if (fileURL.startsWith('"') && fileURL.endsWith('"')) {
      fileURL = fileURL.slice(1, -1);
    }

    // Guard against non-URL bodies (e.g. HTML error pages) being treated as a download link
    if (!fileURL || !/^https?:\/\//i.test(fileURL)) {
      console.error(`No valid file URL found in response for "${fileId}":`, responseText);
      throw new Error('Missing File URL');
    }

    const extension = typeof fileFormat === "string"
      ? fileFormat.trim().toLowerCase().replace(/^\./, "")
      : "";

    const isViewable = VIEWABLE_EXTENSIONS.has(extension);
    const sizeInBytes = typeof fileSize === "number"
      || (typeof fileSize === "string" && fileSize.trim() !== "")
      ? Number(fileSize)
      : NaN;
    // Unknown or invalid sizes must not bypass the Blob size limit.
    const isWithinBlobLimit = Number.isSafeInteger(sizeInBytes)
      && sizeInBytes >= 0 && sizeInBytes <= MAX_BLOB_SIZE;

    if (isViewable && isWithinBlobLimit) {
      try {
        await downloadFileViaBlob(fileURL, fileName, extension);
      } catch (error) {
        // Show an error notification for HTTP errors (e.g. 403/404) or failures
        // in the download code. Try a new tab only when the request was made
        // but the browser could not read the response (possibly due to CORS).
        if (!error.request || error.response) {
          throw error;
        }
        // No HTTP response may mean CORS or another network failure. As a last
        // resort, try the signed URL in a new tab; browsers may still block it.
        console.warn("Blob request failed; trying the signed URL in a new tab.", error.message);
        downloadFile(fileURL, true);
      }
    } else {
      downloadFile(fileURL, isViewable);
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (isFileServiceAccessError) {
      showUnauthorizedNotification();
    } else {
      showDownloadErrorNotification();
    }
  }
};

// A centralized list of extensions that modern browsers natively try to render inline
const VIEWABLE_EXTENSIONS = new Set([
  'pdf',
  'txt',
  'png',
  'jpg',
  'jpeg',
  'svg',
  'gif',
  'html',
  'xml',
  'json',
]);

// Direct navigation avoids CORS and avoids buffering large files into memory as a blob.
const downloadFile = (signedUrl, openInNewTab = false) => {
  const link = document.createElement("a");
  link.href = signedUrl;
  if (openInNewTab) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    document.body.removeChild(link);
  }
};

// Fetch viewable files as blobs so the download attribute can prevent inline navigation.
const downloadFileViaBlob = async (signedUrl, fileName, fileFormat) => {
  const response = await axios({
    url: signedUrl,
    method: "GET",
    responseType: "blob",
  });

  let downloadName = typeof fileName === "string" && fileName.trim()
    ? fileName.trim()
    : "download";
  if (fileFormat && !downloadName.toLowerCase().endsWith(`.${fileFormat}`)) {
    downloadName += `.${fileFormat}`;
  }

  const link = document.createElement("a");
  const url = window.URL.createObjectURL(response.data);
  try {
    link.href = url;
    link.setAttribute("download", downloadName);
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    // Let the browser start using the URL before releasing the blob.
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }
};
