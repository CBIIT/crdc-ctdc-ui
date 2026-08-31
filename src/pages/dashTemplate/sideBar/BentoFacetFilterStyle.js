export default () => ({
  clearAllButtonRoot: {
    margin: 'auto',
  },
  customButton: {
    borderRadius: '9px',
    maxWidth: '30px',
    maxHeight: '30px',
    minWidth: '30px',
    minHeight: '30px',
    marginTop: '0px',
    fontSize: 9,
    textTransform: 'none',
    color: '#3d4241',
    marginLeft: '0px',
    '&:hover': {
      backgroundColor: '#566672',
      color: 'white',
    },
  },
  floatRight: {
    margin: '7px 0px 7px 6px',
  },
  resetText: {
    marginTop: '0px',
    marginLeft: '8px',
    color: '#4B78A0',
    fontSize: 14,
  },
  resetTextDisabled: {
    marginTop: '0px',
    marginLeft: '8px',
    color: '#4E575F',
    fontSize: 14,
  },
  cases: {
    height: '5px',
  },
  Cases: {
    height: '5px',
    margin: '0px',
    backgroundColor: '#0d8461',
  },
  Samples: {
    height: '5px',
    margin: '0px',
    backgroundColor: '#10beff',
  },
  Files: {
    height: '5px',
    margin: '0px',
    backgroundColor: '#e636e4',
  },
  sectionSummaryText: {
    fontSize: '14px',
    flexShrink: '0',
    fontFamily: 'Open Sans',
    fontWeight: '600',
    lineHeight: '1',
    marginLeft: '5px',
    letterSpacing: '0',
    overflowWrap: 'break-word',
    // textTransform: 'uppercase',
  },
  dropDownIconSubSection: {
    marginLeft: '0px',
    fill: '#000000',
  },
  customExpansionPanelSummaryRoot: {
    flexDirection: 'row-reverse',
    paddingLeft: 4,
  },
  customExpansionPanelSummaryRootView: {
    flexDirection: 'row-reverse',
    paddingLeft: 8,
  },
  sectionSummaryTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 300,
    lineHeight: '16px',
    marginLeft: 3,
    color: '#000000',

  },
  CasesCheckbox: {
    color: '#10A075',
  },
  CasesCheckedIcon: {
    color: '#10A075',
  },
  checkboxRoot: {
    marginLeft: '5px',
    height: 12,
  },
  panelDetailText: {
    color: '#323232',
    fontFamily: 'Nunito',
    fontSize: '14px',
    fontWeight: '200',
  },
  panelSubjectText: {
    color: '#323232',
    fontFamily: 'Nunito',
    fontSize: '14px',
  },
  "activeFacetFilter_by_Participants": {
    color: '#076448',
  },
  "activeFacetFilter_by_Biospecimens": {
    color: '#843806',
  },
  "activeFacetFilter_by_Data_Files": {
    color: '#005A7A',
  },
  searchContainer: {
    paddingTop: '15px',
    margin: '0 2px',
    marginRight: 6,
  },
  findCaseButton: {
    marginLeft: '0px', // 105px
    backgroundColor: '#08A383',
    boxSizing: 'border-box',
    height: 30,
    width: 40,
    border: '1.25px solid #11A075',
    cursor: 'pointer',
    borderRadius: 11,
    display: 'flex',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: '#026551',
    },
  },
  findCaseIcon: {
    width: 17,
    height: 17,
  },
  uploadButton: {
    boxSizing: 'border-box',
    fontWeight: 400,
    height: 32,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#06846A',
    color: '#fff',
    border: '1px solid #06846A',
    borderRadius: 7,
    fontFamily: 'Roboto',
    fontSize: 12,
    boxShadow: 'none',
    padding: '0px 10px',
    '&:hover': {
      backgroundColor: '#026551',
    },
  },
  iconSpan: {
    marginTop: '5.2px',
  },
  uploadIcon: {
    height: 16,
    width: 16,
  },
  customListPadding: {
    paddingTop: 8,
  },
  customDivider: {
    backgroundColor: '#B1B1B1',
    height: '2px',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 6,
  },
  uploadModalPaper: {
    border: '1px solid #1F344F',
    boxShadow: 'none',
    '& #local_find_upload_browse': {
      backgroundColor: '#026551',
      cursor: 'pointer',
    },
    '& #local_find_upload_input': {
      width: '143px',
      borderRadius: 0,
      cursor: 'pointer',
      '&::-webkit-file-upload-button': {
        cursor: 'pointer',
      },
      '&::file-selector-button': {
        cursor: 'pointer',
      },
    },
    '& #local_find_upload_cancel': {
      backgroundColor: '#4F5D69 !important',
    },
    '& #local_find_upload_clear': {
      backgroundColor: '#127EA6 !important',
    },
    '& #local_find_upload_submit': {
      backgroundColor: '#06846A !important',
    },
    '& [class*="fileName"]': {
      color: '#026551',
      fontFamily: 'Lato',
      fontSize: 14,
      fontStyle: 'italic',
      fontWeight: 700,
      lineHeight: '15px',
      paddingTop: 8,
      paddingBottom: 8,
    },
    '& [class*="horizontal"]': {
      marginTop: 0,
      display: 'none',
    },
    '& [class*="fileNameContainer"] ~ [class*="horizontal"]': {
      display: 'block',
    },
  },
  uploadModalOrTitle: {
    color: '#026551',
    fontWeight: 700,
    letterSpacing: '0.17px',
  },
  uploadModalTextArea: {
    border: '1.5px solid #026551',
    color: '#026551',
    fontFamily: 'Lato',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '19px',
    '&::placeholder': {
      color: '#026551',
      fontFamily: 'Lato',
      fontSize: 13,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '19px',
    },
    '&:focus': {
      outline: 'none',
      border: '1.5px solid #026551',
    },
  },
  uploadModalTitle: {
    color: '#08A383',
    lineHeight: '20px',
  },
  paper: {
    backgroundColor: '#595959',
    fontSize: 11,
    fontWeight: 600,
    lineHeight: '11px',
  },
  inputRoot: {
    color: '#000',
    fontWeight: 600,
    lineHeight: '11px',
    '& fieldset': {
      borderColor: '#026551 !important',
    },
  },
  option: {
    minHeight: 27,
  },
  searchResultDetailText: {
    color: '#026551',
    fontFamily: 'Lato',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '19px',
  },
  searchBoxRoot: {
    '& .MuiListItem-root': {
      paddingTop: 2,
      paddingBottom: 2,
    },
  },
  listItemGutters: {
    padding: '2px 10px 2px 10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  divider: {
    marginLeft: 0,
    marginRight: 0,
  },

});
