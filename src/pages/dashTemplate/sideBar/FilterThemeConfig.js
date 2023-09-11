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
        '&.participantsCheckedEven': {
          backgroundColor: '#e8f7dc',
        },
        '&.participantsCheckedOdd': {
          backgroundColor: '#f5FDEE',
        },
        '&.biospecimensCheckedEven': {
          backgroundColor: '#C9EBF7',
        },
        '&.biospecimensCheckedOdd': {
          backgroundColor: '#E8F8FE',
        },
        '&.filesCheckedEven': {
          backgroundColor: '#FBE3FB',
        },
        '&.filesCheckedOdd': {
          backgroundColor: '#FFF2FF',
        },
      },
    },
    MuiSvgIcon: {
      root: {
        '&.participantsCheckedIcon': {
          color: '#10a075',
        },
        '&.biospecimensCheckedIcon': {
          color: '#10beff',
        },
        '&.filesCheckedIcon': {
          color: '#e636e4',
        },
      },
    },
    MuiTypography: {
      root: {
        '&.participantsSubjects': {
          color: '#10a075',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.biospecimensSubjects': {
          color: '#10beff',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.filesSubjects': {
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
