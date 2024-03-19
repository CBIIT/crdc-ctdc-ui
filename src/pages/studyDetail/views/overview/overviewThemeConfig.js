import React from 'react';
import _ from 'lodash';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import themes, { overrides } from '../../../../themes';

export default ({
  children,
}) => {
  const themesLight = _.cloneDeep(themes.light);
  themesLight.overrides.MuiTab = {
    root: {
      maxHeight: '45px',
      paddingTop: '0px',
      '& .last-child': {
        border: '1px solid black'
      }
    },
    
  };

  themesLight.overrides.MuiGrid = {
    item: {
      marginBottom: '0px',
    },
  };

  const computedTheme = createTheme({
    ...themesLight,
    ...overrides,
    breakpoints: {
      ...themes.light.custom.breakpoints,
      values: {
        ...themes.light.custom.breakpoints.values,
        md: themes.light.custom.breakpoints.values.customMd, // Set md breakpoint to 1100px
        sm: themes.light.custom.breakpoints.values.customSm, // Set sm breakpoint to 799px
      },
    },
  });

  return (
    <ThemeProvider theme={computedTheme}>
      {children}
    </ThemeProvider>
  );
};
