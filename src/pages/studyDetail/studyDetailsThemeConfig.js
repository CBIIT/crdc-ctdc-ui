import React from 'react';
import _ from 'lodash';
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
      minWidth: 'fit-content',
      '@media (min-width: 600px)': {
        minWidth: 'fit-content',
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
