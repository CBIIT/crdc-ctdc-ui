import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import {
  TableContextProvider,
  TableView,
  Wrapper,
} from "@bento-core/paginated-table";

import { configColumn } from "../../../dashTemplate/tabs/tableConfig/Column";
import { themeConfig } from "./StudyFilesTheme";
import { configWrapper, wrapperConfig } from "./wrapperConfig/Wrapper";
import { customTheme as wrapperTheme } from "./wrapperConfig/Theme";
import {
  studyFilesTableConfig,
  GET_STUDY_FILES_QUERY,
} from "../../../../bento/studyDetailData";
import styles from "./StudyFilesStyle";

const initFilesTableState = (initialState) => ({
  ...initialState,
  title: studyFilesTableConfig.name,
  dataKey: studyFilesTableConfig.dataKey,
  tableMsg: studyFilesTableConfig.tableMsg,
  columns: configColumn(studyFilesTableConfig.columns),
  selectedRows: [],
  sortBy: studyFilesTableConfig.defaultSortField || "data_file_name",
  sortOrder: studyFilesTableConfig.defaultSortDirection || "asc",
  rowsPerPage: 10,
  page: 0,
  extendedViewConfig: studyFilesTableConfig.extendedViewConfig,
});

const StudyFilesView = ({ classes, study_id }) => {
  // CRITICAL: Establish Redux context for child components (bento-core Wrapper)
  // Without this hook, Redux connect() in @bento-core components cannot access the store
  // eslint-disable-next-line no-unused-vars
  const cartState = useSelector((state) => state.cartReducer);

  // Fetch all study files once (client-side pagination)
  const { loading, error, data } = useQuery(GET_STUDY_FILES_QUERY, {
    skip: !study_id,
    variables: {
      study_id: [study_id],
      first: 10000,
      order_by: studyFilesTableConfig.defaultSortField,
      sort_direction: studyFilesTableConfig.defaultSortDirection,
    },
    fetchPolicy: "cache-first", // Cache the results
  });

  const studyFiles = data?.studyFileOverview || [];

  const configuredWrapper = configWrapper(
    studyFilesTableConfig,
    wrapperConfig,
    "",
    studyFiles.length,
  );

  // Active filters for add to cart functionality
  const activeFilters = {
    study_id: [study_id],
  };

  return (
    <div className={classes.container}>
      <div className={classes.tableWrapper}>
        <TableContextProvider>
          <Wrapper
            wrapConfig={configuredWrapper}
            customTheme={wrapperTheme}
            classes={classes}
            section={studyFilesTableConfig.name}
            activeFilters={activeFilters}
          >
            <Grid container>
              <Grid item xs={12}>
                <span className={classes.studyFilesDescription}>
                  This study currently has the following Study Files directly
                  associated with it:
                </span>
                {loading && <div>Loading study files...</div>}
                {error && <div>Error loading study files: {error.message}</div>}
                {!loading && !error && (
                  <TableView
                    initState={initFilesTableState}
                    themeConfig={{ ...themeConfig }}
                    tblRows={studyFiles}
                    totalRowCount={studyFiles.length}
                    server={false}
                  />
                )}
              </Grid>
            </Grid>
          </Wrapper>
        </TableContextProvider>
      </div>
    </div>
  );
};

export default withStyles(styles)(StudyFilesView);
