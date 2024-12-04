export const DROP_DOWN_WIDTH = '250px';
const BLUE = '#004D73';
const WHITE = '#FFFFFF'

export default () => ({
  dropDownBtnContainer : {
    float: 'right',
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
    height: '46px',
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
    paddingBottom: '0px',

    // backgroundColor: WHITE,

    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    // border: `2px solid ${BLUE}`,
    textTransform: 'uppercase'
  },
  dropdownPaper: {
    maxWidth: DROP_DOWN_WIDTH,
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    // border: `2px solid ${BLUE}`,

    zIndex: 100,
  },
  downloadFileManifestBtn: {
    backgroundColor: '#3C597C',
    borderRadius: '8px',
    border: '1px solid #3C597C',
    boxShadow: 'none',
    width: DROP_DOWN_WIDTH,
    fontFamily: 'Lato',
    fontStyle: 'normal',
    // maxWidth: '287px',
    fontWeight: 400,
    fontSize: '16px',
    textTransform: 'none',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1A3D69',
      boxShadow: 'none',
    },
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
    // border: '1px solid black',
  },
  linkIcon: {
    width: '12px',
    height: '12px',
    marginLeft: '3px',
  },
  fileManifestLabal: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    lineHeight: '14px',
    fontWeight: 500,
    textAlign: 'left',

    float: 'left',
    width: '190px',
    height: '35px',
    textWrap: 'wrap',
    color: BLUE,
    // border: '1px solid black'

  },
  downloadFileIcon: {
    width: '20px',
    height: '20px',
    margingLeft: '4px',
    float: 'right',
    marginTop: '10px',
  },
});