import React, { useContext } from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { TableContext, TableView } from '@bento-core/paginated-table';
import { configColumn } from './tableConfig/Column';
import { themeConfig } from './tableConfig/Theme';
import styles from './cartView.style';
import CartWrapper from './cartWrapper';
import {paginationOptions} from './tableConfig/PaginationOptions';
const CartView = (props) => {
  const {
    classes,
    config,
    tblRows = [],
    isServer = true,
    filesId = [],
  } = props;

  // access table state
  const tableContext = useContext(TableContext);
  const { context } = tableContext;

  /**
  * configure table state
  */
  const initTblState = (initailState) => ({
    ...initailState,
    title: 'myFiles',
    query: config.api,
    dataKey: config.dataKey,
    columns: configColumn({ columns: config.columns, ...props }),
    selectedRows: [],
    tableMsg: config.tableMsg,
    paginationAPIField: config.paginationAPIField,
    sortBy: config.defaultSortField,
    sortOrder: config.defaultSortDirection,
    rowsPerPage: 10,
    page: 0,
  });
  
  const variables = {};
  variables.file_ids = filesId;
  return (
    <Grid>
      <Grid item xs={12}>
        <div className={classes.myFilesWrapper}>
          <CartWrapper
            classes={classes}
            queryVariables={variables}
          >
            <TableView
              initState={initTblState}
              themeConfig={themeConfig}
              queryVariables={variables}
              totalRowCount={filesId.length}
              tblRows={tblRows}
              server={isServer}
              paginationOptions={paginationOptions(context, config)}
            />
          </CartWrapper>
        </div>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(CartView);
