export const tblHeader = {
  MuiButton: {
    text: {
      padding: '10px 16px',
    },
    root: {
      color: '#fff',
      fontSize: '14px',
      marginTop: '6px',
      fontFamily: 'Lato',
      borderRadius: '10px',
      marginBottom: '10px',
      textTransform: 'uppercase',
      width: '133px',
      '&.okBtn': {
        width: '133px',
        height: '45px',
        cursor: 'pointer',
        background: '#3E74B6',
      },
      '&.cancelBtn': {
        width: '133px',
        height: '45px',
        cursor: 'pointer',
        background: '#4F5D69',
      },
    },
  },
  MuiTableSortLabel: {
    root: {
      color: '#13344A',
      position: 'relative',
      fontSize: '11pt',
      fontFamily: 'Lato Regular,Raleway, sans-serif',
      fontWeight: 'bold',
      letterSpacing: '0.06em',
      textDecoration: 'none',
      maxWidth: '220px',
      wordWrap: 'break-word',
      "&.data_file_format":{
          maxWidth:'194px',
      },
      '&:hover': {
        color: '#13344A',
      },
    },
  },
  MuiTableCell: {
    root: {
      padding: '0px 0px 0px 25px',
      paddingRight: '5px',
      color: '#13344A',
      maxWidth: '220px',
      wordWrap: 'break-word',
      "&.data_file_format":{
        maxWidth: '127px',
    },
      '&.del_all_row': {
        minWidth: '150px',
        cursor: 'pointer',
      },
    },
  },
  MuiTooltip: {
    tooltipPlacementBottom: {
      background: 'gray !important',
      marginTop: '0px',
      marginLeft: '0px',
      color: 'white !important',
      border: 'none !important',
      '&.remove_button_all':{
        background:'red !important'
      },
      '@media (min-width: 600px)': {
        marginTop: '10px',
        background: 'none',
      },
    },
    popper: {
      '&#header-tooltip div': {
        background: 'gray !important',
        marginTop: '0px',
        marginLeft: '0px',
        color: 'white !important',
        border: 'none !important'
      },
    },
  },
  MuiIconButton: {
    root: {
      '&.del_all_row_btn': {
        alignSelf: 'center',
        margin: '0px',
      },
    },
  },
  MuiTypography: {
    root: {
      color: '#A61401',
      '&.del_all_row_tooltip': {
        width: '110px',
        border: '2px solid #A61401',
        height: '48px',
        padding: '5px 10px',
        fontSize: '12px',
        background: '#fff',
        textAlign: 'center',
        fontWeight: '500',
        borderRadius: '7px',
      },
      '&.del_all_row_text': {
        float: 'left',
        fontSize: '11pt',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Lato Regular, Raleway, sans-serif',
        lineHeight: '47px',
      },
    },
  },
};

export const extendedView = {
  tblTopPgn: {
    MuiTablePagination: {
      root: {
        paddingRight: '0px',
        borderTop: '3px solid #42779a',
      },
    },
  },
  MuiToolbar: {
    root: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '0px !important',
    },
  },
};

export const tblPgn = {
  MuiTablePagination: {
    root: {
      paddingRight: '0px',
      borderTop: '3px solid #e7e5e5',
      borderBottom: '3px solid #e7e5e5',
    },
    toolbar: {
      minHeight: '45px',
    },
  },
};

export const tblBody = {
  MuiTableBody: {
    root: {
      margin: 'auto 3% auto 3%',
      maxWidth: '100%',
    },
  },
  MuiTableCell: {
    body: {
      color: '#004C73',
      borderBottom: 'none',
      maxWidth: '220px',
      wordWrap: 'break-word',
      "&.data_file_format":{
        maxWidth: '194px',
    },
    "&.delete_row":{
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      minHeight: '100px'
    },
      '&.file_name': {
        '& p': {
          lineBreak: 'anywhere',
          paddingTop: '10px',
          paddingBottom: '10px',
        },
      },
    },
    root: {
      minHeight: '45px',
      padding: '0px 0px 0px 25px',
      paddingRight: '20px',
      color: '#004C73',
      borderBottom: 'none',
    },
  },
};

export const tblContainer = {
  MuiTableContainer: {
    root: {
      width: '100%',
      overflowX: 'auto',
      transform: 'rotateX(180deg)',
      boxShadow: 'none',
      borderRadius: '0',
    }
  },
  MuiTable: {
    root: {
      transform: 'rotateX(180deg)',
      width: '100%',
      display: 'table',
      borderSpacing: '0',
      borderCollapse: 'collapse',
      "&.data_file_format":{
        maxWidth: '194px',
    },
    "&.delete_row":{
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      maxHeight: '100px'
    },
    },
  },
};

export const themeConfig = {
  tblHeader,
  extendedView,
  tblPgn,
  tblBody,
  tblContainer,
};
