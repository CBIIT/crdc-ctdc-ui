import { themeConfig as baseThemeConfig } from '../dashTemplate/tabs/tableConfig/Theme';
import { customTheme } from '../dashTemplate/tabs/wrapperConfig/Theme';

export const themeConfig = {
  ...baseThemeConfig,
  toolbar: {
    MuiToolbar: {
      root: {
        minHeight: '36px !important',
      },
    },
    MuiTypography: {
      root: {
        fontFamily: 'Nunito !important',
        fontWeight: '400 !important',
        fontSize: '16px !important',
        lineHeight: '16px !important',
        letterSpacing: '0 !important',
        color: '#13344A !important',
      },
    },
  },
  tblHeader: {
    ...baseThemeConfig.tblHeader,
    MuiTableRow: {
      head: {
        height: '30px',
        maxHeight: '30px',
        borderBottom: '3px solid #42779a',
      },
    },
    MuiTableCell: {
      root: {
        paddingTop: '0px',
        paddingBottom: '0px',
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
