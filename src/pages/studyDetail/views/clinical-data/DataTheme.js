export const tblHeader = {
  MuiTableSortLabel: {
    root: {
      position: 'relative',
      fontFamily: 'Roboto',
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '100%',
      color: '#13344A !important',
      '&.active': {
        color: '#13344A',
      },
      '&:hover': {
        color: '#003559',
      },
      '&:hover $svg': {
        color: '#003559',
      },
    },
    icon: {
      color: '#003559 !important',
    },
  },
  MuiTableCell: {
    root: {
      padding: '12px 16px 12px 16px',
      '& span': {
        color: '#13344A',
        fontWeight: '600',
        fontFamily: 'Roboto'
      },
      '&.clinicalDataNode': {
        paddingLeft: '16px',
        whiteSpace: 'nowrap'
      },
      '&.csvDownload': {
      },
      '&.clinicalDataDescription': {
      },
      '&.caseCount': {
      },
      '&.recordCount': {
      },
      '&.nodeCount': {
      },
      '&.csvDataRow': {
        paddingRight: '16px',
      }
    },
  },
  MuiTableRow: {
    head: {
      backgroundColor: '#ffffff',
      // borderTop: '3px solid #0E6292',
      borderBottom: '3px solid #0E6292',
      height: '40px',
    },
  },
  MuiTooltip: {
    tooltip: {
      maxWidth: "285px",
      padding: "10px 15px",

      fontFamily: "Open Sans",
      fontWeight: 600,
      fontSize: "13px",
      lineHeight: "19px",
      color: '#223D4C',
      border: "1px solid #C3C3C3",
      boxShadow: "0px 4px 10px 0px #00000040",
      borderRadius: "5px",
      backgroundColor: "#FFFFFF",
    },
    arrow: {
      color: '#ffffff',
      marginTop: '-0.71em',
      marginLeft: '0px',
      marginRight: '4px',
      fontSize: '1.25rem',
      '&:before': {
        border: "1px solid #C3C3C3",
      },
    },
  },
};

const tblContainer = {
  MuiTableContainer: {
    root: {
      boxShadow: 'none',
      overflowX: 'auto',
      borderRadius: '0',
      maxHeight: '600px',
    },
  },
  MuiTable: {
    root: {
      width: '100%',
      display: 'table',
      borderSpacing: '0',
      borderCollapse: 'collapse',
    },
  },
};

export const customTheme = {
  MuiAccordionDetails: {
    root: {
      paddingLeft: '10%',
    },
  },
  MuiTable: {
    root: {
      borderTop: '5px solid red',
    },
  },
  MuiTableContainer: {
    root: {
      width: '100%',
      // transform: 'rotateX(180deg)',
      boxShadow: 'none',
      borderRadius: '0',
      maxHeight: '400px',
    },
  },
  MuiAccordionSummary: {
    root: {
      '& span': {
        fontFamily: 'Nunito Sans',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '30px',
        letterSpacing: '0.25px',
        textAlign: 'left',
        textTransform: 'uppercase',
      },
    },
  },
};

export const tblPgn = {
  MuiTablePagination: {
    root: {
      display: 'none',
    },
  },
};

const displayErr = {
  MuiContainer: {
    root: {
      background: '#fff',
    },
    maxWidthLg: {
      '@media (min-width: 1920px)': {
        maxWidth: '100%',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      },
      '@media (min-width: 1280px)': {
        maxWidth: '100%',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      },
    },
  },
};

const toolbar = {
  MuiToolbar: {
    root: {
      minHeight: '44px !important',
    },
    gutters: {
      '@media (min-width: 600px)': {
        paddingLeft: '20px',
      },
    },
  },
};

const tblBody = {
  MuiTableBody: {
    root: {
      maxHeight: '400px',
      overflow: 'scroll',
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: '#ffffff',
      color: '#1c2023',
      maxWidth: '220px',
      fontSize: '0.75rem',
      border: '2px solid #a7afb3',
      fontFamily: 'Open Sans',
      fontWeight: '600',
      textAlign: 'left',
      lineHeight: '1.6',
      padding: '10px 12px',
      borderRadius: '0px',
    },
  },
  MuiTableCell: {
    root: {
      minHeight: '45px',
      padding: '16px',
      borderBottom: 'none',
      '&.property': {
        '& p': {
          fontFamily: 'Nunito',
          fontSize: '15px',
          fontWeight: '600',
          lineHeight: '20px',
          letterSpacing: '0em',
          color: '#015774',
        },
      },
      '&.clinicalDataNode': {
        width: '10%',
        // padding: '16px 5px 16px 16px',
        '& p': {
          fontFamily: 'Nunito',
          fontSize: '15px',
          fontWeight: '600',
          lineHeight: '20px',
          letterSpacing: '0em',
          color: '#0296C9',
          // textTransform: 'uppercase',
        },
      },
      '&.clinicalDataDescription': {
        width: '68%',
        '& p': {
          fontFamily: 'Nunito',
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '20px',
          letterSpacing: '0em',
          color: '#0B3556',
        },
      },
      '&.caseCount': {
        '& p': {
          color: '#0B3556',
          fontFamily: 'Nunito',
          fontSize: '16px',
        },
      },
      '&.nodeCount': {
        '& p': {
          color: '#0B3556',
          fontFamily: 'Nunito',
          fontSize: '16px',
        },
      },
      '&.recordCount': {
        '& p': {
          color: '#0B3556',
          fontFamily: 'Nunito',
          fontSize: '16px',
        },
      },
      '&.csvDownload': {
      },
      '&.csvDataRow': {

      }
    },
  },
};

export const themeConfig = () => ({
  tblHeader,
  tblBody,
  customTheme,
  tblPgn,
  toolbar,
  displayErr,
  tblContainer,
});
