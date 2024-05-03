export const customTheme = {
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
        paddingRight: '59px',
        height: '98px',
        fontSize: '12px',
        fontFamily: 'Lato',
        marginTop: '5px',
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
      fontSize: '14px',
      marginTop: '6px',
      fontFamily: 'Lato',
      borderRadius: '10px',
      marginBottom: '10px',
      textTransform: 'uppercase',
      '&.add_all_button': {
        marginRight: '10px',
        // width: '120px',
        backgroundColor: '#067CA5',
      },
      '&.add_selected_button': {
        marginRight: '10px',
        marginLeft: '10px',
        backgroundColor: 'red'
      },
      '&.add_selected_button_Participants': {
        backgroundColor: '#06846A',
      },
      '&.add_selected_button_Biospecimens': {
        backgroundColor: '#06846A',
      },
      '&.add_selected_button_Files': {
        backgroundColor: '#06846A',
      },
      '&.Mui-disabled': {
        color: '#fff',
        '&.add_selected_button_Participants': {
          backgroundColor: '#06846A4f',
        },
        '&.add_selected_button_Biospecimens': {
          backgroundColor: '#08a3834f',
        },
        '&.add_selected_button_Files': {
          backgroundColor: '#08a3834f',
        },
      },
      '&.yesBtn': {
        width: '133px',
        height: '45px',
        cursor: 'pointer',
        background: '#3E74B6',
      },
      '&.noBtn': {
        width: '133px',
        height: '45px',
        cursor: 'pointer',
        background: '#4F5D69',
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
