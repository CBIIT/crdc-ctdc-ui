import { useApolloClient } from '@apollo/client';
import { downloadJson } from '../utils';

export const extendedViewConfigtest = '';

export const ExtendedViewConfig = (config) => {
  const { extendedViewConfig } = config;
  if (!extendedViewConfig) {
    return null;
  }

  const { download } = extendedViewConfig;
  const { customDownload } = download;
  if (!customDownload) {
    return extendedViewConfig;
  }
  /**
  * configure custom table download
  * extended data add or hide column different from table data
  */
  if (download) {
    const getQueryVeriables = (filters = {}) => {
      const variables = { ...filters };
      variables.offset = 0;
      variables.first = 10000;
      return variables;
    };
    const handleInterOpData = (data, download) => {
      if (data) {
        downloadJson(data, download);
      } else {
        console.warn("No interOpData found.");
      }
    };

    const client = useApolloClient();
    // active filters or table query veriables
    download.downloadTable = async (filterItems = {}) => {
      try {
        // Downloading the data if the data is provided from config
        if (config.data) {
          handleInterOpData(config.data, download);
          return;
        }
    
        // Prepare query variables
        const queryVariables = getQueryVeriables(filterItems);
    
        // Fetch data using Apollo Client
        const result = await client.query({
          query: download.query,
          variables: { ...queryVariables },
        });
    
        // Handle the result
        const data = result?.data?.[config.paginationAPIField];
        if (data) {
          downloadJson(data, download);
        } else {
          console.warn("No data found for the provided query.");
        }
      } catch (error) {
        console.error("Error downloading table data:", error);
      }
    };
  }
  return extendedViewConfig;
};
