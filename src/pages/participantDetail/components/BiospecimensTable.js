import React from 'react';
import {
  TableContextProvider,
  TableView,
  Wrapper,
} from '@bento-core/paginated-table';
import { themeConfig, customTheme } from '../tableThemeConfig';
import { biospecimenColumns } from '../../../bento/participantDetailData';
import { biospecimenWrapperConfig } from '../wrapperConfig';
import { wrapperCustomTheme } from '../wrapperTheme';

export const initBiospecimenTableState = (initialState) => ({
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

const BiospecimensTable = ({ classes, biospecimens = [] }) => (
  <div className={classes.tableSection}>
    <div className={classes.tableSectionTitle}>Associated Biospecimens</div>
    <div className={classes.tableWrapper}>
      <TableContextProvider>
        <Wrapper
          wrapConfig={biospecimenWrapperConfig}
          customTheme={wrapperCustomTheme}
          classes={classes}
          section="Biospecimens"
        >
          <TableView
            initState={initBiospecimenTableState}
            themeConfig={{ ...themeConfig, customTheme }}
            queryVariables={{}}
            totalRowCount={biospecimens.length}
            server={false}
            tblRows={biospecimens}
          />
        </Wrapper>
      </TableContextProvider>
    </div>
  </div>
);

export default BiospecimensTable;
