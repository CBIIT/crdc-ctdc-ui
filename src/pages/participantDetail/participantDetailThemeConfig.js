import React from 'react';
import _ from 'lodash';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import themes, { overrides } from '../../themes';

export default ({ children }) => {
  const themesLight = _.cloneDeep(themes.light);

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
