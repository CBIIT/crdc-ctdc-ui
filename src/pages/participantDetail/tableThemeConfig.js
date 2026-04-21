import { themeConfig as baseThemeConfig } from '../dashTemplate/tabs/tableConfig/Theme';
import { customTheme } from '../dashTemplate/tabs/wrapperConfig/Theme';

export const themeConfig = {
  ...baseThemeConfig,
  tblHeader: {
    ...baseThemeConfig.tblHeader,
    MuiTableCell: {
      root: {
        '&.participant_id': {
          paddingLeft: '0px',
        },
      },
    },
  },
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
    MuiTableCell: {
      ...baseThemeConfig.tblBody.MuiTableCell,
      root: {
        ...baseThemeConfig.tblBody.MuiTableCell.root,
        '&.participant_id': {
          paddingLeft: '0px',
        },
      },
    },
  },
};

export { customTheme };
