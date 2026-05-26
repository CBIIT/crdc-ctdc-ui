import React from "react";
import { Grid, withStyles } from "@material-ui/core";
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
  studyFilesColumns,
  studyFilesConfig,
} from "../../../../bento/studyDetailData";
import styles from "./StudyFilesStyle";

const initFilesTableState = (initialState) => ({
  ...initialState,
  title: "Study Files",
  dataKey: "data_file_uuid",
  tableMsg: { noMatch: "No study-level files associated with this study." },
  columns: configColumn(studyFilesColumns),
  selectedRows: [],
  sortBy: "data_file_name",
  sortOrder: "asc",
  rowsPerPage: 10,
  page: 0,
  extendedViewConfig: {
    pagination: true,
    manageViewColumns: { title: "View Columns" },
    download: {
      downloadCsv: "Download Table Contents As CSV",
      downloadFileName: "CTDC_Study_Files",
    },
  },
});

const StudyFilesView = ({ classes, files = [] }) => {
  return (
    <div className={classes.container}>
      <div className={classes.tableWrapper}>
        <TableContextProvider>
          <Wrapper
            wrapConfig={configWrapper(
              studyFilesConfig,
              wrapperConfig,
              "",
              files.length,
            )}
            customTheme={wrapperTheme}
            classes={classes}
            section="Study Files"
            activeFilters={{}}
          >
            <Grid container>
              <Grid item xs={12}>
                <span className={classes.studyFilesDescription}>
                  This study currently has the following Study Files directly
                  associated with it:
                </span>
                <TableView
                  initState={initFilesTableState}
                  themeConfig={{ ...themeConfig }}
                  queryVariables={{}}
                  totalRowCount={files.length}
                  server={false}
                  tblRows={files}
                />
              </Grid>
            </Grid>
          </Wrapper>
        </TableContextProvider>
      </div>
    </div>
  );
};

export default withStyles(styles)(StudyFilesView);
