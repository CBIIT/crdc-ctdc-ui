import { useCallback, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { convertToCSV, createFileName, downloadCsvString } from '../../../fileCentricCart/utils';

export const useExtendedViewConfig = (config, queryVariables) => {
  const client = useApolloClient();
  const [downloadError, setDownloadError] = useState(false);
  const latest = useRef();
  latest.current = { config, queryVariables, client };

  // Bento stores the callback in its initial table state; read current filters
  // when clicked instead of retaining the filters from the first render.
  const downloadTable = useCallback(async () => {
    const { config, queryVariables, client } = latest.current;
    setDownloadError(false);
    try {
      const { applyActiveFilters = false } = config.extendedViewConfig.download;
      const { data } = await client.query({
        query: config.api,
        variables: {
          ...(applyActiveFilters ? queryVariables : {}),
          // Keep the table scope even when exporting without active filters.
          ...config.defaultFilters,
          offset: 0,
          first: 10000,
        },
      });
      const rows = data?.[config.paginationAPIField];
      if (!Array.isArray(rows)) throw new Error('Table download response is missing rows.');
      const columns = config.columns.filter((column) => (
        column.dataField && (column.display || column.hiddenByDefault)
      ));
      const csv = convertToCSV(rows, '',
        columns.map(({ dataField }) => dataField),
        columns.map(({ header }) => header),
        columns.filter(({ formatList }) => formatList).map(({ dataField }) => dataField));
      downloadCsvString(csv, createFileName(config.extendedViewConfig.download.downloadFileName));
    } catch (error) {
      console.error('[Table download]', error);
      setDownloadError(true);
    }
  }, []);

  const { extendedViewConfig } = config;
  const download = extendedViewConfig?.download;
  return {
    downloadError,
    extendedViewConfig: download ? {
      ...extendedViewConfig,
      download: { ...download, downloadTable },
    } : extendedViewConfig,
  };
};
