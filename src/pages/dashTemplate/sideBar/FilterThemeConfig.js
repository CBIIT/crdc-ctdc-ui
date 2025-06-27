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
          backgroundColor: '#E8F7DC',
        },
        '&.filter_by_participantsCheckedOdd': {
          backgroundColor: '#F5FCEF',
        },
        '&.filter_by_biospecimensCheckedEven': {
          backgroundColor: '#FFF2EA',
        },
        '&.filter_by_biospecimensCheckedOdd': {
          backgroundColor: '#FFF9F5',
        },
        '&.filter_by_data_filesCheckedEven': {
          backgroundColor: '#EDF8FD',
        },
        '&.filter_by_data_filesCheckedOdd': {
          backgroundColor: '#F8FBFC',
        },
      },
    },
    MuiSvgIcon: {
      root: {
        '&.filter_by_participantsCheckedIcon': {
          color: '#4F4F4F',
        },
        '&.filter_by_biospecimensCheckedIcon': {
          color: '#4F4F4F',
        },
        '&.filter_by_data_filesCheckedIcon': {
          color: '#4F4F4F',
        },
      },
    },
    MuiTypography: {
      root: {
        '&.filter_by_participantsSubjects': {
          color: '#217D5E',
          fontSize: '12px',
          fontFamily: 'Nunito',
          fontWeight: 400,
          marginRight: '0px',
        },
        '&.filter_by_biospecimensSubjects': {
          color: '#843806',
          fontSize: '12px',
          fontFamily: 'Nunito',
          fontWeight: 400,
          marginRight: '0px',
        },
        '&.filter_by_data_filesSubjects': {
          color: '#005A7A',
          fontSize: '12px',
          fontFamily: 'Nunito',
          fontWeight: 400,
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
