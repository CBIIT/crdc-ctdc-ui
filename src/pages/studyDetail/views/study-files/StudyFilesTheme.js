const primaryColor = '#004D73';

const tooltipOverride = {
  tooltip: {
    backgroundColor: '#FFFFFF',
    color: '#004D73',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: 'Lato, sans-serif',
    padding: '8px 12px',
    borderRadius: '4px',
    maxWidth: '220px',
    boxShadow: '0px 4px 10px 0px #00000040',
    border: '1px solid #C3C3C3',
  },
};

const tblHeader = {
  MuiTableSortLabel: {
    root: {
      color: '#13344A',
      position: 'relative',
      fontFamily: 'Roboto',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '100%',
      letterSpacing: '0px',
      textDecoration: 'none',
    },
  },
  MuiTableCell: {
    root: {
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '5px',
      paddingRight: '5px',
    },
    paddingCheckbox: {
      '& label': {
        marginRight: '5px',
      },
    },
  },
  MuiTableRow: {
    head: {
      height: '40px',
      maxHeight: '40px',
      borderBottom: `3px solid ${primaryColor}`,
      background: '#f5f5f5',
    },
  },
  MuiTooltip: tooltipOverride,
};

const tblBody = {
  MuiTableCell: {
    root: {
      height: '48px',
      maxHeight: '48px',
      padding: '0px 5px 0px 5px',
      color: '#004C73',
      borderBottom: 'none',
      fontFamily: 'Nunito',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '16px',
      letterSpacing: '0px',
    },
    paddingCheckbox: {
      width: '48px',
      padding: '0 0 0 5px',
    },
    body: {
      color: '#13344A',
    },
  },
  MuiTableRow: {
    root: {
      height: '48px',
      maxHeight: '48px',
      '&:nth-child(even)': {
        backgroundColor: '#F5F5F5',
      },
    },
  },
  MuiCheckbox: {
    colorSecondary: {
      '&.Mui-checked': {
        color: '#0B3556',
      },
    },
  },
  MuiSvgIcon: {
    root: {
      color: '#0B3556',
    },
  },
};

const tblContainer = {
  MuiTableContainer: {
    root: {
      width: '100%',
      overflowX: 'auto',
      transform: 'rotateX(180deg)',
      boxShadow: 'none',
      borderRadius: '0',
    },
  },
  MuiTable: {
    root: {
      transform: 'rotateX(180deg)',
      width: '100%',
      display: 'table',
      borderSpacing: '0',
      borderCollapse: 'collapse',
      borderTop: `3px solid ${primaryColor}`,
    },
  },
};

const tblPgn = {
  MuiTablePagination: {
    root: {
      paddingRight: '43px',
      background: '#ffffff',
      borderTop: `3px solid ${primaryColor}`,
      borderBottom: `3px solid ${primaryColor}`,
    },
    toolbar: {
      minHeight: '45px',
    },
  },
};

const extendedView = {
  tblTopPgn: {
    MuiTablePagination: {
      root: {
        paddingRight: '43px',
        borderTop: `3px solid ${primaryColor}`,
      },
    },
  },
  MuiTooltip: tooltipOverride,
  MuiToolbar: {
    root: {
      display: 'block',
      position: 'relative',
      textAlign: 'right',
      '&.downloadAndColumnView': {
        maxHeight: '50px',
        minHeight: '50px',
        '& button': {
          '&.download-icon': {
            marginRight: '-10px',
          },
          '&.manageViewColumnBtn': {
            marginBottom: '0px',
            zIndex: '10',
          },
        },
      },
    },
  },
};

export const studyFilesThemeConfig = {
  tblHeader,
  tblBody,
  tblContainer,
  tblPgn,
  extendedView,
};
