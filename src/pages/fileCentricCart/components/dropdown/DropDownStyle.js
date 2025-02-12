export const DROP_DOWN_WIDTH = '250px';
const BLUE = '#004D73';
const WHITE = '#FFFFFF'
const EXPORT_AND_DOWNLOAD_BTN_HEIGHT = '46px';
const commonTooltipStyle = {
  backgroundColor: '#FFFFFF !important',
  color:'#000000',
  border: '2px solid #B1B1B1 !important',
  minWidth: '282px',
  maxWidth: '282px',

  fontFamily: 'Nunito',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '16px',
  textAlign: 'left',
  padding: '12px',
}

export default () => ({
  dropDownBtnContainer : {
    float: 'right',
    maxHeight: EXPORT_AND_DOWNLOAD_BTN_HEIGHT
  },
  disableDropDownBtn: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
  availableDownloadDropdownBtnIsOpen: {
    backgroundColor: BLUE,
    borderTop: `1px solid ${BLUE}`,
    borderRight: `1px solid ${BLUE}`,
    borderLeft: `1px solid ${BLUE}`,
    borderTopRightRadius: '10px',
    borderTopLeftRadius: '10px',
    borderBottomRightRadius: '0px',
    borderBottomLeftRadius: '0px',

    width: DROP_DOWN_WIDTH,
    boxShadow: 'none',
    textWrap: 'nowrap',
    '&:hover': {
      backgroundColor: BLUE,
      boxShadow: 'none',
    },
  },
  availableDownloadDropdownBtn: {
    backgroundColor: BLUE,
    border: `1px solid ${BLUE}`,
    borderRadius: '10px',

    width: DROP_DOWN_WIDTH,
    boxShadow: 'none',
    textWrap: 'nowrap',
    '&:hover': {
      backgroundColor: BLUE,
      boxShadow: 'none',
    },
  },
  availableDownloadDropdownBtnLabel: {
    height: EXPORT_AND_DOWNLOAD_BTN_HEIGHT,
    color: WHITE,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    lineHeight: '14px',
    padding: '16px 20px',
  },
  availableDownloadBtn: {
    backgroundColor: '#3C597C !important',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  },
  availableDownloadDropdownBtnStartIcon: {
    margin: '0px',
  },

  // ------------------------ Drop Down Box ---------------------
  dropdownMenuList: {
    paddingTop: '0px',
    marginTop: '-1px',
    paddingBottom: '0px',
    textTransform: 'uppercase'
  },
  dropdownPaper: {
    maxWidth: DROP_DOWN_WIDTH,
    borderRadius: '0px',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    zIndex: 100,
  },
  endIcon: {
    // marginRight: '12px',
    marginLeft: '21px',
  },
  downloadFileManifestTooltipWrapper: {
    // display: 'flex',
    gap: '8px',
  },
  downloadFileManifestTooltip: {
    // display: 'flex',
    gap: '8px'
  },
  menuItemTooltip: {
    ...commonTooltipStyle,

    left: '-22px'
  },
  customTooltip: {
    ...commonTooltipStyle
  },
  arrow: {
    color: (props) => props.arrowColor || '#FFFFFF',
    '&::before': {
      border: '2px solid #B1B1B1',
    },
  },
  cgcIcon: {
    marginTop: '10px',
    marginLeft: '7px',
  },
  cgcLabal: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    lineHeight: '14px',
    fontWeight: 500,
    textAlign: 'left',

    float: 'left',
    width: '180px',
    textWrap: 'wrap',
    color: BLUE,
    paddingTop: '5px',
    // border: '1px solid black',
  },
  linkIcon: {
    width: '12px',
    height: '12px',
    marginLeft: '2px',
    marginBottom: '-2px',
  },
  fileManifestLabal: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    lineHeight: '14px',
    fontWeight: 500,
    textAlign: 'left',

    float: 'left',
    width: '105px',
    height: '35px',
    textWrap: 'wrap',
    color: BLUE,
    marginRight: '89px',
    paddingTop: '5px',
  },
  downloadFileIcon: {
    width: '20px',
    height: '20px',
    margingLeft: '4px',
    float: 'right',
    marginTop: '10px',
  },
});