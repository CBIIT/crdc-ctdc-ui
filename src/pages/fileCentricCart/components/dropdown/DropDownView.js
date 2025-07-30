import React, { useEffect, useState, useContext, useMemo, Fragment } from 'react';
import {
  withStyles,
  MenuItem,
  MenuList,
  ClickAwayListener,
  Popper,
  Button,
  Grow,
  Paper,
} from '@material-ui/core';
import clsx from 'clsx';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { noop } from 'lodash';
import { CartContext } from '@bento-core/cart';
import { TableContext, ToolTip as Tooltip } from '../../../../bento-core';
import styles from './DropDownStyle';
import {
  GET_MY_CART_DATA_QUERY,
  myFilesPageData,
  manifestData as manifestDataConfig,
  getManifestFileSignedUrlEndPoint
} from '../../../../bento/fileCentricCartWorkflowData';
import env from '../../../../utils/env';
import DownloadFileManifestDialog from './downloadFileManifestDialog';
import { convertToCSV, createFileName, downloadCsvString } from '../../utils';

import cgcIcon from '../../assets/exportToCancerGenomicsCloudIcon.svg';
import dfmIcon from '../../assets/downloadFileManifestIcon.svg';

import linkIcon from '../../assets/linkIcon.svg';
import arrowDownSvg from '../../assets/arrowDown.svg';
import arrowUpSvg from '../../assets/arrowUp.svg';

const LABEL = 'Export and Download';
const EXPORT_TO_CANCER_GENOMICS_CLOUD = 'Export to Cancer Genomics Cloud';
const DOWNLOAD_FILE_MANIFEST = 'Download File Manifest';

const TOOLTIP_CONTENT = {
  EMPTY_CART: 'Add some files to the cart to get started.',
  NO_SELECTED_ROWS: 'Select at least one file from the table below.',
};

