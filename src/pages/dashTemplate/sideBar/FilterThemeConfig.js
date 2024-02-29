import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = {
  overrides: {
    Mui: {
      '&$expanded': {
        margin: '0px 0px',
      },
      checked: {
        color: 'red',
      },
    },
    MuiAccordionDetails: {
      root: {
        padding: '0px 1px 0px',
      },
    },
    MuiAccordion: {
      root: {
        '&$expanded': {
          margin: 'auto',
        },
      },
    },
    MuiAccordionSummary: {
      content: {
        margin: '0',
      },
    },
    MuiList: {
      padding: {
        paddingTop: '0',
        paddingBottom: '0',
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        '&:first-child': {
          color: '#000000',
        },
      },
    },
    MuiListItem: {
      root: {
        '&.filter_by_participantsCheckedEven': {
          backgroundColor: '#e8f7dc',
        },
        '&.filter_by_participantsCheckedOdd': {
          backgroundColor: '#f5FDEE',
        },
        '&.filter_by_biospecimensCheckedEven': {
          backgroundColor: '#C9EBF7',
        },
        '&.filter_by_biospecimensCheckedOdd': {
          backgroundColor: '#E8F8FE',
        },
        '&.filter_by_data_filesCheckedEven': {
          backgroundColor: '#FBE3FB',
        },
        '&.filter_by_data_filesCheckedOdd': {
          backgroundColor: '#FFF2FF',
        },
      },
    },
    MuiSvgIcon: {
      root: {
        '&.filter_by_participantsCheckedIcon': {
          color: '#10a075',
        },
        '&.filter_by_biospecimensCheckedIcon': {
          color: '#10beff',
        },
        '&.filter_by_data_filesCheckedIcon': {
          color: '#e636e4',
        },
      },
    },
    MuiTypography: {
      root: {
        '&.filter_by_participantsSubjects': {
          color: '#10a075',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.filter_by_biospecimensSubjects': {
          color: '#10beff',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.filter_by_data_filesSubjects': {
          color: '#e636e4',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
      },
    },
    MuiDivider: {
      middle: {
        marginLeft: '0px',
        marginRight: '0px',
      },
      root: {
        height: '5px',
        '&.divider0': {
          backgroundColor: '#0d8461',
        },
        '&.divider1': {
          backgroundColor: '#EF660B',
        },
        '&.divider2': {
          backgroundColor: '#0696C9',
        },
      },
    },
    checkboxRoot: {
      color: 'inherit',
      '&$checked': {
        color: '#8DCAFF',
      },
    },
  },
};

export default ({
  children,
}) => {
  const computedTheme = createTheme(theme);
  return (
    <ThemeProvider theme={computedTheme}>
      {children}
    </ThemeProvider>
  );
};
