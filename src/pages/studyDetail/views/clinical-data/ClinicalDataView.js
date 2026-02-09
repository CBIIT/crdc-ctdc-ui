import React from "react";
import { withStyles } from "@material-ui/core";
import styles from "./ClinicalDataStyle";
import PaginatedTableView from "../../../../components/PaginatedTable/TableView";
import { table, tableLayOut } from "../../../../bento/studyDetailData";
import { themeConfig } from "./DataTheme";
import DownloadBtn from "./components/downloadBtn";
import { downloadAndZipJson } from "../../../fileCentricCart/utils";

const ClinicalDataView = ({ tblRows, classes, study_short_name }) => {
  const downloadAndZipCvsFiles = () => {
    downloadAndZipJson(tblRows, null, study_short_name);
  };

  return (
    <div className={classes.container}>
      <div>
        <p className={classes.paragraph}>
          Detailed clinical trial observations from this study can be downloaded
          from any node for which a CSV download option is displayed.
        </p>
        <p className={classes.paragraph}>
          The node-specific counts indicate the number of participants represented
          within a node into which data has been propagated versus the number of
          records within such nodes.
        </p>
      </div>
      <div className={classes.topDownloadBtn}>
        <DownloadBtn handleCSVDownload={downloadAndZipCvsFiles} />
      </div>
      <div className={classes.paginatedTableWrapper}>
        <PaginatedTableView
          isServer={false}
          tblRows={tblRows}
          config={table}
          rowsPerPage={100}
          tableLayOut={tableLayOut}
          customthemeConfig={themeConfig()}
        />
      </div>
    </div>
  );
};

export default withStyles(styles)(ClinicalDataView);