const DropDownView = ({ classes, filesId = [], allFiles }) => {
  const [open, setOpen] = useState(false);
  const [manifestData, setManifestData] = useState([]);
  const [manifestString, setManifestString] = useState('');
  const [downloadFileManifestDialogOpen, setDownloadFileManifestDialogOpen] = React.useState(false);

  const anchorRef = React.useRef(null);

  // Context
  const { context: tableContext } = useContext(TableContext);
  const { selectedRows = [], } = tableContext;
  const { context: cartContext } = useContext(CartContext);
  const { cart: { comment = '' } = {} } = cartContext; // { cart: {comment: "", manifestData: {...}, queryVariables: {data_file_uuid: [...]}, table:{...} }}

  // Derived States
  const isCartEmpty = useMemo(() => filesId.length === 0, [filesId]);
  const noSelectedRows = useMemo(() => selectedRows.length === 0, [selectedRows]);
  const isDropDownDisabled = useMemo(() => (allFiles ? isCartEmpty : noSelectedRows), [
    allFiles,
    isCartEmpty,
    noSelectedRows,
  ]);

  // Fetch Manifest Data
  useQuery(GET_MY_CART_DATA_QUERY, {
    variables: {
      data_file_uuid: allFiles ? filesId : selectedRows,
      first: allFiles ? filesId.length : selectedRows.length
    },
    skip: allFiles ? !filesId : !selectedRows,
    onCompleted: ({ filesInList }) => { 
      setManifestData(filesInList); // Store raw data for manifest generation
    }
  })

  // Generate Manifest String/CSV
  useEffect(() => {
    if (manifestData.length > 0) {
      try {
        const generatedManifest = convertToCSV(
          manifestData,
          comment,
          manifestDataConfig.keysToInclude,
          manifestDataConfig.header
        );
        setManifestString(generatedManifest);
      } catch (error) {
        console.error("Error generating CSV:", error);
        setManifestString(""); // Reset the manifest string to avoid invalid data
      }
    }
  }, [manifestData, comment]);

  useEffect(() => {
    setOpen(false);
  }, [selectedRows]);

  // Tooltip Titles
  const dropDownTooltipTitle = useMemo(() => {
    if (allFiles) return isCartEmpty ? TOOLTIP_CONTENT.EMPTY_CART : '';

    return isCartEmpty 
            ? TOOLTIP_CONTENT.EMPTY_CART 
            : noSelectedRows 
              ? TOOLTIP_CONTENT.NO_SELECTED_ROWS : ""
  
  }, [allFiles, isCartEmpty, noSelectedRows]);

  const exportToCGCTooltipTitle = useMemo(() => (
    <span>
      Files in the cart can be easily exported into the{' '}
      <a
        href="https://www.cancergenomicscloud.org/"
        target="_blank"
        rel="noreferrer"
        style={{ color: '#165F83', textDecoration: 'underline'}}
      >
        Cancer Genomics Cloud
      </a>{' '}
      <img className={classes.linkIcon} src={linkIcon} alt="linkIcon" />
      {'.'}
    </span>
  ));

  const downloadFileManifestTooltipTitle = useMemo(() => (
    <span>
      Files in the cart can be downloaded as a file manifest with{' '}
      <a
        href="https://www.ga4gh.org/product/data-repository-service-drs/"
        target="_blank"
        rel="noreferrer"
        style={{ color: '#165F83', textDecoration: 'underline'}}
      >
        DRS 
      </a>{' '}
      <img className={classes.linkIcon} src={linkIcon} alt="linkIcon" />{' '}
      identifiers and other useful metadata.
    </span>

  ));

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);


  // Fetch Manifest Signed URL
  const fetchManifestSignedUrl = async () => {
    const url = env.REACT_APP_INTEROP_SERVICE_URL + getManifestFileSignedUrlEndPoint;
    const data = { manifest: manifestString };
    const headers = { 'Content-Type': 'application/json' };
  
    try {
      const response = await axios.post(url, data, { headers });
      return response.data.manifestSignedUrl || '';
    } catch (error) {
      console.error('Error fetching manifest signed URL:', error);
      return '';
    }
  };

  // Handle Download Actions
  const initiateDownload = async (action) => {
    try {
      switch (action) {
        case EXPORT_TO_CANCER_GENOMICS_CLOUD: {
          const manifestSignedUrl = await fetchManifestSignedUrl();
  
          if (manifestSignedUrl) {
            window.open(
              `https://cgc.sbgenomics.com/import-redirect/drs/csv?URL=${encodeURIComponent(manifestSignedUrl)}`,
              '_blank'
            );
          } else {
            console.error('Failed to retrieve manifest signed URL.');
          }
          break;
        }
  
        case DOWNLOAD_FILE_MANIFEST: {
          if (!manifestString) {
            console.error('Downloading File Manifest failed. Manifest string is empty.');
            break;
          }
  
          const manifestFileName = createFileName(myFilesPageData.manifestFileName, '.csv');
          downloadCsvString(manifestString, manifestFileName);
          break;
        }
  
        default:
          noop();
          break;
      }
    } catch (error) {
      console.error('Error initiating download:', error);
    }
  };

  // Handler for opening a dialog that allows the user to enter a comment using a textarea
  // const handleDownloadFileManifestDialogOpen = () => setDownloadFileManifestDialogOpen(true);

  const handleDownloadFileManifestDialogClose = () => {
    setDownloadFileManifestDialogOpen(false);
  };

  // Render Menu Items
  const getMenuItem = () => {
    return (
      <Fragment>
        <MenuItem>
          <Tooltip
            arrow
            interactive
            title={exportToCGCTooltipTitle}
            placement="left"
            classes={{tooltip: classes.menuItemTooltip, arrow: classes.arrow}} 
          >
          <span style={{ cursor: isDropDownDisabled && 'not-allowed'}} onClick={() => {
            if (isDropDownDisabled) {
               return noop()
            };

            initiateDownload(EXPORT_TO_CANCER_GENOMICS_CLOUD);
            setOpen(false);
            }}
          >
            <span className={classes.cgcLabal}>{EXPORT_TO_CANCER_GENOMICS_CLOUD}</span>
            <img className={classes.cgcIcon} src={cgcIcon} alt="icon" />
          </span>
          </Tooltip>
        </MenuItem>
        <MenuItem style={{ cursor: isDropDownDisabled && 'not-allowed'}} className="downloadManifestBtn">
          <Tooltip
            arrow
            interactive
            title={downloadFileManifestTooltipTitle}
            placement="left"
            classes={{tooltip: classes.menuItemTooltip, arrow: classes.arrow}} 
          >
            <span onClick={() => {
                if(isDropDownDisabled) {
                    return noop()
                }
                initiateDownload(DOWNLOAD_FILE_MANIFEST)
            }}>
              <span className={classes.fileManifestLabal}>
                {DOWNLOAD_FILE_MANIFEST}
              </span>
              <img className={classes.downloadFileIcon} src={dfmIcon} alt="icon"/>
            </span>
          </Tooltip>
        </MenuItem>
      </Fragment>
    );
  };

  return (
    <>
      <div className={classes.dropDownBtnContainer}>
        {' '}
        <Tooltip
          arrow
          placement="left"
          title={dropDownTooltipTitle}
          classes={{ tooltip: classes.customTooltip, arrow: classes.arrow }} 
        >
          <div>
            <Button
              // disabled={isDropDownDisabled}
              classes={{
                root: clsx({
                  [classes.availableDownloadDropdownBtnIsOpen]: open,
                  [classes.availableDownloadDropdownBtn]: !open,
                  [classes.disableDropDownBtn]: isDropDownDisabled
                }),
                label: classes.availableDownloadDropdownBtnLabel,
                // contained: classes.availableDownloadBtnContained,
                startIcon: classes.availableDownloadDropdownBtnStartIcon,
                endIcon: classes.endIcon,
              }}
              endIcon={<img src={open ? arrowUpSvg : arrowDownSvg} alt="dropdown icon" />}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              {LABEL}
            </Button>
          </div>
        </Tooltip>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          style={{zIndex: 99999}}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper className={classes.dropdownPaper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                    classes={{
                      root: classes.dropdownMenuList,
                    }}
                  >
                    {getMenuItem()}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <DownloadFileManifestDialog
        onClose={handleDownloadFileManifestDialogClose}
        open={downloadFileManifestDialogOpen}
        filesId={filesId}
        allFiles={allFiles}
      />
    </>
  );
};

export default withStyles(styles)(DropDownView);
