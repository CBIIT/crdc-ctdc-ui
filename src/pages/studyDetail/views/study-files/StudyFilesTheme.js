export const tblHeader = {
  MuiTableSortLabel: {
    root: {
      color: "#13344A",
      position: "relative",
      fontSize: "16px",
      fontFamily: "Roboto",
      fontWeight: 600,
      textDecoration: "none",
      whiteSpace: "nowrap",
      textAlign: "left",
      "&:hover": {
        color: "#13344A",
      },
      "&$active": {
        color: "#13344A",
      },
    },
  },
  MuiTableRow: {
    head: {
      height: "40px",
      borderBottom: "3px solid #42779a",
    },
  },
};

const tblBody = {
  MuiTableCell: {
    root: {
      minHeight: "45px",
      padding: "0px 5px 0px 20px",
      color: "#13344A",
      borderBottom: "none",
      fontFamily: "Nunito",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "16px",
      textAlign: "left",
    },
    paddingCheckbox: {
      width: "48px",
      padding: "0 0 0 5px",
    },
  },
  MuiTypography: {
    body1: {
      fontFamily: "Nunito",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "16px",
    },
  },
};

export const tblPgn = {
  MuiTablePagination: {
    root: {
      paddingRight: "8px",
      borderTop: "5px solid #e7e5e5",
      borderBottom: "3px solid #e7e5e5",
      "&:last-child": {
        paddingRight: "8px",
      },
    },
    toolbar: {
      minHeight: "45px",
    },
  },
};

export const tblContainer = {
  MuiTableContainer: {
    root: {
      width: "100%",
      overflowX: "auto",
      transform: "rotateX(180deg)",
      boxShadow: "none",
      borderRadius: "0",
    },
  },
  MuiTable: {
    root: {
      transform: "rotateX(180deg)",
      width: "100%",
      display: "table",
      borderSpacing: "0",
      borderCollapse: "collapse",
      borderTop: "3px solid #42779a",
    },
  },
};

const toolbar = {
  MuiToolbar: {
    root: {
      minHeight: "44px !important",
    },
    gutters: {
      "@media (min-width: 600px)": {
        paddingLeft: "20px",
      },
    },
  },
};

export const extendedView = {
  tblTopPgn: {
    MuiTablePagination: {
      root: {
        paddingRight: "8px",
        borderTop: "3px solid #42779a",
        borderBottom: "3px solid #e7e5e5",
      },
      toolbar: {
        minHeight: "45px",
      },
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: "#ffffff",
      maxWidth: "220px",
      borderRadius: "5px",
      border: ".2px solid #C3C3C3",
      boxShadow: "0px 4px 10px 0px #00000040",
      fontFamily: "Open Sans",
      color: "#223D4C",
      fontSize: "13px",
      fontWeight: 600,
      lineHeight: "19px",
      letterSpacing: "0em",
      textAlign: "left",
      padding: "10px 15px",
      position: "relative",
    },
  },
  MuiList: {
    root: {
      "&.viewColumnList": {
        padding: "8px 42px 8px 10px",
        "& img": {
          width: "25px",
          marginRight: "10px",
        },
      },
    },
  },

  MuiToolbar: {
    root: {
      display: "block",
      position: "relative",
      textAlign: "right",
      minHeight: "44px !important",
      "&.downloadAndColumnView": {
        padding: "0 32px 5px 0",

        "& button": {
          "&.download-icon": {
            padding: "8px",
          },
          "&.manageViewColumnBtn": {
            marginBottom: "0px",
            zIndex: "10",
            padding: "8px",
          },
        },
      },
    },
  },
};

export const themeConfig = {
  tblHeader,
  tblBody,
  tblContainer,
  tblPgn,
  toolbar,
  extendedView,
};
