export const customTheme = {
  MuiTooltip: {
    tooltip: {
      border: '#C3C3C3 1px solid',
      backgroundColor: '#ffffff',
      color: '#223D4C',
      maxWidth: '220px',
      fontSize: '0.75rem',
      fontFamily: 'Open Sans',
      fontWeight: '600',
      textAlign: 'left',
      lineHeight: '1.6',
      padding: '10px 15px',
      borderRadius: '5px',
      boxShadow: '0px 4px 10px 0px #00000040',
    },
  },
  MuiContainer: {
    root: {
      paddingTop: '5px',
      '&.container_header': {
        textAlign: 'right',
      },
      '&.container_footer': {
        paddingTop: '10px',
        textAlign: 'right',
      },
      '&.container_footer_link': {
        textAlign: 'right',
        paddingRight: '100px',
        height: '65px',
        color: '#3E6886',
        fontSize: '12px',
        fontFamily: 'Lato',
        borderBottom: '1px solid #3E6886',
        textDecoration: 'none',
      },
      '& img': {
        width: '29px',
        paddingRight: '12px',
        verticalAlign: 'top',
        marginTop: '4px',
        // '&.addAllTooltip': {},
        // '&.addSelectedFileTooltip': {},
      },
    },
  },
  MuiButton: {
    text: {
      padding: '10px 16px',
    },
    root: {
      color: '#fff',
      fontSize: '12px',
      marginTop: '6px',
      fontFamily: 'Lato',
      borderRadius: '10px',
      marginBottom: '10px',
      textTransform: 'uppercase',
      '&.add_all_button': {
        marginRight: '4px',
        // width: '120px',
        backgroundColor: '#08A383',
      },
      '&.add_selected_button': {
        marginRight: '4px',
        marginLeft: '14px',
      },
      '&.add_selected_button_Participants': {
        backgroundColor: '#067CA5',
      },
      '&.add_selected_button_Biospecimens': {
        backgroundColor: '#067CA5',
      },
      '&.add_selected_button_Files': {
        backgroundColor: '#067CA5',
      },
      '&.Mui-disabled': {
        color: '#fff',
        '&.add_selected_button_Participants': {
          backgroundColor: '#067CA5',
        },
        '&.add_selected_button_Biospecimens': {
          backgroundColor: '#067CA5',
        },
        '&.add_selected_button_Files': {
          backgroundColor: '#067CA5',
        },
      },
      '&.yesBtn': {
        width: '133px',
        height: '45px',
        cursor: 'pointer',
        background: '#98a19e',
      },
      '&.noBtn': {
        width: '133px',
        height: '45px',
        cursor: 'pointer',
        background: '#42779a',
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
