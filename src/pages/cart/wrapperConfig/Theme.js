export const customTheme = {
  MuiContainer: {
    root: {
      paddingTop: '5px',
      '&.container_outer_layout': {
        maxWidth: '100%',
        height: '75px',
        borderBottom: '#067CA5 10px solid',
        '& img': {
          float: 'left',
          marginTop: '-20px',
          marginLeft: '-20px',
          width: '100px',
          // filter: 'drop-shadow(-3px 2px 6px rgba(27,28,28,0.29))',
        },
        '& span': {
          color: '#03a383',
          fontSize: '18pt',
          fontFamily: 'Open Sans, sans-serif',
          lineHeight: '55px',
          '&.cart_header_text': {
            letterSpacing: '-0.02em',
            fontWeight: 'bold',
            paddingLeft: '5px',
          },
          '&.cart_sel_files_text': {
            letterSpacing: '-0.02em',
            fontWeight: 'bold',
            marginLeft: '5px',
          },
        },
      },
      '&.container_header': {
        maxWidth: '100%',
        height: '75px',
        padding: '10px 0px 15px 0px',
        marginRight: '0px',
        position: 'relative',
        textAlign: 'left',
        '& img.tooltip_icon': {
          width: '20px',
          marginLeft: '2px',
          verticalAlign: 'top',
          marginTop: '6px',
        },
      },
      '&.tooltip_icon': {
        width: '25px',
      },
      '&.container_footer': {
        maxWidth: '100%',
        alignSelf: 'left',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '0px',
        marginLeft: '14px',
       
        '& img.tooltip_icon': {
          width: '20px',
          marginLeft: '5px',
          verticalAlign: 'top',
        },
        '&.tooltip_icon': {
          width: '25px',
        },
        '& textarea.manifest_comments': {
          color: '#000000',
          border: '1px solid #707070',
          height: '96px',
          resize: 'none',
          padding: '15px',
          fontSize: '12px',
          maxWidth: '412px',
          background: '#ebebeb',
          fontFamily: 'Roboto, Open Sans',
          marginRight: '10px',
          borderRadius: '10px',
        },
        '& textarea.manifest_comments::placeholder': {
          color: '#000000',
          fontFamily: 'Roboto',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '12px',
        },
      },
    },
  },
  MuiButton: {
    text: {
      padding: '10px 16px',
    },
    root: {
      color: '#fff',
      backgroundColor: '#1A8CCB',
      fontSize: '0.875rem',
      fontFamily: 'Lato',
      fontWeight: '500',
      lineHeight: '1.75',
      borderRadius: '10px',
      marginBottom: '10px',
      textTransform: 'uppercase',
      '&.download_manifest':{
          width: '250px',
          margin: '9px 0px 0px 14px',
          background:'#004D73',
          marginRight: '3px'
      },
      '&:hover': {
        backgroundColor: '#1a8ccbb3',
      },
      '&.Mui-disabled': {
        
        '&.download_manifest': {
          backgroundColor: 'grey',
        },
      },

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
    arrow: {
      color: '#ffffff',
      marginTop: '-0.71em',
      marginLeft: '0px',
      marginRight: '4px',
      fontSize: '1.25rem',
      '&:before': {
        border: '2px solid #a7afb3',
      },
    },
  },
  MuiLink: {
    root: {
      height: '65px',
      color: '#3E6886',
      fontSize: '12px',
      fontFamily: 'Lato',
      borderBottom: '1px solid #3E6886',
      textDecoration: 'none',
    },
  },
  MuiDialog: {
    paper: {
      width: '431px',
      height: '170px',
      borderRadius: '25px !important',
      textAlign: 'center',
      backgroundColor: '#E8DFDC !important',
      border: '2px solid #A61401',
    },
  },
  MuiDialogContent: {
    root: {
      padding: '40px 20px 0px 20px',
      '&.alter-content': {
        fontFamily: 'Lato',
        size: '16px',
      },
    },
  },
  MuiDialogActions: {
    root: {
      justifyContent: 'center',
      paddingBottom: '25px',
    },
  },
};

export const themeConfig = {
  customTheme,
};
