import React, { useState, useMemo } from "react";
import {
  Grid,
  withStyles,
  Typography,
  Box,
  TextField,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  TableContextProvider,
  TableView,
  Wrapper,
} from "@bento-core/paginated-table";

import { configColumn } from "../dashTemplate/tabs/tableConfig/Column";
import { themeConfig } from "../studyDetail/views/study-files/StudyFilesTheme";
import { customTheme as wrapperTheme } from "../studyDetail/views/study-files/wrapperConfig/Theme";
import { rasTestFilesTableConfig } from "./rasTestFilesConfig";
import { qaTestFilesData } from "./rasTestFilesData";
import styles from "./RasTestFilesStyle";

const initRasTestFilesTableState = (initialState) => ({
  ...initialState,
  title: rasTestFilesTableConfig.name,
  dataKey: rasTestFilesTableConfig.dataKey,
  tableMsg: rasTestFilesTableConfig.tableMsg,
  columns: configColumn(rasTestFilesTableConfig.columns),
  selectedRows: [],
  sortBy: rasTestFilesTableConfig.defaultSortField || "phs_consent",
  sortOrder: rasTestFilesTableConfig.defaultSortDirection || "asc",
  rowsPerPage: 10,
  page: 0,
  extendedViewConfig: rasTestFilesTableConfig.extendedViewConfig,
});

const rasTestFilesWrapperConfig = [
  {
    container: "paginatedTable",
    paginatedTable: true,
  },
];

const RasTestFilesView = ({ classes }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Establish Redux context for child components
  // eslint-disable-next-line no-unused-vars
  const cartState = useSelector((state) => state.cartReducer);

  // Client-side search filtering on qaTestFilesData
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return qaTestFilesData;
    const term = searchTerm.toLowerCase().trim();
    return qaTestFilesData.filter((row) =>
      Object.values(row).some(
        (val) => val && String(val).toLowerCase().includes(term),
      ),
    );
  }, [searchTerm]);

  return (
    <div className={classes.container}>
      <Box className={classes.headerBanner}>
        <Typography variant="h1" component="h1" className={classes.title}>
          RAS Test Files
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          These test file records originate directly from the frontend-bundled <code>DAR_CRDC_guids.tsv</code>{" "}
          dataset to support RAS file download testing. They are intentionally hardcoded in the frontend 
          codebase and do not come from the backend database, as standard application 
          files are not designated test files. Use the Access column to test direct file downloads via the File Service API.
        </Typography>
      </Box>

      {/* Table Controls: Search Input */}
      <Box className={classes.tableControls}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search test files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchBox}
        />
      </Box>

      <div className={classes.tableWrapper}>
        <TableContextProvider>
          <Wrapper
            wrapConfig={rasTestFilesWrapperConfig}
            customTheme={wrapperTheme}
            classes={classes}
            section={rasTestFilesTableConfig.name}
          >
            <Grid container>
              <Grid item xs={12}>
                <TableView
                  initState={initRasTestFilesTableState}
                  themeConfig={{ ...themeConfig }}
                  tblRows={filteredData}
                  totalRowCount={filteredData.length}
                  server={false}
                />
              </Grid>
            </Grid>
          </Wrapper>
        </TableContextProvider>
      </div>
    </div>
  );
};

export default withStyles(styles)(RasTestFilesView);
