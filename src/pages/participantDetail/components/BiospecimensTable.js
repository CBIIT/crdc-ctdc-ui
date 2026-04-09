import React, { useContext } from 'react';
import { Tooltip, Button } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import jbrowseIcon from '../../../assets/participant/jbrowse_icon.png';
import {
  TableContextProvider,
  TableView,
  TableContext,
} from '@bento-core/paginated-table';
import { themeConfig } from '../../dashTemplate/tabs/tableConfig/Theme';
import { customTheme } from '../../dashTemplate/tabs/wrapperConfig/Theme';
import { biospecimenColumns, BIOSPECIMEN_BUTTON_TOOLTIP } from '../../../bento/participantDetailData';

const initBiospecimenTableState = (initialState) => ({
  ...initialState,
  title: 'Biospecimens',
  dataKey: 'specimen_record_id',
  tableMsg: { noMatch: 'No biospecimens associated with this participant.' },
  columns: biospecimenColumns,
  selectedRows: [],
  sortBy: 'specimen_record_id',
  sortOrder: 'asc',
  rowsPerPage: 10,
  page: 0,
  extendedViewConfig: {
    pagination: false,
    manageViewColumns: { title: 'View Columns' },
    download: {
      downloadCsv: 'Download Table Contents As CSV',
      downloadFileName: 'CTDC_Participant_Biospecimens',
    },
  },
});

const BiospecimenButtons = ({ classes }) => {
  const { context } = useContext(TableContext);
  const selectedRows = context?.selectedRows || [];

  return (
    <div className={classes.biospecimenButtonRow}>
      <span>
        <Button
          className={classes.cartButton}
          disabled={selectedRows.length === 0}
          onClick={() => {
            // TODO: Wire up to AddToCart flow
          }}
          disableElevation
        >
          Add Files for Selected Biospecimens
        </Button>
      </span>
      <Tooltip title={BIOSPECIMEN_BUTTON_TOOLTIP} placement="top-end" classes={{ tooltip: classes.tooltipBody }}>
        <HelpIcon className={classes.questionMarkIcon} />
      </Tooltip>
      <span>
        <Button className={classes.jbrowseButton} disabled disableElevation>
          View in&nbsp;<img src={jbrowseIcon} alt="JBrowse" className={classes.jbrowseIcon} /><strong>J</strong>Browse
        </Button>
      </span>
      <Tooltip title="View in JBrowse (coming soon)" placement="top-end" classes={{ tooltip: classes.tooltipBody }}>
        <HelpIcon className={classes.questionMarkIcon} />
      </Tooltip>
    </div>
  );
};

const BiospecimensTable = ({ classes, biospecimens = [] }) => (
  <div className={classes.tableSection}>
    <div className={classes.tableSectionTitle}>Associated Biospecimens</div>
    <div className={classes.tableWrapper}>
      <TableContextProvider>
        <TableView
          initState={initBiospecimenTableState}
          themeConfig={{ ...themeConfig, customTheme }}
          queryVariables={{}}
          totalRowCount={biospecimens.length}
          server={false}
          tblRows={biospecimens}
        />
        <BiospecimenButtons classes={classes} />
      </TableContextProvider>
    </div>
  </div>
);

export default BiospecimensTable;
