import React from 'react';
import _, { min } from 'lodash';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import themes, { overrides } from '../../themes';

export default ({
  children,
}) => {
  const themesLight = _.cloneDeep(themes.light);
  themesLight.overrides.MuiTab = {
    root: {
      maxHeight: '46px',
      padding: '0px',
      marginRight: '40px',
      textTransform: 'none',
      '@media (min-width: 600px)': {
        minWidth: '110px',
        marginRight: '20px',
      },
      '&:first-child': {
        paddingLeft: '0px',
      },
    },
  };

  const computedTheme = createTheme({
    ...themesLight,
    ...overrides,
  });

  return (
    <ThemeProvider theme={computedTheme}>
      {children}
    </ThemeProvider>
  );
};
