import { themeConfig as baseThemeConfig } from '../dashTemplate/tabs/tableConfig/Theme';
import { customTheme } from '../dashTemplate/tabs/wrapperConfig/Theme';

export const themeConfig = {
  ...baseThemeConfig,
  tblBody: {
    ...baseThemeConfig.tblBody,
    MuiTableRow: {
      root: {
        '&:nth-child(even)': {
          background: '#EDFBFF',
        },
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        '&.Mui-checked': {
          color: '#13344A',
        },
      },
    },
  },
};

export { customTheme };
