export const wrapperCustomTheme = {
  MuiContainer: {
    root: {
      '&.container_footer': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        gap: '6px',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingRight: '29px',
        backgroundColor: '#E1EEEC',
      },
      '& img.add_selected_file_tooltip_icon': {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        verticalAlign: 'top',
        marginRight: '10px',
      },
    },
  },
  MuiButton: {
    root: {
      color: '#FFFFFF',
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '14px',
      textTransform: 'uppercase',
      borderRadius: '10px',
      cursor: 'pointer',
      padding: '16px 22px',
      height: '46px',
      '&.add_selected_button': {
        backgroundColor: '#06846A',
      },
      '&.add_selected_button_Biospecimens': {
        backgroundColor: '#06846A',
        padding: '7px 16px',
        lineHeight: '18px',
        width: '214px',
      },
      '&.add_selected_button_Files': {
        backgroundColor: '#06846A',
        width: '214px',
      },
      '&:hover': {
        backgroundColor: '#046D57',
      },
      '&.Mui-disabled': {
        color: '#FFFFFF',
        opacity: 0.5,
        '&.add_selected_button': {
          backgroundColor: '#06846A',
        },
        '&.add_selected_button_Biospecimens': {
          backgroundColor: '#06846A',
        },
        '&.add_selected_button_Files': {
          backgroundColor: '#06846A',
        },
      },
      '&.jbrowse_button': {
        backgroundColor: '#FFFFFF',
        color: '#09557B',
        fontFamily: 'Lato',
        fontWeight: 400,
        fontSize: '16px',
        textTransform: 'none',
        lineHeight: '16px',
        letterSpacing: '0.03em',
        padding: '5px 14px',
        borderRadius: '10px',
        border: '1px solid #09557B',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        height: '46px',
        '&:hover': {
          backgroundColor: '#E0EDF5',
        },
        '&.Mui-disabled': {
          color: '#09557B',
          border: '1px solid #09557B',
          backgroundColor: '#FFFFFF',
          cursor: 'not-allowed',
          opacity: 0.5,
        },
      },
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
